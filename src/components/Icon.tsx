import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Award,
  ClipboardList,
  Clock,
  Compass,
  Drill,
  Droplets,
  Gauge,
  Lightbulb,
  ShieldCheck,
  Sun,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Compass,
  Drill,
  ArrowDownToLine,
  ArrowUpFromLine,
  Gauge,
  Wrench,
  Droplets,
  ClipboardList,
  Sun,
  ShieldCheck,
  Award,
  Clock,
  Lightbulb,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name] ?? Droplets;
  return <Cmp className={className} />;
}
