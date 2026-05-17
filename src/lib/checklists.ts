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
import type { Language } from "@/lib/translations";

type ItemSeed = Omit<ChecklistItem, "completed">;

function item(seed: ItemSeed): ChecklistItem {
  return { ...seed, completed: false };
}

const D2_SOOKMYUNG_LESS_1_WEEK_EN: ItemSeed[] = [
  {
    id: "d2-sm-lt1-io",
    text: "Visit International Office",
    detail: "행정관 203호 · Mon-Fri 9:00-17:00 · Tel: 02-710-9256",
    urgent: true,
  },
  {
    id: "d2-sm-lt1-sim",
    text: "Get temporary SIM card",
    detail: "At Incheon Airport or Sinchon T-World store. Passport only.",
  },
  {
    id: "d2-sm-lt1-dorm",
    text: "Move into dorm / find housing",
    detail: "Always pay deposit via bank transfer — keep all receipts! Register lease at 주민센터 within 14 days.",
  },
  {
    id: "d2-sm-lt1-addr",
    text: "Register your address",
    detail: "At local 구청 (district office). Need: passport + lease.",
  },
  {
    id: "d2-sm-lt1-arc",
    text: "Apply for ARC",
    detail:
      "⚠️ Must apply within 90 days of arrival! Book: hikorea.go.kr. Need: passport + photo + address proof + ₩30,000",
    urgent: true,
  },
  {
    id: "d2-sm-lt1-bank",
    text: "Open bank account",
    detail: "IBK Bank on campus — bring ARC + passport. Without ARC: limit ₩300,000.",
  },
  {
    id: "d2-sm-lt1-phone",
    text: "Upgrade phone plan",
    detail: "Any KT/SKT/LG U+ store with ARC.",
  },
  {
    id: "d2-sm-lt1-nhis",
    text: "Register NHIS insurance",
    detail:
      "⚠️ Mandatory after 6 months in Korea! Missing payments can block visa renewal. Pay: nhis.or.kr or any ATM.",
    urgent: true,
  },
];

const D2_SOOKMYUNG_LESS_1_WEEK_RU: ItemSeed[] = [
  {
    id: "d2-sm-lt1-io",
    text: "Посетить отдел по работе с иностранными студентами",
    detail: "행정관 203호 · Пн-Пт 9:00-17:00 · Тел: 02-710-9256",
    urgent: true,
  },
  {
    id: "d2-sm-lt1-sim",
    text: "Купить временную SIM-карту",
    detail: "В аэропорту Инчхон или в магазине Sinchon T-World. Нужен только паспорт.",
  },
  {
    id: "d2-sm-lt1-dorm",
    text: "Заселиться в общежитие / найти жильё",
    detail: "Всегда платите депозит через банковский перевод — храните все чеки! Зарегистрируйте договор в 주민센터 в течение 14 дней.",
  },
  {
    id: "d2-sm-lt1-addr",
    text: "Зарегистрировать адрес",
    detail: "В местном 구청 (районном офисе). Нужны: паспорт + договор аренды.",
  },
  {
    id: "d2-sm-lt1-arc",
    text: "Подать заявку на карту ARC",
    detail:
      "⚠️ Необходимо подать в течение 90 дней после приезда! Запись: hikorea.go.kr. Нужны: паспорт + фото + подтверждение адреса + ₩30,000",
    urgent: true,
  },
  {
    id: "d2-sm-lt1-bank",
    text: "Открыть банковский счёт",
    detail: "Банк IBK на территории кампуса. Нужны ARC + паспорт. Без ARC: лимит ₩300,000.",
  },
  {
    id: "d2-sm-lt1-phone",
    text: "Перейти на полный тарифный план телефона",
    detail: "Любой магазин KT/SKT/LG U+ с картой ARC.",
  },
  {
    id: "d2-sm-lt1-nhis",
    text: "Зарегистрировать медицинскую страховку NHIS",
    detail:
      "⚠️ Обязательно после 6 месяцев в Корее! Пропуск платежей может заблокировать продление визы. Оплата: nhis.or.kr или любой банкомат.",
    urgent: true,
  },
];

