import { motion } from "framer-motion";

function FloatingEditor() {
  return (
    <motion.div
      animate={{
        y: [-10, 10, -10]
      }}
      transition={{
        duration: 6,
        repeat: Infinity
      }}
      className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl"
    >
      <div className="border-b border-border p-4 flex justify-between">
        <span>Two Sum</span>

        <span className="badge badge-success">
          Easy
        </span>
      </div>

      <pre className="p-6 text-sm text-zinc-300">
{`function twoSum(nums, target) {
  const map = new Map();

  for(let i=0;i<nums.length;i++){
    const diff = target - nums[i];

    if(map.has(diff)){
      return [map.get(diff), i];
    }

    map.set(nums[i], i);
  }
}`}
      </pre>

      <div className="border-t border-border p-4 text-success">
        ✓ Accepted
      </div>
    </motion.div>
  );
}

export default FloatingEditor;