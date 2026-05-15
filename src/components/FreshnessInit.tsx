"use client";

import { useEffect } from "react";
import { ensureFreshnessInitialized } from "@/lib/freshness";

/** Runs once per session mount under tabs — seeds freshness store on first visit */
export function FreshnessInit() {
  useEffect(() => {
    ensureFreshnessInitialized();
  }, []);
  return null;
}
