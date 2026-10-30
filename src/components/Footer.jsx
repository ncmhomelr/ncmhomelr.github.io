export default function Footer() {
    return (
        <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 bg-cream-100 dark:bg-stone-950 transition-colors duration-200">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-7 text-center sm:flex-row sm:px-6 sm:py-6 sm:text-left lg:px-8">
                <div className="flex flex-col gap-1">
                    <span className="font-editorial text-base font-semibold tracking-tight text-espresso-800 dark:text-stone-100">
                        NCM Home
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                        © {new Date().getFullYear()} NCM Home. Todos los derechos reservados.
                    </span>
                </div>

                <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                    Diseñado y desarrollado por{' '}
                    <a
                        href="https://titomiotto.github.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-espresso-600 underline decoration-stone-300 underline-offset-4 transition-colors duration-200 hover:text-sienna-500 hover:decoration-sienna-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sienna-500 dark:text-stone-200 dark:decoration-stone-600 dark:hover:text-sienna-400"
                        aria-label="Visitar el portfolio de Tito Montivero (se abre en otra pestaña)"
                    >
                        Tito Montivero
                    </a>
                </p>
            </div>
        </footer>
    )
}
