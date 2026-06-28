import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-zinc-800">

      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

        <h1 className="font-heading text-2xl font-bold">
          CodeForge
        </h1>

        <div className="flex items-center gap-8">

          <div className="hidden md:flex gap-8 text-zinc-400">
            <a href="#features">Features</a>
            <a href="#ai">AI Assistant</a>
            <a href="#problems">Problems</a>
            <a href="#footer">Contact</a>
          </div>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="hidden md:flex btn btn-ghost"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="btn btn-primary"
            >
              Get Started
            </Link>
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;