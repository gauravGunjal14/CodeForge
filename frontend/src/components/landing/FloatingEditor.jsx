import { motion } from "framer-motion";
import {
  CheckCircle2,
  FileCode2
} from "lucide-react";

function FloatingEditor() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 80
      }}
      animate={{
        opacity: 1,
        x: 0,
        rotate: 2
      }}
      transition={{
        duration: 1
      }}
      whileHover={{
        rotate: 0,
        y: -5,
        scale: 1.02
      }}
      className="hidden lg:flex flex-col w-full max-w-2xl rounded-4xl overflow-hidden border border-zinc-800 bg-[#0C0C0E] shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
      
      {/* Top Bar */}
      <div className="h-14 px-5 border-b border-zinc-800 flex items-center justify-between bg-card">

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>

        <div className="flex items-center gap-2 text-zinc-400 text-sm">
          <FileCode2 size={16} />
          twoSum.js
        </div>

        <span className="badge badge-success">
          Easy
        </span>
      </div>

      {/* Code */}

      <div className="bg-background p-6 font-mono text-sm overflow-hidden">

        <div className="flex gap-4">

          {/* Line Numbers */}

          <div className="text-zinc-600 select-none leading-8">
            1
            <br />
            2
            <br />
            3
            <br />
            4
            <br />
            5
            <br />
            6
            <br />
            7
            <br />
            8
            <br />
            9
            <br />
            10
            <br />
            11
          </div>

          {/* Code */}

          <pre className="leading-8 overflow-x-auto">

            <span className="text-purple-400">
              function
            </span>{" "}
            <span className="text-blue-400">
              twoSum
            </span>
            <span className="text-zinc-200">
              (nums, target)
            </span>{" "}
            <span className="text-zinc-200">
              {"{"}
            </span>

            {"\n"}

            {"  "}
            <span className="text-purple-400">
              const
            </span>{" "}
            <span className="text-zinc-200">
              map
            </span>{" "}
            <span className="text-zinc-200">
              =
            </span>{" "}
            <span className="text-purple-400">
              new
            </span>{" "}
            <span className="text-emerald-400">
              Map()
            </span>

            {"\n\n"}

            {"  "}
            <span className="text-purple-400">
              for
            </span>
            <span className="text-zinc-200">
              {" ("}
            </span>
            <span className="text-purple-400">
              let
            </span>
            {" "}
            <span className="text-zinc-200">
              i = 0;
            </span>
            {" "}
            <span className="text-zinc-200">
              i &lt; nums.length;
            </span>
            {" "}
            <span className="text-zinc-200">
              i++
            </span>
            <span className="text-zinc-200">
              {") {"}
            </span>

            {"\n"}

            {"    "}
            <span className="text-purple-400">
              const
            </span>{" "}
            <span className="text-zinc-200">
              diff
            </span>{" "}
            =
            {" "}
            target - nums[i];

            {"\n"}

            {"    "}
            <span className="text-purple-400">
              if
            </span>
            {" "}
            (
            <span className="text-zinc-200">
              map.has(diff)
            </span>
            )
            {" {"}

            {"\n"}

            {"      "}
            <span className="text-purple-400">
              return
            </span>{" "}
            [
            <span className="text-zinc-200">
              map.get(diff), i
            </span>
            ];

            {"\n"}

            {"    }"}

            {"\n"}

            {"    "}
            map.set(nums[i], i);

            {"\n"}

            {"  }"}

            {"\n"}

            {"}"}
          </pre>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-zinc-800 bg-card p-5 flex items-center justify-between">

        <div className="flex items-center gap-3 text-emerald-400">

          <CheckCircle2 size={18} />

          <span className="font-medium">
            Accepted
          </span>
        </div>

        <div className="flex gap-6 text-sm text-zinc-400">
          <span>Runtime: 2 ms</span>
          <span>Memory: 42 kb</span>
        </div>
      </div>
    </motion.div>
  );
}

export default FloatingEditor;