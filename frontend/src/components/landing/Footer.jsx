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
      className="
        border-t
        border-border
        py-16
        px-6
      "
    >
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col lg:flex-row justify-between gap-10">

          <div>
            <h2 className="font-heading text-3xl font-bold">
              CodeForge
            </h2>

            <p className="mt-4 text-zinc-400 max-w-md">
              AI-powered coding platform for learning algorithms,
              practicing interview questions and improving
              problem-solving skills.
            </p>
          </div>

          <div className="flex gap-6">

            <a
              href="https://github.com/gauravGunjal14"
              target="blank"
              className="
                w-12
                h-12
                rounded-2xl
                bg-card
                border
                border-border
                flex
                items-center
                justify-center
                hover:border-primary
                transition
              "
            >
              {/* <Github size={20} /> */}
            </a>

            <a
              href="https://www.linkedin.com/in/gaurav-gunjal14/"
              target="blank"
              className="
                w-12
                h-12
                rounded-2xl
                bg-card
                border
                border-border
                flex
                items-center
                justify-center
                hover:border-primary
                transition
              "
            >
              {/* <Linkedin size={20} /> */}
            </a>

            <a
              href="#"
              target="blank"
              className="
                w-12
                h-12
                rounded-2xl
                bg-card
                border
                border-border
                flex
                items-center
                justify-center
                hover:border-primary
                transition
              "
            >
              {/* <Globe size={20} /> */}
            </a>

          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8 text-center text-zinc-500">
          © {new Date().getFullYear()} CodeForge. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;