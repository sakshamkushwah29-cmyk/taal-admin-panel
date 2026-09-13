import React from "react";
import { motion } from "framer-motion";

export default function GarbaDance() {
  return (
    <div className="min-h-screen w-full grid place-items-center bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 p-6">
      <div className="w-full max-w-4xl aspect-[16/9] rounded-2xl shadow-xl bg-amber-200/40 ring-1 ring-amber-500/30 overflow-hidden">
        <Scene />
      </div>
    </div>
  );
}

const Scene = () => (
  <div className="relative h-full w-full">
    <Bokeh />
    <motion.svg
      viewBox="0 0 1200 675"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
    >
      <ellipse cx="600" cy="560" rx="420" ry="40" fill="#d97706" opacity={0.25} />
      <MaleDancer />
      <FemaleDancer />
    </motion.svg>
    <Legend />
  </div>
);

const swingTransition = {
  duration: 1.1,
  ease: [0.45, 0.05, 0.55, 0.95],
  repeat: Infinity,
  repeatType: "mirror",
};

const spinTransition = {
  duration: 3.6,
  ease: "linear",
  repeat: Infinity,
};

function MaleDancer() {
  return (
    <motion.g
      transform="translate(360 340)"
      animate={{ y: [0, -18, 0], rotate: [0, -4, 0, 4, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.g
        animate={{ rotate: 360 }}
        transition={spinTransition}
        transformOrigin="-120 0"
      >
        <g>
          <path d="M-30,-40 C-60,-40 -70,-10 -70,20 C-70,60 -30,80 -10,80 C10,80 50,60 50,20 C50,-10 40,-40 10,-40 Z" fill="#f59e0b" stroke="#b45309" strokeWidth={4} />
          <path d="M-20,80 C-40,120 -30,150 -10,150 C10,150 20,120 30,80 Z" fill="#dc2626" stroke="#991b1b" strokeWidth={4} />
          <path d="M-8,-60 C-40,-60 -38,-82 -6,-88 C28,-94 40,-76 18,-62 Z" fill="#dc2626" stroke="#991b1b" strokeWidth={4} />
          <circle cx="-5" cy="-48" r="14" fill="#fed7aa" stroke="#9a3412" strokeWidth={3} />
          <path d="M-70,20 C-40,10 20,10 50,20 C20,34 -40,34 -70,20 Z" fill="#22c55e" stroke="#15803d" strokeWidth={3} />
        </g>

        <motion.g
          transform="translate(30,-10)"
          animate={{ rotate: [20, -35, 20] }}
          transition={swingTransition}
          transformOrigin="0 0"
        >
          <Arm fill="#f59e0b" />
          <Stick x1={35} y1={-25} x2={90} y2={-50} />
        </motion.g>

        <motion.g
          transform="translate(-50,-6)"
          animate={{ rotate: [-25, 30, -25] }}
          transition={swingTransition}
          transformOrigin="50 0"
        >
          <Arm fill="#f59e0b" flip />
          <Stick x1={-20} y1={-22} x2={-78} y2={-38} />
        </motion.g>

        <motion.g
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        >
          <Foot x={-28} />
          <Foot x={20} />
        </motion.g>
      </motion.g>
    </motion.g>
  );
}

function FemaleDancer() {
  return (
    <motion.g
      transform="translate(820 340)"
      animate={{ y: [0, -10, 0], rotate: [0, 3, 0, -3, 0] }}
      transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.g animate={{ rotate: -360 }} transition={spinTransition} transformOrigin="120 0">
        <path d="M-70,40 C-120,140 120,140 70,40 C40,10 -40,10 -70,40 Z" fill="#ea580c" stroke="#9a3412" strokeWidth={5} />
        <path d="M-35,-10 C-60,-10 -65,15 -50,30 C-28,50 28,50 50,30 C65,15 60,-10 35,-10 Z" fill="#ef4444" stroke="#991b1b" strokeWidth={4} />
        <motion.path
          d="M-30,-14 C-90,-24 -120,-10 -110,10 C-94,38 -50,26 -10,18 C30,10 60,20 88,34 C114,46 126,32 118,18 C98,-18 36,-24 -30,-14 Z"
          fill="#f43f5e"
          stroke="#9f1239"
          strokeWidth={4}
          animate={{
            d: [
              "M-30,-14 C-90,-24 -120,-10 -110,10 C-94,38 -50,26 -10,18 C30,10 60,20 88,34 C114,46 126,32 118,18 C98,-18 36,-24 -30,-14 Z",
              "M-30,-16 C-100,-30 -128,-12 -114,8 C-96,34 -54,26 -8,20 C36,12 66,24 92,38 C118,50 132,38 120,22 C100,-14 40,-20 -30,-16 Z",
            ],
          }}
          transition={swingTransition}
        />
        <circle cx="0" cy="-28" r="14" fill="#fed7aa" stroke="#9a3412" strokeWidth={3} />

        <motion.g
          transform="translate(-44,-2)"
          animate={{ rotate: [10, -30, 10] }}
          transition={swingTransition}
          transformOrigin="50 0"
        >
          <Arm fill="#ef4444" flip />
          <Stick x1={-10} y1={-20} x2={-66} y2={-48} />
        </motion.g>

        <motion.g
          transform="translate(46,-2)"
          animate={{ rotate: [-12, 28, -12] }}
          transition={swingTransition}
          transformOrigin="0 0"
        >
          <Arm fill="#ef4444" />
          <Stick x1={10} y1={-22} x2={70} y2={-44} />
        </motion.g>

        <motion.g animate={{ y: [0, -10, 0] }} transition={{ duration: 0.95, repeat: Infinity, ease: "easeInOut" }}>
          <Foot x={-26} />
          <Foot x={22} />
        </motion.g>
      </motion.g>
    </motion.g>
  );
}

function Arm({ fill, flip }) {
  return (
    <g transform={flip ? "scale(-1,1)" : undefined}>
      <path d="M0,0 C20,4 36,8 54,0 C62,-4 60,10 52,18 C30,38 10,26 0,14 Z" fill={fill} stroke="#7c2d12" strokeWidth={3} />
      <circle cx={56} cy={2} r={6} fill="#fed7aa" stroke="#9a3412" strokeWidth={3} />
    </g>
  );
}

function Stick({ x1, y1, x2, y2 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8b5e34" strokeWidth={10} strokeLinecap="round" />;
}

function Foot({ x }) {
  return <ellipse cx={x} cy={158} rx={20} ry={10} fill="#9a3412" opacity={0.5} />;
}

const Legend = () => (
  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-amber-900/80 text-sm">
    <div className="px-3 py-1 rounded-full bg-amber-100/70 shadow">Garba — looping animation</div>
    <div className="px-3 py-1 rounded-full bg-amber-100/70 shadow">Yellow kurta · Orange lehenga · Red saree · Dandiya</div>
  </div>
);

function Bokeh() {
  const dots = Array.from({ length: 24 });
  return (
    <div className="absolute inset-0">
      {dots.map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-amber-300/50 blur-[2px]"
          style={{ width: 8 + (i % 5) * 2, height: 8 + (i % 5) * 2 }}
          animate={{
            y: [0, -8 - (i % 5) * 2, 0],
            x: [0, (i % 2 ? -1 : 1) * (6 + (i % 4) * 3), 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 3 + (i % 5) * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
        />
      ))}
    </div>
  );
}
