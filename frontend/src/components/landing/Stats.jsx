import { motion } from "framer-motion";
import {
  Code2,
  BrainCircuit,
  Database,
  Trophy
} from "lucide-react";

const stats = [
  {
    icon: Code2,
    number: "100+",
    title: "Problems"
  },
  {
    icon: Database,
    number: "3",
    title: "Languages"
  },
  {
    icon: BrainCircuit,
    number: "AI",
    title: "Assistant"
  },
  {
    icon: Trophy,
    number: "1000+",
    title: "Submissions"
  }
];

function Stats() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
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
                  rounded-[30px]
                  p-8
                  text-center
                "
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon
                      className="text-primary"
                      size={30}
                    />
                  </div>
                </div>

                <h3 className="text-5xl font-bold font-heading">
                  {item.number}
                </h3>

                <p className="mt-3 text-zinc-400">
                  {item.title}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Stats;