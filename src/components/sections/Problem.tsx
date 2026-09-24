import * as React from "react";
import { siteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import {
  FileQuestion,
  PhoneOff,
  ClockAlert,
  BookOpen,
  UserX,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// Contextual visual metadata for each of the 5 pain points
const PAIN_POINT_META = [
  {
    category: "PAPERWORK",
    icon: FileQuestion,
    tag: "NOC Status: Unknown",
    tagColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  },
  {
    category: "LEAD FOLLOW-UP",
    icon: PhoneOff,
    tag: "Follow-up: Missed",
    tagColor: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
  },
  {
    category: "DELIVERY & RC",
    icon: ClockAlert,
    tag: "RC Transfer: 90 Days Overdue",
    tagColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  },
  {
    category: "PROFIT MARGINS",
    icon: BookOpen,
    tag: "Margins: Paper Notebook",
    tagColor: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
  },
  {
    category: "STAFF ATTENDANCE",
    icon: UserX,
    tag: "Attendance: Manual Register",
    tagColor: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
  },
];

export function Problem() {
  const problem = siteContent.problem;

  return (
    <Section id="problem" variant="inset" spacing="spacious">
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Headline & Transformation Card */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <h2 className="text-display-lg font-extrabold text-ink tracking-tight">
              {problem.heading}
            </h2>

            <p className="text-body-lg text-ink-muted leading-relaxed">
              Without unified software, pre-owned car showrooms suffer from lost customer follow-ups, delayed NOC papers, unknown margins, and unverified attendance registers.
            </p>

            {/* Solution Transformation Highlight Card */}
            <div className="rounded-2xl border border-line bg-card p-6 shadow-bento space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-accent">
                <Sparkles className="h-4 w-4" />
                <span>The Showroom Reality</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-ink-muted bg-inset p-3 rounded-xl border border-line/60">
                  <span className="line-through decoration-danger/60">Memory &amp; Paper Notebooks</span>
                  <span className="text-danger font-semibold">Chaotic</span>
                </div>

                <div className="flex items-center justify-center">
                  <div className="h-6 w-0.5 bg-line flex items-center justify-center">
                    <ArrowRight className="h-3 w-3 text-accent rotate-90" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono bg-highlight-light text-highlight-ink p-3 rounded-xl border border-highlight/30 font-bold">
                  <span>Odoline Central System</span>
                  <span className="bg-highlight-ink text-highlight text-[10px] px-2 py-0.5 rounded-full uppercase">One Screen</span>
                </div>
              </div>

              <p className="text-sm font-medium text-ink leading-relaxed pt-2 border-t border-line/60">
                {problem.closingLine}
              </p>
            </div>
          </div>

          {/* Right Column: Visual Problem Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {problem.painPoints.map((point, index) => {
              const meta = PAIN_POINT_META[index] || PAIN_POINT_META[0];
              const IconComp = meta.icon;
              const isFullWidth = index === problem.painPoints.length - 1;

              return (
                <div
                  key={index}
                  className={`flex flex-col justify-between rounded-2xl border border-line bg-card p-5 sm:p-6 shadow-bento transition-all hover:border-line-focus hover:shadow-md ${
                    isFullWidth ? "sm:col-span-2" : ""
                  }`}
                >
                  <div>
                    {/* Header Row: Category Tag & Icon */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-[11px] font-mono font-bold tracking-wider text-ink-subtle uppercase">
                        {meta.category}
                      </span>
                      <div className="h-9 w-9 rounded-xl bg-inset border border-line/60 flex items-center justify-center text-ink-secondary shrink-0">
                        <IconComp className="h-4.5 w-4.5" />
                      </div>
                    </div>

                    {/* Pain Point Statement */}
                    <p className="text-body-lg text-ink font-semibold leading-relaxed mb-4">
                      &ldquo;{point}&rdquo;
                    </p>
                  </div>

                  {/* Bottom Status Badge Indicator */}
                  <div className="pt-3 border-t border-line/60 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium border ${meta.tagColor}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {meta.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
