export default function LoadingAdminRfqPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="space-y-3">
          <div className="h-4 w-32 rounded bg-neutral-800" />
          <div className="h-10 w-72 rounded bg-neutral-800" />
          <div className="h-4 w-[32rem] max-w-full rounded bg-neutral-800" />
        </div>

        <div className="h-24 rounded-3xl bg-neutral-900" />
        <div className="h-[420px] rounded-3xl bg-neutral-900" />
      </div>
    </section>
  );
}