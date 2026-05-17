import type { FreshnessRecord, FreshnessStore } from "@/types";
import { ALL_TRACKED_CHECKLIST_ITEM_IDS } from "@/lib/checklists";
import { TRACKED_CAMPUS_RESOURCE_IDS } from "@/lib/campus-resources";

export const FRESHNESS_STORE_KEY = "freshness_store";
export const FRESHNESS_INITIALIZED_KEY = "freshness_initialized";

function nowIso(): string {
  return new Date().toISOString();
}

export function getFreshnessStore(): FreshnessStore {
  if (typeof window === "undefined") {
    return { records: {}, lastUpdated: nowIso() };
  }
  try {
    const raw = localStorage.getItem(FRESHNESS_STORE_KEY);
    if (!raw) {
      return { records: {}, lastUpdated: nowIso() };
    }
    const parsed = JSON.parse(raw) as FreshnessStore;
    if (!parsed.records || typeof parsed.records !== "object") {
      return { records: {}, lastUpdated: nowIso() };
    }
    return {
      records: parsed.records,
      lastUpdated: parsed.lastUpdated ?? nowIso(),
    };
  } catch {
    return { records: {}, lastUpdated: nowIso() };
  }
}

function writeStore(store: FreshnessStore): void {
  localStorage.setItem(FRESHNESS_STORE_KEY, JSON.stringify(store));
}

/** Seed all known checklist + campus IDs once so nothing shows stale on first launch */
export function ensureFreshnessInitialized(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(FRESHNESS_INITIALIZED_KEY)) return;

  const today = nowIso();
  const ids = [
    ...ALL_TRACKED_CHECKLIST_ITEM_IDS,
    ...TRACKED_CAMPUS_RESOURCE_IDS,
  ];
  const records: Record<string, FreshnessRecord> = {};
  for (const id of ids) {
    records[id] = {
      itemId: id,
      lastVerified: today,
      verifiedCount: 0,
      reportedOutdated: false,
    };
  }
  writeStore({ records, lastUpdated: today });
  localStorage.setItem(FRESHNESS_INITIALIZED_KEY, "1");
}

export function getFreshness(itemId: string): FreshnessRecord | null {
  if (typeof window === "undefined") return null;
  ensureFreshnessInitialized();
  const store = getFreshnessStore();
  return store.records[itemId] ?? null;
}

export function saveFreshness(record: FreshnessRecord): void {
  if (typeof window === "undefined") return;
  ensureFreshnessInitialized();
  const store = getFreshnessStore();
  store.records[record.itemId] = record;
  store.lastUpdated = nowIso();
  writeStore(store);
}

export function markVerified(itemId: string): void {
  if (typeof window === "undefined") return;
  ensureFreshnessInitialized();
  const existing = getFreshness(itemId);
  const today = nowIso();
  const next: FreshnessRecord = existing
    ? {
        ...existing,
        lastVerified: today,
        verifiedCount: existing.verifiedCount + 1,
        reportedOutdated: false,
        reportNote: undefined,
      }
    : {
        itemId,
        lastVerified: today,
        verifiedCount: 1,
        reportedOutdated: false,
      };
  saveFreshness(next);
}

export function reportOutdated(itemId: string, note: string): void {
  if (typeof window === "undefined") return;
  ensureFreshnessInitialized();
  const existing = getFreshness(itemId);
  const base: FreshnessRecord =
    existing ?? {
      itemId,
      lastVerified: nowIso(),
      verifiedCount: 0,
      reportedOutdated: false,
    };
  saveFreshness({
    ...base,
    reportedOutdated: true,
    reportNote: note.trim() || undefined,
  });
}

/** Calendar days since lastVerified (UTC date boundaries). */
export function getDaysOld(isoDate: string): number {
  const then = new Date(isoDate);
  const now = new Date();
  if (Number.isNaN(then.getTime())) return 9999;
  const startThen = Date.UTC(
    then.getUTCFullYear(),
    then.getUTCMonth(),
    then.getUTCDate()
  );
  const startNow = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  return Math.max(0, Math.floor((startNow - startThen) / 86_400_000));
}

export function getFreshnessLabel(itemId: string): {
  label: string;
  color: string;
  /** Lucide icon name to render in the UI — consumers import the icon component by this key. */
  iconName: "CheckCircle" | "Clock" | "AlertTriangle" | "AlertCircle";
} {
  const record = getFreshness(itemId);
  const days =
    record === null ? 9999 : getDaysOld(record.lastVerified);

  if (days <= 14) {
    return { label: "Verified recently",       color: "#1D9E75", iconName: "CheckCircle"   };
  }
  if (days <= 30) {
    return { label: "Verified this month",     color: "#D97706", iconName: "Clock"         };
  }
  if (days <= 60) {
    return { label: "Verify if still accurate",color: "#D97706", iconName: "AlertTriangle" };
  }
  return   { label: "Needs verification",      color: "#D85A30", iconName: "AlertCircle"   };
}

export function resetAllFreshnessToToday(): void {
  if (typeof window === "undefined") return;
  const store = getFreshnessStore();
  const today = nowIso();
  const nextRecords: Record<string, FreshnessRecord> = {};
  for (const id of Object.keys(store.records)) {
    nextRecords[id] = {
      itemId: id,
      lastVerified: today,
      verifiedCount: 0,
      reportedOutdated: false,
    };
  }
  writeStore({ records: nextRecords, lastUpdated: today });
}

export function getAdminFreshnessRows(): {
  itemId: string;
  record: FreshnessRecord;
  daysOld: number;
}[] {
  if (typeof window === "undefined") return [];
  ensureFreshnessInitialized();
  const store = getFreshnessStore();
  const rows = Object.values(store.records).map((record) => ({
    itemId: record.itemId,
    record,
    daysOld: getDaysOld(record.lastVerified),
  }));
  rows.sort((a, b) => b.daysOld - a.daysOld);
  return rows;
}
