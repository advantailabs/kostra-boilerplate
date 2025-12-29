export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-light">
      <div className="w-full max-w-md rounded-lg bg-background p-8 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold">Welcome to Kostra!</h1>
        <p className="mb-6 text-center text-text-muted">
          Let&apos;s get you set up. Please complete your onboarding to continue.
        </p>
        {/* Add your onboarding form or steps here */}
        <button className="w-full rounded bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary-hover">
          Complete Onboarding
        </button>
      </div>
    </div>
  );
}
