import type { University, UserProfile } from "@/types";

export type CampusCategory =
  | "documents"
  | "finance"
  | "academic"
  | "language"
  | "community";

export interface CampusResourceRow {
  label: string;
  value: string;
}

export interface CampusResource {
  id: string;
  icon: string;
  name: string;
  nameKorean: string;
  category: CampusCategory;
  description: string;
  rows: CampusResourceRow[];
  price?: string;
  tip?: string;
  warning?: string;
  url?: string;
}

export const SOOKMYUNG_RESOURCES: CampusResource[] = [
  {
    id: "certificate",
    icon: "🖨️",
    name: "Certificate Issuance",
    nameKorean: "증명서 발급",
    category: "documents",
    description:
      "Get enrollment, transcript, graduation certificates. 3 ways: kiosk (fastest!), online (24/7), or in-person.",
    rows: [
      {
        label: "🏧 Kiosk",
        value: "학생회관 3층 로비 · Weekdays 9am-10pm · Instant!",
      },
      {
        label: "💻 Online",
        value: "sookmyung.ac.kr → 재학생 → 증명서발급 (24/7)",
      },
      {
        label: "🏢 Office",
        value: "학생회관 3층 학생지원센터 · Tel: 02-710-9815",
      },
    ],
    price: "Free online / ₩1,000 kiosk",
    tip: "Kiosk is instant and available until 10pm — no need to visit any office!",
    url: "https://www.sookmyung.ac.kr/kr/university-life/certificate.do",
  },
  {
    id: "tuition",
    icon: "💳",
    name: "Tuition Payment",
    nameKorean: "등록금 납부",
    category: "finance",
    description:
      "Pay tuition via Shinhan Bank virtual account. Installment payment available — pay in 4 installments of 25% each.",
    rows: [
      {
        label: "How to pay",
        value:
          "숙명포털 → 학사 → 등록 → 고지서출력 → Transfer to 등록가상계좌",
      },
      {
        label: "Installment",
        value: "4 payments of 25% · Apply mid-Feb (spring) / mid-Aug (fall)",
      },
      {
        label: "Cannot use",
        value: "First semester new students cannot use installment plan",
      },
      {
        label: "SMS alerts",
        value: "숙명포털 → 학사 → 등록 → SMS문자수신 신청",
      },
      {
        label: "Contact",
        value: "학생지원센터 장학팀 · 02-710-9907 (학생회관 306호)",
      },
    ],
    warning:
      "Transfer EXACT amount shown on bill — wrong amount means payment fails!",
    tip: "Use Shinhan Bank directly to avoid transfer fees!",
  },
  {
    id: "korean-clinic",
    icon: "✍️",
    name: "Korean Language Clinic",
    nameKorean: "한국어 클리닉",
    category: "academic",
    description:
      "FREE Korean writing correction by professional experts. Submit your report, thesis, or presentation — experts fix grammar, spelling, and spacing. You must write the content yourself.",
    rows: [
      {
        label: "How to apply",
        value:
          "wise.sookmyung.ac.kr → 비교과프로그램 → search '한국어클리닉' → 활동게시판 → upload file as 비밀글",
      },
      {
        label: "Processing time",
        value: "Up to 10 days — apply early!",
      },
      {
        label: "Capacity",
        value: "Max 15-20 spots per semester (first come, first served)",
      },
      {
        label: "Contact",
        value: "studyabroad@sm.ac.kr · Tel: 02-710-9801",
      },
    ],
    price: "FREE",
    warning:
      "Limited spots — apply at least 10 days before your deadline! Must upload as 비밀글 (private post). Include your student ID + name + email in the post body.",
    tip: "This service corrects Korean grammar only — you must write the content yourself!",
  },
  {
    id: "skev",
    icon: "🗣️",
    name: "SKEV — Korean Exchange Village",
    nameKorean: "숙명 Korean Exchange Village",
    category: "language",
    description:
      "Official language exchange club at Sookmyung. Practice Korean with Korean students, make friends, and join cultural events every semester.",
    rows: [
      { label: "Instagram", value: "@smwu._.skev" },
      {
        label: "When",
        value: "Registration announced each semester on Instagram",
      },
    ],
    price: "FREE",
    tip: "Follow @smwu._.skev on Instagram — spots fill up fast at the start of each semester!",
    url: "https://www.instagram.com/smwu._.skev/",
  },
  {
    id: "intl-services",
    icon: "🌍",
    name: "International Student Services",
    nameKorean: "유학생서비스팀",
    category: "community",
    description:
      "Main support office for all international student needs. Visa support letters, enrollment certificates for visa applications, and general support.",
    rows: [
      { label: "Location", value: "행정관 203호" },
      { label: "Hours", value: "Mon-Fri 9:00am ~ 5:00pm" },
      { label: "Phone", value: "02-710-9256 (Global Lounge)" },
      { label: "Email", value: "studyabroad@sm.ac.kr" },
    ],
    tip: "Visit in person during your first week — introduce yourself and they will help with everything!",
  },
];

export const TRACKED_CAMPUS_RESOURCE_IDS: readonly string[] =
  SOOKMYUNG_RESOURCES.map((r) => r.id);

export function getCampusResourcesForUniversity(
  university: University | null
): CampusResource[] {
  if (university === "Sookmyung") {
    return SOOKMYUNG_RESOURCES;
  }
  return [];
}

export function getCampusResourcesForProfile(
  profile: UserProfile | null
): CampusResource[] {
  return getCampusResourcesForUniversity(profile?.university ?? null);
}
