import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-lg border text-sm font-medium transition-all transform animate-pulse-subtle ${
            toast.type === 'warning'
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : toast.type === 'info'
              ? 'bg-blue-50 text-blue-900 border-blue-200'
              : 'bg-emerald-50 text-emerald-950 border-emerald-200'
          }`}
        >
          {toast.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-5 h-5 text-blue-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <span className="flex-1">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
