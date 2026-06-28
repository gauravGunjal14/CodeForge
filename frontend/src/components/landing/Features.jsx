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
    title: "AI Coding Mentor",
    desc: "Get hints, debugging help, complexity analysis and optimization guidance.",
    icon: BrainCircuit,
    className: "lg:col-span-2"
  },
  {
    title: "Online Judge",
    desc: "Run and submit code against hidden test cases.",
    icon: Cpu
  },
  {
    title: "Monaco Editor",
    desc: "Professional editor with syntax highlighting and multiple languages.",
    icon: Code2
  },
  {
    title: "Submission Analytics",
    desc: "Track attempts, accepted solutions and progress.",
    icon: BarChart3
  },
  {
    title: "Interactive Platform",
    desc: "Built for interview preparation and DSA mastery.",
    icon: MonitorCog
  }
];

function Features() {
  return (
    <section
      id="features"
      className="py-32 px-6"
    >
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-20">
          <h2 className="font-heading text-5xl font-bold">
            Built for serious problem solvers.
          </h2>

          <p className="mt-5 text-zinc-400 text-lg">
            Everything you need to prepare for coding interviews.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 auto-rows-[250px]">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 40
                }}
                whileInView={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: index * 0.1
                }}
                viewport={{
                  once: true
                }}
                className={`
                  bg-card
                  border
                  border-border
                  rounded-[32px]
                  p-8
                  flex
                  flex-col
                  justify-between
                  hover:border-primary/50
                  transition-all
                  ${feature.className || ""}
                `}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon
                    className="text-primary"
                    size={28}
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-zinc-400 leading-7">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;