const D2_YONSEI_LESS_1_WEEK_EN: ItemSeed[] = [
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

const D2_YONSEI_LESS_1_WEEK_RU: ItemSeed[] = [
  {
    id: "d2-ys-lt1-io",
    text: "Посетить отдел для иностранных студентов",
    detail: "Underwood Hall, 1 этаж",
  },
  {
    id: "d2-ys-lt1-sim",
    text: "Купить SIM-карту",
    detail: "Магазин T-World или KT в районе Синчон",
  },
  {
    id: "d2-ys-lt1-arc",
    text: "Подать заявку на ARC в течение 90 дней",
    detail: "Иммиграционный офис Сеула",
    urgent: true,
  },
  {
    id: "d2-ys-lt1-bank",
    text: "Открыть банковский счёт",
    detail: "Shinhan Bank в Синчоне — возьмите ARC",
  },
  {
    id: "d2-ys-lt1-addr",
    text: "Зарегистрировать адрес",
    detail: "서대문구청",
  },
  {
    id: "d2-ys-lt1-nhis",
    text: "Зарегистрировать страховку NHIS после 6 месяцев",
    detail: "⚠️ Влияет на продление визы, если пропустить!",
    urgent: true,
  },
];

function baseStudentFlow(
  visa: VisaType,
  arrival: ArrivalTime,
  university: University | null,
  lang: Language
): ItemSeed[] {
  const items: ItemSeed[] = [];
  const isStudent = visa === "D-2" || visa === "D-4";
  const office = university
    ? getInternationalOfficeHint(university)
    : lang === "ru"
      ? "Проверьте часы работы офиса вашей школы онлайн"
      : "Check your school or program office hours online";
  const bank = university
    ? getRecommendedBank(university)
    : "IBK, Hana, Shinhan, or Woori";

  if (lang === "ru") {
    if (arrival === "not-yet") {
      items.push({
        id: "prep-sim",
        text: "Запланировать покупку SIM-карты в аэропорту",
        detail: "Стойки KT/SKT/LG — только паспорт для предоплаченной карты",
      });
      items.push({
        id: "prep-docs",
        text: "Распечатать документы по жилью и учёбе",
        detail: "Проект договора аренды, письмо о зачислении, копии паспорта",
      });
    }

    if (isStudent && university) {
      items.push({
        id: "visit-io",
        text: "Посетить отдел для иностранных студентов",
        detail: office,
        urgent: arrival === "less-1-week",
      });
    }

    if (visa === "D-2" || visa === "D-4") {
      if (arrival !== "not-yet") {
        items.push({
          id: "addr-reg",
          text: "Зарегистрировать адрес",
          detail: "В местном 구청 или 주민센터 после заселения",
          urgent: arrival === "less-1-week",
        });
      }
      items.push({
        id: "arc",
        text: "Подать заявку на ARC",
        detail: "Иммиграционный офис — в течение 90 дней с даты въезда",
        urgent: arrival === "less-1-week" || arrival === "1-4-weeks",
      });
      items.push({
        id: "bank",
        text: "Открыть банковский счёт",
        detail: `Начните без ARC с ограниченным счётом; полный счёт с ARC — попробуйте ${bank}`,
      });
      items.push({
        id: "phone",
        text: "Перейти на полный тарифный план телефона",
        detail: "Используйте ARC в магазине оператора для постоплаты",
      });
      items.push({
        id: "nhis",
        text: "Медицинская страховка NHIS",
        detail: "Обязательно после 6 месяцев — пропуск платежей может заблокировать продление визы",
        urgent: arrival === "more-1-month",
      });
    }

    if (visa === "E") {
      items.push({
        id: "e-contract",
        text: "Подтвердить трудовой договор и статус визы",
        detail: "HR должен помочь с ARC — следуйте чек-листу работодателя",
      });
      items.push({
        id: "e-arc",
        text: "Подать заявку на ARC / обновить ARC",
        detail: "Иммиграция — документы от работодателя + паспорт",
        urgent: true,
      });
      items.push({
        id: "e-bank",
        text: "Банковский счёт для зарплаты",
        detail: `Уточните у HR партнёрский банк — часто ${bank}`,
      });
    }

    if (visa === "F") {
      items.push({
        id: "f-arc",
        text: "Регистрация семейного ARC",
        detail: "Иммиграция с документами спонсора",
        urgent: arrival === "less-1-week",
      });
      items.push({
        id: "f-addr",
        text: "Зарегистрировать домашний адрес",
        detail: "주민센터 со спонсором",
      });
    }

    if (visa === "Other") {
      items.push({
        id: "o-status",
        text: "Проверить право на пребывание и правила отчётности",
        detail: "Позвоните 1345 (иммиграция) или посетите офис с паспортом",
        urgent: true,
      });
      items.push({
        id: "o-addr",
        text: "Регистрация адреса при необходимости",
        detail: "Уточните у арендодателя + местный 주민센터",
      });
    }

    if (arrival === "less-1-week" || arrival === "1-4-weeks") {
      items.push({
        id: "housing-lease",
        text: "Защитить жилищный депозит",
        detail: "Платите банковским переводом; зарегистрируйте договор в 주민센터 в течение 14 дней",
        urgent: true,
      });
    }
  } else {
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
  }

  // Dedupe by id while preserving order
  const seen = new Set<string>();
  return items.filter((i) => {
    if (seen.has(i.id)) return false;
    seen.add(i.id);
    return true;
  });
}

export function generateChecklist(profile: UserProfile, lang: Language = "en"): ChecklistItem[] {
  const { visaType, university, arrivalTime } = profile;

  if (
    visaType === "D-2" &&
    university === "Sookmyung" &&
    arrivalTime === "less-1-week"
  ) {
    const seeds = lang === "ru" ? D2_SOOKMYUNG_LESS_1_WEEK_RU : D2_SOOKMYUNG_LESS_1_WEEK_EN;
    return seeds.map(item);
  }

  if (
    visaType === "D-2" &&
    university === "Yonsei" &&
    arrivalTime === "less-1-week"
  ) {
    const seeds = lang === "ru" ? D2_YONSEI_LESS_1_WEEK_RU : D2_YONSEI_LESS_1_WEEK_EN;
    return seeds.map(item);
  }

  const seeds = baseStudentFlow(visaType, arrivalTime, university, lang);
  if (seeds.length === 0) {
    if (lang === "ru") {
      return [
        item({
          id: "fallback-1",
          text: "Сохранить экстренные контакты",
          detail: "Офис школы, посольство, 119/112",
        }),
        item({
          id: "fallback-2",
          text: "Скачать KakaoMap и Papago",
          detail: "Навигация и перевод в повседневной жизни",
        }),
      ];
    }
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
export const ALL_TRACKED_CHECKLIST_ITEM_IDS: readonly string[] = Array.from(
  new Set([
    ...D2_SOOKMYUNG_LESS_1_WEEK_EN.map((s) => s.id),
    ...D2_YONSEI_LESS_1_WEEK_EN.map((s) => s.id),
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
  ])
);
