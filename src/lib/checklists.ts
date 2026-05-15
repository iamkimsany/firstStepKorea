import type {
  ArrivalTime,
  ChecklistItem,
  University,
  UserProfile,
  VisaType,
} from "@/types";
import {
  getInternationalOfficeHint,
  getRecommendedBank,
} from "@/lib/universities";

type ItemSeed = Omit<ChecklistItem, "completed">;

function item(seed: ItemSeed): ChecklistItem {
  return { ...seed, completed: false };
}

const D2_SOOKMYUNG_LESS_1_WEEK: ItemSeed[] = [
  {
    id: "d2-sm-lt1-io",
    text: "Visit International Office",
    detail: "순헌관 building, 1st floor. Mon-Fri 9am-5pm",
    urgent: true,
  },
  {
    id: "d2-sm-lt1-sim",
    text: "Get temporary SIM card",
    detail: "At airport or Sinchon T-World store",
  },
  {
    id: "d2-sm-lt1-dorm",
    text: "Pay dormitory deposit ₩300,000",
    detail: "Via IBK Bank transfer before move-in",
  },
  {
    id: "d2-sm-lt1-addr",
    text: "Register your address",
    detail: "At local 구청 (district office)",
  },
  {
    id: "d2-sm-lt1-arc",
    text: "Apply for ARC",
    detail:
      "Seoul Immigration Office. Need: passport + photo + address proof + ₩30,000. Within 90 days!",
    urgent: true,
  },
  {
    id: "d2-sm-lt1-bank",
    text: "Open bank account",
    detail: "IBK Bank on campus — bring ARC + passport",
  },
  {
    id: "d2-sm-lt1-phone",
    text: "Upgrade phone plan",
    detail: "Any KT/SKT/LG store with ARC",
  },
  {
    id: "d2-sm-lt1-nhis",
    text: "Register NHIS insurance",
    detail:
      "Mandatory after 6 months. Missing payments affect visa renewal!",
    urgent: true,
  },
];

const D2_YONSEI_LESS_1_WEEK: ItemSeed[] = [
  {
    id: "d2-ys-lt1-io",
    text: "Visit International Office",
    detail: "Underwood Hall, 1st floor",
  },
  {
    id: "d2-ys-lt1-sim",
    text: "Get SIM card",
    detail: "Sinchon area T-World or KT store",
  },
  {
    id: "d2-ys-lt1-arc",
    text: "Apply for ARC within 90 days",
    detail: "Seoul Immigration Office",
    urgent: true,
  },
  {
    id: "d2-ys-lt1-bank",
    text: "Open bank account",
    detail: "Shinhan Bank Sinchon branch — bring ARC",
  },
  {
    id: "d2-ys-lt1-addr",
    text: "Register address",
    detail: "서대문구청",
  },
  {
    id: "d2-ys-lt1-nhis",
    text: "Register NHIS after 6 months",
    detail: "⚠️ Affects visa renewal if missed!",
    urgent: true,
  },
];

