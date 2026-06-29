import {
  Check,
  Bot,
  User
} from "lucide-react";
import { motion } from "framer-motion";

function AISection() {
  return (
    <section
      id="ai"
      className="py-32 px-6"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

        {/* Chat Screenshot */}

        <motion.div
          initial={{
            opacity: 0,
            x: -80
          }}
          whileInView={{
            opacity: 1,
            x: 0
          }}
          viewport={{
            once: true
          }}
          className="bg-card border border-border rounded-4xl overflow-hidden shadow-2xl">
          <div className="border-b border-border p-5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Bot />
            </div>

            <div>
              <h3 className="font-bold">
                Forge AI
              </h3>

              <p className="text-xs text-success">
                ● Online
              </p>
            </div>
          </div>

          <div className="p-6 space-y-5">

            <div className="flex gap-3 items-center justify-end">
              <div className="bg-primary/10 rounded-2xl p-4">
                How can I optimize Two Sum?
              </div>

              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                <User size={18} />
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Bot size={18} />
              </div>

              <div className="bg-zinc-800 rounded-2xl p-4 text-zinc-200">
                Use a HashMap to reduce time complexity from O(n²) to O(n).
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Content */}

        <motion.div
          initial={{
            opacity: 0,
            x: 80
          }}
          whileInView={{
            opacity: 1,
            x: 0
          }}
          viewport={{
            once: true
          }}
        >
          <p className="text-primary font-semibold mb-5">
            AI Assistant
          </p>

          <h2 className="font-heading text-6xl font-bold leading-tight">
            Meet Forge AI
          </h2>

          <p className="text-zinc-400 mt-6 text-lg leading-8">
            Built specifically for coding interviews and algorithm learning.
            Ask questions naturally and receive focused guidance.
          </p>

          <div className="mt-10 space-y-5">

            {[
              "Hints & Approaches",
              "Debugging Help",
              "Complexity Analysis",
              "Code Optimization",
              "Multiple Languages"
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <Check
                    size={18}
                    className="text-success"
                  />
                </div>

                <span className="text-lg">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default AISection;