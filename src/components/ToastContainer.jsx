const TYPE_CLASSES = {
  success: 'bg-green-700 dark:bg-green-800 text-white',
  error: 'bg-red-700 dark:bg-red-800 text-white',
  info: 'bg-blue-700 dark:bg-blue-800 text-white',
}

const TYPE_ICONS = {
  success: 'fa-circle-check',
  error: 'fa-circle-exclamation',
  info: 'fa-circle-info',
}

// Notificaciones Toast (posición pensada para no tapar controles en móvil)
export default function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed bottom-16 sm:bottom-4 right-3 left-3 sm:left-auto sm:right-4 z-50 flex flex-col gap-2 max-w-sm sm:max-w-md pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${TYPE_CLASSES[toast.type]} pointer-events-auto px-4 py-2.5 sm:py-3 rounded-lg shadow-xl text-xs sm:text-sm flex items-center justify-between gap-3 animate-fade-in border border-white/10`}
        >
          <div className="flex items-center gap-2">
            <i className={`fa-solid ${TYPE_ICONS[toast.type]}`}></i>
            <span>{toast.message}</span>
          </div>
          <button onClick={() => onClose(toast.id)} className="text-white/80 hover:text-white p-1">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      ))}
    </div>
  )
}
