"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import { useEffect } from "react";

export default function ColorProvider({ children }) {
  const { colors } = useDashboardData();

  useEffect(() => {
    // Apply dynamic colors to CSS custom properties with fallbacks
    const root = document.documentElement;

    if (colors?.colorOne) {
      root.style.setProperty('--color-primary', colors.colorOne);
    }
    if (colors?.colorTwo) {
      root.style.setProperty('--color-accent', colors.colorTwo);
    }
    if (colors?.bgColorOne) {
      root.style.setProperty('--color-secondary', colors.bgColorOne);
    }
    if (colors?.bgColorTwo) {
      root.style.setProperty('--color-black', colors.bgColorTwo);
    }
  }, [colors]);

  return <>{children}</>;
}
