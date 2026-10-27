const TYPE_CLASSES = {
  success: 'bg-stone-800 dark:bg-stone-700 text-stone-50 border-stone-700 dark:border-stone-600',
  error:   'bg-rose-700 dark:bg-rose-800 text-white border-rose-600 dark:border-rose-700',
  info:    'bg-stone-600 dark:bg-stone-700 text-stone-50 border-stone-500 dark:border-stone-600',
}

const TYPE_ICONS = {
  success: 'fa-circle-check',
  error:   'fa-circle-exclamation',
  info:    'fa-circle-info',
}

// Notificaciones Toast
export default function ToastContainer({ toasts, onClose }) {
  return (
    <div
      className="fixed bottom-16 sm:bottom-4 right-3 left-3 sm:left-auto sm:right-4 z-50 flex flex-col gap-2 sm:max-w-sm pointer-events-none"
      aria-live="polite"
      aria-label="Notificaciones"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`${TYPE_CLASSES[toast.type]} pointer-events-auto px-4 py-3 border text-sm flex items-center justify-between gap-3 animate-fade-in`}
        >
          <div className="flex items-center gap-2.5">
            <i className={`fa-solid ${TYPE_ICONS[toast.type]} text-xs shrink-0`} aria-hidden="true" />
            <span className="text-sm leading-snug">{toast.message}</span>
          </div>
          <button
            onClick={() => onClose(toast.id)}
            className="text-current opacity-60 hover:opacity-100 p-1 transition-opacity shrink-0"
            aria-label="Cerrar notificación"
          >
            <i className="fa-solid fa-xmark text-xs" />
          </button>
        </div>
      ))}
    </div>
  )
}
