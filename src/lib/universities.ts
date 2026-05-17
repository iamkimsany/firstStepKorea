import type { University } from "@/types";

export const UNIVERSITY_LABELS: Record<University, string> = {
  Sookmyung: "Sookmyung Women's University",
  Yonsei: "Yonsei University",
  Korea: "Korea University",
  Hanyang: "Hanyang University",
  Ewha: "Ewha Womans University",
  SNU: "SNU (Seoul National University)",
  Other: "Other university",
};

export const UNIVERSITY_LOGOS: Record<University, string | null> = {
  Sookmyung: "/logos/sookmyung.svg.png",
  Yonsei:    "/logos/yonsei.png",
  Korea:     "/logos/koreanu.png",
  Hanyang:   "/logos/hanyang.png",
  Ewha:      "/logos/ewha.png",
  SNU:       "/logos/snu.png",
  Other:     null,
};

export function getUniversityLogo(u: University | null): string | null {
  if (!u) return null;
  return UNIVERSITY_LOGOS[u];
}

export function getUniversityLabel(u: University | null): string | null {
  if (!u) return null;
  return UNIVERSITY_LABELS[u];
}

export function getInternationalOfficeHint(u: University): string {
  switch (u) {
    case "Sookmyung":
      return "순헌관 building, 1st floor. Mon–Fri 9am–5pm";
    case "Yonsei":
      return "Underwood Hall, 1st floor";
    case "Korea":
      return "International Hall, 1st floor";
    case "Hanyang":
      return "Student Hall, 2nd floor";
    case "Ewha":
      return "Main Building, 1st floor";
    case "SNU":
      return "Office of International Affairs — check campus map";
    default:
      return "Search your university's international office page";
  }
}

export function getRecommendedBank(u: University): string {
  switch (u) {
    case "Sookmyung":
      return "IBK Bank (branch on campus)";
    case "Yonsei":
      return "Shinhan Bank Sinchon branch";
    case "Korea":
      return "Hana Bank on campus";
    case "Hanyang":
      return "Woori or Shinhan near campus";
    case "Ewha":
      return "Shinhan or Woori near Sinchon";
    case "SNU":
      return "Woori Bank Gwanak branch (common for SNU)";
    default:
      return "IBK, Hana, Shinhan, or Woori near your housing";
  }
}
