from PIL import Image, ImageChops
import os

def process_logo(source_path, public_dir):
    """
    Processes a screenshot of the logo (taken on a black background)
    into high-quality transparent PNG icons for branding and PWA.
    """
    if not os.path.exists(source_path):
        print(f"Error: Source image not found at {source_path}")
        return

    print(f"Processing {source_path}...")
    img = Image.open(source_path).convert("RGBA")
    
    # 1. Trim black background to find content bounds
    bg = Image.new('RGBA', img.size, (0, 0, 0, 255))
    diff = ImageChops.difference(img, bg)
    bbox = diff.getbbox()
    if bbox:
        # Add slight margin
        margin = 20
        img = img.crop((
            max(0, bbox[0] - margin),
            max(0, bbox[1] - margin),
            min(img.width, bbox[2] + margin),
            min(img.height, bbox[3] + margin)
        ))
    
    # 2. Convert black background to transparency
    # Using the brightness of the image as the alpha mask
    r, g, b, a = img.split()
    # Mask = (R + G + B) or max(R, G, B)
    # Let's use max for neon colors
    mask = ImageChops.screen(r.point(lambda x: min(255, x*2)), 
                             g.point(lambda x: min(255, x*2)))
    mask = ImageChops.screen(mask, b.point(lambda x: min(255, x*2)))
    img.putalpha(mask)
    
    # 3. Square the image with padding
    w, h = img.size
    side = max(w, h)
    new_img = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    new_img.paste(img, ((side - w) // 2, (side - h) // 2))
    
    # 4. Save to all required targets
    targets = [
        ('logo.png', (512, 512)),
        ('icon.png', (512, 512)),
        ('pwa-192x192.png', (192, 192)),
        ('pwa-512x512.png', (512, 512)),
        ('apple-touch-icon.png', (180, 180))
    ]
    
    for filename, size in targets:
        dest = os.path.join(public_dir, filename)
        resized = new_img.resize(size, Image.Resampling.LANCZOS)
        resized.save(dest)
        print(f"Saved {dest} ({size[0]}x{size[1]})")

if __name__ == "__main__":
    SCREENSHOT_PATH = "/Users/binodacharya/.gemini/antigravity/brain/e5a00675-dc98-444a-8a57-97911a5ec6c1/high_res_logo_black_bg_1770788476423.png"
    PUBLIC_DIR = "/Users/binodacharya/Documents/bountyprep/public"
    
    process_logo(SCREENSHOT_PATH, PUBLIC_DIR)
