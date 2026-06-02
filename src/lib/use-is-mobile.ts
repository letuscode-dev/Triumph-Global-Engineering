"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(max-width: 767px), (pointer: coarse)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
  return (
    window.matchMedia("(max-width: 767px), (pointer: coarse)").matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  );
}

function getServerSnapshot() {
  return false;
}

/** True on phones/tablets where tel: and wa.me app handoff work well. */
export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
