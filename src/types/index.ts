export type VisaType = "D-2" | "D-4" | "E" | "F" | "Other";

export type University =
  | "Sookmyung"
  | "Yonsei"
  | "Korea"
  | "Hanyang"
  | "Ewha"
  | "SNU"
  | "Other";

export type ArrivalTime =
  | "not-yet"
  | "less-1-week"
  | "1-4-weeks"
  | "more-1-month";

export type Scholarship = "gks" | "university" | "none";

export interface UserProfile {
  visaType: VisaType;
  university: University | null;
  arrivalTime: ArrivalTime;
  scholarship: Scholarship;
}

export interface ChecklistItem {
  id: string;
  text: string;
  detail: string;
  completed: boolean;
  urgent?: boolean;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}

export interface FreshnessRecord {
  itemId: string;
  lastVerified: string;
  verifiedCount: number;
  reportedOutdated: boolean;
  reportNote?: string;
}

export interface FreshnessStore {
  records: Record<string, FreshnessRecord>;
  lastUpdated: string;
}
