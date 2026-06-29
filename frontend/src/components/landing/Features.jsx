import {
  BrainCircuit,
  Code2,
  BarChart3,
  MonitorCog,
  Bot,
  Cpu
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Forge AI",
    label: "AI Assistant",
    desc: "Ask for hints, debugging help, complexity analysis, and optimization guidance in real time.",
    icon: BrainCircuit,
    className: "lg:col-span-2 lg:row-span-1"
  },
  {
    title: "Online Judge",
    label: "Execution Engine",
    desc: "Run and validate solutions against hidden test cases.",
    icon: Cpu
  },
  {
    title: "Monaco Editor",
    label: "Editor",
    desc: "Professional coding environment with syntax highlighting.",
    icon: Code2
  },
  {
    title: "Submission Analytics",
    label: "Insights",
    desc: "Track progress, attempts and accepted solutions.",
    icon: BarChart3
  },
  {
    title: "Interactive Learning",
    label: "Learning",
    desc: "Practice problems and improve problem-solving skills.",
    icon: MonitorCog,
  }
];

function Features() {
  return (
    <section id="features" className="py-32 px-6">

      {/* header */}
      <div className="text-center mb-24">
        <span className="text-primary font-semibold">
          FEATURES
        </span>

        <h2 className="font-heading text-5xl md:text-6xl font-bold mt-5">
          Everything you need to
          <br />
          become a better problem solver.
        </h2>

        <p className="mt-6 text-zinc-400 text-lg max-w-2xl mx-auto leading-8">
          Practice coding, understand algorithms, and learn faster with
          intelligent tools designed for modern developers.
        </p>
      </div>

      {/* grid */}
      <div className="grid lg:grid-cols-3 auto-rows-[260px] gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
              initial={{
                opacity: 0,
                y: 50
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1
              }}
              viewport={{
                once: true
              }}
              className={`group relative overflow-hidden rounded-[36px] border border-zinc-800 bg-card p-8 transition-all duration-500 hover:border-primary/50 hover:-translate-y-2
          ${feature.className || ""}`}
            >
              {/* Glow */}
              <div className="absolute right-0 top-0 pointer-events-none h-40 w-40 rounded-full bg-primary/10 blur-[80px] opacity-0 transition duration-500 group-hover:opacity-100" />

              <div className="relative z-10 h-full flex flex-col justify-between">

                <div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon
                      size={28}
                      className="text-primary"
                    />
                  </div>

                  <span className="inline-block mt-6 text-xs uppercase tracking-widest text-zinc-500">
                    {feature.label}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-zinc-400 leading-7">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}

export default Features;