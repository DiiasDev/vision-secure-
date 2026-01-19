export default function Acerto() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[var(--bg-card)] rounded-xl shadow-md border border-[var(--border-default)] p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--color-primary-light)] rounded-full mb-6">
              <svg
                className="w-10 h-10 text-[var(--color-primary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
              Página em Construção
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-2">
              A página de <span className="font-semibold">Acerto</span> está sendo desenvolvida.
            </p>
            <p className="text-[var(--text-muted)] text-sm">
              Em breve, você terá acesso a todas as funcionalidades desta seção.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
