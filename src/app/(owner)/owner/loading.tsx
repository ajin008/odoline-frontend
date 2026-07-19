// app/(owner)/owner/loading.tsx
export default function OwnerLoading() {
  return (
    <div className="w-full space-y-6 select-none animate-pulse">
      {/* ------------------------------------------------------------- */}
      {/* TOP METRIC MINI CARDS SKELETON                                */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-card border border-line rounded-2xl p-4 space-y-3 shadow-sm"
          >
            <div className="h-3 w-16 bg-inset rounded-md" />
            <div className="h-7 w-24 bg-inset rounded-lg" />
            <div className="h-2.5 w-12 bg-inset rounded-md" />
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PRIMARY BENTO SHEET GRID PREVIEW                             */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Large Data List Card */}
        <div className="lg:col-span-2 bg-card border border-line rounded-2xl p-5 space-y-4 shadow-sm min-h-80">
          <div className="flex items-center justify-between border-b border-line/40 pb-3">
            <div className="space-y-1.5">
              <div className="h-4 w-32 bg-inset rounded-md" />
              <div className="h-3 w-48 bg-inset rounded-md" />
            </div>
            <div className="h-8 w-20 bg-inset rounded-lg" />
          </div>

          {/* Simulated Rows */}
          <div className="space-y-3 pt-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-line/20 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-inset rounded-xl shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-36 bg-inset rounded-md" />
                    <div className="h-2.5 w-20 bg-inset rounded-md" />
                  </div>
                </div>
                <div className="h-4 w-14 bg-inset rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Small Analytics Callout Card */}
        <div className="bg-card border border-line rounded-2xl p-5 space-y-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-4 w-28 bg-inset rounded-md" />
            <div className="h-32 w-full bg-inset/40 border border-line/40 rounded-xl flex items-center justify-center">
              {/* Soft centered circular loading cue */}
              <div className="h-6 w-6 rounded-full border-2 border-line border-t-accent/60 animate-spin" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-3.5 w-full bg-inset rounded-md" />
            <div className="h-3.5 w-4/5 bg-inset rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