function baseStudentFlow(
  visa: VisaType,
  arrival: ArrivalTime,
  university: University | null
): ItemSeed[] {
  const items: ItemSeed[] = [];
  const isStudent = visa === "D-2" || visa === "D-4";
  const office = university
    ? getInternationalOfficeHint(university)
    : "Check your school or program office hours online";
  const bank = university
    ? getRecommendedBank(university)
    : "IBK, Hana, Shinhan, or Woori";

  if (arrival === "not-yet") {
    items.push({
      id: "prep-sim",
      text: "Plan airport SIM pickup",
      detail: "KT/SKT/LG booths — passport only for prepaid",
    });
    items.push({
      id: "prep-docs",
      text: "Print housing & school documents",
      detail: "Lease draft, admission letter, passport copies",
    });
  }

  if (isStudent && university) {
    items.push({
      id: "visit-io",
      text: "Visit International Office",
      detail: office,
      urgent: arrival === "less-1-week",
    });
  }

  if (visa === "D-2" || visa === "D-4") {
    if (arrival !== "not-yet") {
      items.push({
        id: "addr-reg",
        text: "Register your address",
        detail: "At local 구청 or 주민센터 after you move in",
        urgent: arrival === "less-1-week",
      });
    }
    items.push({
      id: "arc",
      text: "Apply for ARC",
      detail:
        "Immigration office — within 90 days of entry for most long-term stays",
      urgent: arrival === "less-1-week" || arrival === "1-4-weeks",
    });
    items.push({
      id: "bank",
      text: "Open bank account",
      detail: `Start limited without ARC; full account with ARC — try ${bank}`,
    });
    items.push({
      id: "phone",
      text: "Phone plan upgrade",
      detail: "Use ARC at carrier store for postpaid / better limits",
    });
    items.push({
      id: "nhis",
      text: "NHIS national health insurance",
      detail: "Mandatory after 6 months — missing bills can block visa renewal",
      urgent: arrival === "more-1-month",
    });
  }

  if (visa === "E") {
    items.push({
      id: "e-contract",
      text: "Confirm work contract & visa status",
      detail: "HR should guide ARC — follow employer checklist",
    });
    items.push({
      id: "e-arc",
      text: "Apply for / update ARC",
      detail: "Immigration — documents from employer + passport",
      urgent: true,
    });
    items.push({
      id: "e-bank",
      text: "Salary bank account",
      detail: `Ask HR for partner bank — often ${bank}`,
    });
  }

  if (visa === "F") {
    items.push({
      id: "f-arc",
      text: "Family ARC registration",
      detail: "Immigration with sponsor documents",
      urgent: arrival === "less-1-week",
    });
    items.push({
      id: "f-addr",
      text: "Register household address",
      detail: "주민센터 with sponsor",
    });
  }

  if (visa === "Other") {
    items.push({
      id: "o-status",
      text: "Verify stay eligibility & reporting rules",
      detail: "Call 1345 (Immigration) or visit office with passport",
      urgent: true,
    });
    items.push({
      id: "o-addr",
      text: "Address registration if required",
      detail: "Ask landlord + local 주민센터",
    });
  }

  if (arrival === "less-1-week" || arrival === "1-4-weeks") {
    items.push({
      id: "housing-lease",
      text: "Protect your housing deposit",
      detail: "Pay by bank transfer; register lease at 주민센터 within 14 days",
      urgent: true,
    });
  }

  // Dedupe by id while preserving order
  const seen = new Set<string>();
  return items.filter((i) => {
    if (seen.has(i.id)) return false;
    seen.add(i.id);
    return true;
  });
}

export function generateChecklist(profile: UserProfile): ChecklistItem[] {
  const { visaType, university, arrivalTime } = profile;

  if (
    visaType === "D-2" &&
    university === "Sookmyung" &&
    arrivalTime === "less-1-week"
  ) {
    return D2_SOOKMYUNG_LESS_1_WEEK.map(item);
  }

  if (
    visaType === "D-2" &&
    university === "Yonsei" &&
    arrivalTime === "less-1-week"
  ) {
    return D2_YONSEI_LESS_1_WEEK.map(item);
  }

  const seeds = baseStudentFlow(visaType, arrivalTime, university);
  if (seeds.length === 0) {
    return [
      item({
        id: "fallback-1",
        text: "Save emergency contacts",
        detail: "School office, embassy, 119/112",
      }),
      item({
        id: "fallback-2",
        text: "Download KakaoMap & Papago",
        detail: "Navigation and translation day-to-day",
      }),
    ];
  }
  return seeds.map(item);
}

/** All checklist item IDs used in seeds — for freshness tracking / admin */
export const ALL_TRACKED_CHECKLIST_ITEM_IDS: readonly string[] = [
  ...new Set([
    ...D2_SOOKMYUNG_LESS_1_WEEK.map((s) => s.id),
    ...D2_YONSEI_LESS_1_WEEK.map((s) => s.id),
    "prep-sim",
    "prep-docs",
    "visit-io",
    "addr-reg",
    "arc",
    "bank",
    "phone",
    "nhis",
    "e-contract",
    "e-arc",
    "e-bank",
    "f-arc",
    "f-addr",
    "o-status",
    "o-addr",
    "housing-lease",
    "fallback-1",
    "fallback-2",
  ]),
];
