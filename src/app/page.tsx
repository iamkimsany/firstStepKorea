import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="page-enter flex min-h-dvh flex-col bg-gradient-to-b from-primary-light to-white px-6 pb-8 pt-14 safe-bottom">
      <div className="flex flex-1 flex-col items-center text-center">
        <div className="text-6xl" aria-hidden>
          🇰🇷
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink">
          FirstStep Korea
        </h1>
        <p className="mt-2 text-sm font-medium text-muted">
          헤이영 for international students
        </p>
        <p className="mt-6 text-lg font-semibold text-primary-dark">
          Your personal guide to surviving your first weeks in Korea
        </p>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
          Banking, ARC, housing, insurance — all in your language, in the right
          order
        </p>
      </div>
      <div className="mt-10 w-full">
        <Link
          href="/onboarding"
          className="flex w-full items-center justify-center gap-2 rounded-btn bg-primary px-5 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-dark active:scale-[0.99]"
        >
          Get My Personal Plan
          <span aria-hidden>→</span>
        </Link>
      </div>
    </main>
  );
}
