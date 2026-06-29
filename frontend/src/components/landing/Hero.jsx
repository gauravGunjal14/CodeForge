import { motion } from "framer-motion";
import FloatingEditor from "./FloatingEditor";
import { Link } from "react-router";

function Hero() {
  return (
    <section className="min-h-screen flex items-center pb-10">

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">

        <div>

          <p className="text-primary font-semibold mb-5">
            AI Powered Coding Platform
          </p>

          <h1 className="font-heading text-6xl lg:text-7xl font-bold leading-tight">
            Practice.
            <br />
            Understand.
            <br />
            Get Better.
          </h1>

          <p className="mt-8 text-zinc-400 text-lg leading-8 max-w-xl">
            Solve coding challenges, explore algorithms, and learn more effectively
            with an AI-powered platform built for continuous growth and hands-on practice.
          </p>

          <div className="mt-10 flex gap-4">
            <Link
              to="/signup"
              className="btn btn-primary btn-lg cursor"
            >
              Start Solving
            </Link>

            <Link
              to="/problems"
              className="btn btn-outline btn-lg"
            >
              View Problems
            </Link>
          </div>

        </div>

        <FloatingEditor />

      </div>

    </section>
  );
}

export default Hero;