import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-white/10 py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-sm text-[#c8c4bc]">&copy; {new Date().getFullYear()} Confetti. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="font-mono text-sm text-[#c8c4bc] hover:text-paper min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded px-1">
            Privacy
          </Link>
          <Link to="/terms" className="font-mono text-sm text-[#c8c4bc] hover:text-paper min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded px-1">
            Terms
          </Link>
          <a href="mailto:hello@confetti.events" className="font-mono text-sm text-[#c8c4bc] hover:text-paper min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded px-1">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}