import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-zinc-800">

      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

        <a className="font-heading text-2xl font-bold"
          href="/">
          CodeForge
        </a>

        <div className="hidden md:flex  items-center gap-8 text-zinc-400">
          <a
            href="#features"
            className="relative transition-colors duration-300 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Features
          </a>

          <a
            href="#ai"
            className="relative transition-colors duration-300 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            AI Assistant
          </a>

          <a
            href="#problems"
            className="relative transition-colors duration-300 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Problems
          </a>

          <a
            href="#footer"
            className="relative transition-colors duration-300 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Contact
          </a>

          <Link
            to="/signup"
            className="btn btn-primary shadow-lg shadow-primary/20 hover:scale-105 hover:shadow-primary/40 transition-all duration-300">
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;