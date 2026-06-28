import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="py-40 px-6">
      <div
        className="
          max-w-6xl
          mx-auto
          rounded-[40px]
          border
          border-border
          bg-card
          p-16
          text-center
        "
      >
        <h2 className="font-heading text-5xl font-bold">
          Ready to sharpen your
          <br />
          problem-solving skills?
        </h2>

        <p className="mt-6 text-zinc-400 text-lg">
          Join CodeForge and start solving coding challenges with AI guidance.
        </p>

        <Link
          to="/signup"
          className="
            btn
            btn-primary
            btn-lg
            mt-10
          "
        >
          Start Solving
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

export default CTA;