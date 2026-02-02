import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import './Toast.css';

export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    <div className="toast-content">
                        <span className="toast-icon">
                            {toast.type === 'success' && <CheckCircle size={20} color="var(--primary-color)" />}
                            {toast.type === 'error' && <AlertCircle size={20} color="#ef4444" />}
                            {toast.type === 'info' && <Info size={20} color="#3b82f6" />}
                        </span>
                        <span>{toast.message}</span>
                    </div>
                    <button className="toast-close" onClick={() => removeToast(toast.id)}>
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};
