import {
  CheckCircle2,
  Circle
} from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    solved: true
  },
  {
    title: "Merge Sorted Array",
    difficulty: "Easy",
    solved: true
  },
  {
    title: "Binary Tree Paths",
    difficulty: "Medium",
    solved: false
  },
  {
    title: "Word Ladder",
    difficulty: "Hard",
    solved: false
  },
  {
    title: "LRU Cache",
    difficulty: "Medium",
    solved: true
  }
];

const difficultyColor = {
  Easy: "text-emerald-400",
  Medium: "text-amber-400",
  Hard: "text-red-400"
};

function ProblemShowcase() {
  return (
    <section
      id="problems"
      className="py-32 px-6"
    >
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-20">
          <h2 className="font-heading text-5xl font-bold">
            Practice Real Coding Problems
          </h2>

          <p className="mt-5 text-zinc-400 text-lg">
            Solve curated problems and prepare for coding interviews.
          </p>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 50
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          className="
            bg-card
            border
            border-border
            rounded-[32px]
            overflow-hidden
            shadow-2xl
          "
        >
          <div className="border-b border-border p-5 flex justify-between text-zinc-400">
            <span>Problem</span>
            <span>Difficulty</span>
          </div>

          {problems.map((problem) => (
            <div
              key={problem.title}
              className="
                p-5
                border-b
                border-border
                flex
                justify-between
                items-center
                hover:bg-zinc-900/50
                transition
              "
            >
              <div className="flex items-center gap-4">
                {problem.solved ? (
                  <CheckCircle2
                    className="text-emerald-500"
                    size={22}
                  />
                ) : (
                  <Circle
                    className="text-zinc-500"
                    size={20}
                  />
                )}

                <span className="font-medium">
                  {problem.title}
                </span>
              </div>

              <span
                className={difficultyColor[problem.difficulty]}
              >
                {problem.difficulty}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default ProblemShowcase;