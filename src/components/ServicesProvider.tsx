"use client";

import { createContext, useContext } from "react";
import type { Service } from "@/lib/types";

const ServicesContext = createContext<Service[]>([]);

export function ServicesProvider({
  services,
  children,
}: {
  services: Service[];
  children: React.ReactNode;
}) {
  return (
    <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>
  );
}

export function useServices(): Service[] {
  return useContext(ServicesContext);
}
