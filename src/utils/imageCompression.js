/**
 * Image Compression Utility
 * Compresses images to a target size for base64 storage in Firestore
 */

/**
 * Compress an image file to a target size
 * @param {File} file - The image file to compress
 * @param {number} maxSizeKB - Maximum size in KB (default 500KB for Firestore)
 * @param {number} maxDimension - Maximum width/height (default 400px for avatars)
 * @returns {Promise<string>} - Base64 encoded compressed image
 */
export async function compressImage(file, maxSizeKB = 500, maxDimension = 400) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculate new dimensions maintaining aspect ratio
                let { width, height } = img;

                if (width > height) {
                    if (width > maxDimension) {
                        height = (height * maxDimension) / width;
                        width = maxDimension;
                    }
                } else {
                    if (height > maxDimension) {
                        width = (width * maxDimension) / height;
                        height = maxDimension;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw image with smoothing
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                // Try different quality levels to hit target size
                let quality = 0.9;
                let result = canvas.toDataURL('image/jpeg', quality);

                // Reduce quality until we're under the size limit
                while (result.length > maxSizeKB * 1024 * 1.37 && quality > 0.1) {
                    quality -= 0.1;
                    result = canvas.toDataURL('image/jpeg', quality);
                }

                // If still too large, reduce dimensions further
                if (result.length > maxSizeKB * 1024 * 1.37) {
                    const scale = 0.7;
                    canvas.width = width * scale;
                    canvas.height = height * scale;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    result = canvas.toDataURL('image/jpeg', 0.7);
                }

                resolve(result);
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Get file size from base64 string (approximate)
 * @param {string} base64 - Base64 encoded string
 * @returns {number} - Size in KB
 */
export function getBase64SizeKB(base64) {
    // Remove data URL prefix if present
    const base64String = base64.split(',')[1] || base64;
    // Base64 is ~33% larger than binary
    return Math.round((base64String.length * 3) / 4 / 1024);
}
