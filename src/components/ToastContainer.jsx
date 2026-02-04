import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import './Toast.css';

export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            {toasts.map((toast) => {
                // Use custom icon if provided, otherwise use default based on type
                const IconComponent = toast.icon ||
                    (toast.type === 'success' ? CheckCircle :
                     toast.type === 'error' ? AlertCircle : Info);

                const defaultColor = toast.type === 'success' ? 'var(--primary-color)' :
                                   toast.type === 'error' ? '#ef4444' : '#3b82f6';

                return (
                    <div key={toast.id} className={`toast toast-${toast.type}`}>
                        <div className="toast-content">
                            <span className="toast-icon">
                                <IconComponent size={20} color={defaultColor} />
                            </span>
                            <span>{toast.message}</span>
                        </div>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>
                            <X size={16} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};
