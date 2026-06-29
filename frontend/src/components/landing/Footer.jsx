import {
  //   Github,
  //   Linkedin,
  //   Globe
} from "lucide-react";
import { Link } from "react-router";

function Footer() {
  return (
    <footer
      id="footer"
      className="relative overflow-hidden border-t border-zinc-800 pt-20 px-6 pb-8"
    >

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-60 w-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex justify-between mx-20">

        {/* Left */}

        <div>
          <h2 className="font-heading text-3xl font-bold">
            CodeForge
          </h2>

          <p className="mt-4 text-zinc-400 max-w-md leading-7">
            An AI-powered coding platform designed to help developers
            practice problems, understand algorithms, and improve
            problem-solving skills through interactive learning.
          </p>
        </div>

        {/* Links */}

        <div className="flex w-[40%] justify-around">

          <div>
            <h3 className="font-semibold mb-5">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-zinc-400">
              <a
                href="#features"
                className="hover:text-white transition"
              >
                Features
              </a>

              <a
                href="#ai"
                className="hover:text-white transition"
              >
                Forge AI
              </a>

              <a
                href="#problems"
                className="hover:text-white transition"
              >
                Problems
              </a>
            </div>
          </div>

          {/* Social */}

          <div>
            <h3 className="font-semibold mb-5">
              Connect
            </h3>

            <div className="flex gap-4">
              <div className="flex gap-4">

                <a
                  href="https://github.com/gauravGunjal14"
                  target="_blank"
                  rel="noreferrer"
                  className="group w-12 h-12 rounded-2xl border border-zinc-800 bg-card flex items-center justify-center hover:border-primary hover:-translate-y-1 transition-all">
                  {/* <Github
            size={20}
            className="text-zinc-400 group-hover:text-white"
          /> */}
                </a>

                <a
                  href="https://www.linkedin.com/in/gaurav-gunjal14/"
                  target="_blank"
                  rel="noreferrer"
                  className="group w-12 h-12 rounded-2xl border border-zinc-800 bg-card flex items-center justify-center hover:border-primary hover:-translate-y-1 transition-all">
                  {/* <Linkedin
            size={20}
            className="text-zinc-400 group-hover:text-white"
          /> */}
                </a>

                <a
                  href="#"
                  className="group w-12 h-12 rounded-2xl border border-zinc-800 bg-card flex items-center justify-center hover:border-primary hover:-translate-y-1 transition-all">
                  {/* <Globe
            size={20}
            className="text-zinc-400 group-hover:text-white"
          /> */}
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-16 border-t border-zinc-800 pt-8">
        <div className="mx-20 flex flex-col items-center justify-center text-zinc-500">
          <p>
            © {new Date().getFullYear()} CodeForge.
            All rights reserved.
          </p>
        </div>
      </div>

    </footer>
  );
}

export default Footer;