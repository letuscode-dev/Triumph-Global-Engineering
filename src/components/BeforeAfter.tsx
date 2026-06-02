"use client";

import { SafeImage as Image } from "@/components/SafeImage";
import { useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

export function BeforeAfter({
  before,
  after,
  label,
}: {
  before: string;
  after: string;
  label?: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  };

  return (
    <div className="card overflow-hidden">
      <div
        ref={ref}
        className="relative aspect-[4/3] cursor-ew-resize select-none"
        onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
        onClick={(e) => move(e.clientX)}
      >
        <Image
          src={after}
          alt="After"
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover"
        />
        <span className="absolute right-3 top-3 rounded-full bg-leaf-600 px-3 py-1 text-xs font-semibold text-white">
          After
        </span>
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <Image
            src={before}
            alt="Before"
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-white">
            Before
          </span>
        </div>
        <div
          className="absolute inset-y-0 w-0.5 bg-white shadow"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-600 shadow-lg">
            <MoveHorizontal className="h-5 w-5" />
          </span>
        </div>
        {/* Keyboard-accessible control overlaying the comparison. */}
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Before and after comparison slider"
          className="absolute inset-x-0 bottom-3 mx-auto w-[90%] cursor-ew-resize opacity-0 focus:opacity-100"
        />
      </div>
      {label && (
        <div className="p-4 text-center text-sm font-medium text-slate-700">{label}</div>
      )}
    </div>
  );
}
