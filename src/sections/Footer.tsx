export function Footer() {
  return (
    <footer className="py-8 border-t border-rule">
      <div className="wrap flex flex-wrap items-center justify-between gap-4
                       font-mono text-[12.5px] text-ink-dim">
        <span>&copy; 2026 Ishu Singh</span>
        <span>Built with Vite + React + Tailwind + Framer Motion. No frameworks were harmed.</span>
        <a href="https://github.com/ishunteam-png/portfolio-site"
           target="_blank" rel="noopener"
           className="hover:text-lime transition-colors">
          source →
        </a>
      </div>
    </footer>
  );
}
