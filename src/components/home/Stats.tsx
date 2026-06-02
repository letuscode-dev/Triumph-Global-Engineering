"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "@/lib/content";

function useCountUp(target: number, run: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, run, duration]);
  return value;
}

function StatItem({
  value,
  label,
  suffix,
  run,
}: {
  value: number;
  label: string;
  suffix?: string;
  run: boolean;
}) {
  const n = useCountUp(value, run);
  return (
    <div className="text-center">
      <div className="font-display text-4xl font-extrabold text-white sm:text-5xl">
        {n.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-2 text-sm font-medium uppercase tracking-wider text-brand-100">
        {label}
      </div>
    </div>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-gradient-to-br from-brand-700 to-leaf-700">
      <div ref={ref} className="container-page py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((s) => (
            <StatItem
              key={s.label}
              value={s.value}
              label={s.label}
              suffix={s.suffix}
              run={run}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
