import {
  CheckCircle2,
  Circle
} from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    solved: true,
    acceptance: "54%",
    tag: "Array"
  },
  {
    title: "Merge Sorted Array",
    difficulty: "Easy",
    solved: true,
    acceptance: "61%",
    tag: "Two Pointers"
  },
  {
    title: "Binary Tree Paths",
    difficulty: "Medium",
    solved: false,
    acceptance: "43%",
    tag: "Tree"
  },
  {
    title: "Word Ladder",
    difficulty: "Hard",
    solved: false,
    acceptance: "31%",
    tag: "Graph"
  },
  {
    title: "LRU Cache",
    difficulty: "Medium",
    solved: true,
    acceptance: "38%",
    tag: "Design"
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
          <span className="text-primary font-semibold">
            PROBLEMS
          </span>

          <h2 className="font-heading text-5xl md:text-6xl font-bold mt-5">
            Learn by solving
            <br />
            real coding challenges.
          </h2>

          <p className="mt-6 text-zinc-400 text-lg max-w-2xl mx-auto leading-8">
            Explore curated problems across multiple topics and improve your
            problem-solving skills one challenge at a time.
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
          className="overflow-hidden rounded-[36px] border border-zinc-800 bg-card shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
        >


          <div className="grid md:grid-cols-4 border-b border-zinc-800">

            <div className="p-6 border-r border-zinc-800">
              <p className="text-zinc-500 text-sm">
                Problems
              </p>

              <h3 className="text-3xl font-bold mt-2">
                100+
              </h3>
            </div>

            <div className="p-6 border-r border-zinc-800">
              <p className="text-zinc-500 text-sm">
                Topics
              </p>

              <h3 className="text-3xl font-bold mt-2">
                12+
              </h3>
            </div>

            <div className="p-6 border-r border-zinc-800">
              <p className="text-zinc-500 text-sm">
                Languages
              </p>

              <h3 className="text-3xl font-bold mt-2">
                3+
              </h3>
            </div>

            <div className="p-6">
              <p className="text-zinc-500 text-sm">
                AI Assistant
              </p>

              <h3 className="text-3xl font-bold mt-2">
                ✓
              </h3>
            </div>

          </div>



          <div className="p-5 border-b border-zinc-800">
            <div className="
    h-12
    rounded-2xl
    bg-zinc-900
    border
    border-zinc-800
    px-5
    flex
    items-center
    text-zinc-500
  ">
              Search problems...
            </div>
          </div>




          <div className="
  px-6
  py-4
  text-sm
  text-zinc-500
  grid
  grid-cols-[1fr_140px_140px_120px]
">
            <span>Problem</span>
            <span>Difficulty</span>
            <span>Acceptance</span>
            <span>Topic</span>
          </div>



          {problems.map((problem) => (
            <div
              key={problem.title}
              className="
      px-6
      py-5
      border-t
      border-zinc-800
      grid
      grid-cols-[1fr_140px_140px_120px]
      items-center
      hover:bg-zinc-900/40
      transition
      duration-300
      cursor-pointer
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
                    className="text-zinc-600"
                    size={20}
                  />
                )}

                <div>
                  <h4 className="font-semibold">
                    {problem.title}
                  </h4>

                  <p className="text-xs text-zinc-500 mt-1">
                    Solve challenge
                  </p>
                </div>
              </div>

              <span
                className={`
        font-medium
        ${difficultyColor[problem.difficulty]}
      `}
              >
                {problem.difficulty}
              </span>

              <span className="text-zinc-400">
                {problem.acceptance}
              </span>

              <span className="
      text-xs
      rounded-full
      bg-zinc-900
      border
      border-zinc-800
      px-3
      py-1
      w-fit
    ">
                {problem.tag}
              </span>
            </div>
          ))}




          <div className="
  border-t
  border-zinc-800
  p-6
  flex
  justify-between
  items-center
">
  <div>
    <h3 className="font-semibold">
      Ready to solve more?
    </h3>

    <p className="text-zinc-500 mt-1 font-medium text-md">
      Explore hundreds of coding challenges.
    </p>
  </div>

  <a className="btn btn-primary rounded-2xl"
  href="/problems">
    View All Problems
  </a>
</div>
        </motion.div>

      </div>
    </section>
  );
}

export default ProblemShowcase;