'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { AgentInput, AgentReport } from "@/lib/agent";
import { runAgent } from "@/lib/agent";
import clsx from "clsx";

type TimelineStatus = "queued" | "active" | "done";

interface TimelineStep {
  id: string;
  label: string;
  description: string;
  status: TimelineStatus;
}

const TIMELINE_BLUEPRINT = [
  {
    id: "signal-scan",
    label: "Signal Scan",
    description: "Listening to audience chatter, competitive patterns, and cultural shifts."
  },
  {
    id: "content-ops",
    label: "Content Ops Sync",
    description: "Mapping cadence, production bandwidth, and asset inventory."
  },
  {
    id: "framework-forge",
    label: "Framework Forge",
    description: "Generating hook libraries, storyline arcs, and CTA matrices."
  },
  {
    id: "launch-map",
    label: "Launch Map",
    description: "Sequencing drops, aligning sounds, and locking daily actions."
  }
] as const;

const INITIAL_FORM: AgentInput = {
  brandName: "Orbit Labs",
  niche: "AI-powered creator tools",
  targetAudience: "ambitious solopreneurs scaling on TikTok",
  tone: "high-energy, data-backed, candid",
  goals: "10x reach, double profile visits, convert to waitlist",
  cadence: "4x weekly",
  recentWins: "hit 250k views on a tutorial, community demanding deeper breakdowns",
  challenges: "audience fatigue on generic tips"
};

function buildTimelineStatus(activeIndex: number): TimelineStep[] {
  return TIMELINE_BLUEPRINT.map((step, index) => {
    const status: TimelineStatus =
      index < activeIndex ? "done" : index === activeIndex ? "active" : "queued";
    return {
      ...step,
      status
    };
  });
}

export default function Home() {
  const [formState, setFormState] = useState<AgentInput>(INITIAL_FORM);
  const [timeline, setTimeline] = useState<TimelineStep[]>(() => buildTimelineStatus(0));
  const [report, setReport] = useState<AgentReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const handleInputChange = (field: keyof AgentInput) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];

    setIsProcessing(true);
    setReport(null);
    setTimeline(buildTimelineStatus(0));

    const stagedInput = { ...formState };

    TIMELINE_BLUEPRINT.forEach((_, index) => {
      const timeout = window.setTimeout(() => {
        setTimeline(buildTimelineStatus(index));
        if (index === TIMELINE_BLUEPRINT.length - 1) {
          const finalTimeout = window.setTimeout(() => {
            setTimeline(buildTimelineStatus(TIMELINE_BLUEPRINT.length));
            const outcome = runAgent(stagedInput);
            setReport(outcome);
            setIsProcessing(false);
          }, 520);
          timers.current.push(finalTimeout);
        }
      }, index * 620);
      timers.current.push(timeout);
    });
  };

  const insightPlaceholder = useMemo(
    () => ({
      headline: "Awaiting agent reboot…",
      context:
        "Feed the agent on the left with brand intel. Your TikTok blueprint will materialize here with hooks, scripts, and sound pairings."
    }),
    []
  );

  return (
    <main className="min-h-screen pb-16">
      <section className="relative overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-agent-accent/40 blur-[120px]"></div>
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pt-16">
          <header className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex max-w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.25em] text-white/60">
                TikTok Agent • Live
                <span className="h-2 w-2 animate-ping rounded-full bg-rose-500" />
                <span className="h-2 w-2 rounded-full bg-rose-500" />
              </span>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Bring the TikTok Agent back online and orchestrate creators-first growth.
              </h1>
              <p className="max-w-2xl text-lg text-white/70">
                Upload your brand intel, and the agent plots a weekly cadence with scroll-stopping hooks,
                soundtrack pairings, and rapid-fire experiments engineered for the For You Page.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-white/60">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Hook Refinery
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Audio Intelligence
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Cadence Architect
                </span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-agent-secondary/20 via-fuchsia-500/10 to-transparent opacity-80" />
              <div className="relative space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Agent Telemetry</p>
                <div className="grid grid-cols-2 gap-4 text-white/80">
                  <div>
                    <p className="text-xs text-white/50">Hook Library</p>
                    <p className="text-2xl font-semibold">+48 fresh</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Retention Delta</p>
                    <p className="text-2xl font-semibold">↑ 27%</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Sound Sync</p>
                    <p className="text-2xl font-semibold">Locked</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Launch Window</p>
                    <p className="text-2xl font-semibold">Ready</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="grid gap-8 lg:grid-cols-[minmax(320px,380px)_1fr]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
                <h2 className="text-lg font-semibold">Agent Input Stack</h2>
                <p className="text-sm text-white/65">
                  Feed the agent signal-rich intel on your brand, audience, and mission. It pushes everything
                  through our campaign synthesis engine.
                </p>
                <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                  <Field
                    label="Brand Codename"
                    value={formState.brandName}
                    onChange={handleInputChange("brandName")}
                    placeholder="Orbit Labs"
                  />
                  <Field
                    label="Niche & Edge"
                    value={formState.niche}
                    onChange={handleInputChange("niche")}
                    placeholder="AI-powered creator tools"
                  />
                  <Field
                    label="Target Audience"
                    value={formState.targetAudience}
                    onChange={handleInputChange("targetAudience")}
                    placeholder="ambitious solopreneurs scaling on TikTok"
                  />
                  <Field
                    label="Tone Controls"
                    value={formState.tone}
                    onChange={handleInputChange("tone")}
                    placeholder="high-energy, data-backed, candid"
                  />
                  <Field
                    label="Primary Goals"
                    value={formState.goals}
                    onChange={handleInputChange("goals")}
                    placeholder="10x reach, double profile visits, convert to waitlist"
                  />
                  <Field
                    label="Publishing Cadence"
                    value={formState.cadence}
                    onChange={handleInputChange("cadence")}
                    placeholder="4x weekly"
                  />
                  <Field
                    label="Recent Momentum"
                    value={formState.recentWins}
                    onChange={handleInputChange("recentWins")}
                    placeholder="hit 250k views on a tutorial, community demanding deeper breakdowns"
                  />
                  <Field
                    label="Current Frictions"
                    value={formState.challenges}
                    onChange={handleInputChange("challenges")}
                    placeholder="audience fatigue on generic tips"
                    textarea
                  />
                  <button
                    type="submit"
                    className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-agent-secondary to-agent-accent px-5 py-3 text-base font-semibold text-white shadow-lg shadow-agent-secondary/40 transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-agent-accent/50"
                  >
                    <span className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
                    {isProcessing ? "Rebooting Agent…" : "Deploy TikTok Agent"}
                    <span
                      className={clsx("h-2 w-2 rounded-full", {
                        "animate-pulse bg-white": isProcessing,
                        "bg-white/70": !isProcessing
                      })}
                    />
                  </button>
                </form>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
                <h3 className="text-lg font-semibold">Agent Timeline</h3>
                <p className="text-sm text-white/65">
                  Watch the subsystems spin up as your blueprint compiles.
                </p>
                <div className="mt-6 space-y-4">
                  {timeline.map((step) => (
                    <TimelineRow key={step.id} step={step} />
                  ))}
                </div>
              </section>
            </div>

            <section className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
                {report ? (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Mission Summary</h2>
                    <p className="text-white/80">{report.summary}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">{insightPlaceholder.headline}</h2>
                    <p className="text-white/70">{insightPlaceholder.context}</p>
                  </div>
                )}
              </div>

              {report ? (
                <ReportDeck report={report} />
              ) : (
                <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-white/50">
                  <p>Blueprint output stream will display here once the agent finishes compiling.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea = false
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  const baseClass =
    "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:border-agent-accent/60 focus:outline-none focus:ring-2 focus:ring-agent-accent/30";
  return (
    <label className="block space-y-2 text-sm">
      <span className="text-white/70">{label}</span>
      {textarea ? (
        <textarea
          rows={3}
          className={clsx(baseClass, "resize-none")}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <input className={baseClass} value={value} onChange={onChange} placeholder={placeholder} />
      )}
    </label>
  );
}

function TimelineRow({ step }: { step: TimelineStep }) {
  const statusChip = {
    queued: {
      label: "Queued",
      className: "bg-white/5 border border-white/10 text-white/50"
    },
    active: {
      label: "Processing",
      className: "bg-agent-accent/20 border border-agent-accent/50 text-agent-accent"
    },
    done: {
      label: "Complete",
      className: "bg-emerald-400/15 border border-emerald-300/40 text-emerald-200"
    }
  }[step.status];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white/80">{step.label}</p>
        <span
          className={clsx(
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
            statusChip.className
          )}
        >
          <span
            className={clsx("h-1.5 w-1.5 rounded-full", {
              "animate-ping bg-agent-accent": step.status === "active",
              "bg-emerald-300": step.status === "done",
              "bg-white/40": step.status === "queued"
            })}
          />
          {statusChip.label}
        </span>
      </div>
      <p className="mt-2 text-sm text-white/60">{step.description}</p>
    </div>
  );
}

function ReportDeck({ report }: { report: AgentReport }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-2">
        <Card title="Brand Voice Protocols">
          <ul className="space-y-3 text-sm text-white/75">
            {report.brandVoice.map((line, index) => (
              <li key={index} className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-agent-accent/80" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Content Pillars">
          <ul className="space-y-3 text-sm text-white/75">
            {report.pillars.map((pillar, index) => (
              <li key={index} className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-agent-secondary/70" />
                <span>{pillar}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card title="Opportunity Radar">
        <ul className="space-y-3 text-sm text-white/75">
          {report.opportunities.map((opportunity, index) => (
            <li key={index} className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300/70" />
              <span>{opportunity}</span>
            </li>
          ))}
        </ul>
      </Card>

      <section className="grid gap-6 lg:grid-cols-3">
        {report.campaignIdeas.map((idea, index) => (
          <Card key={index} title={idea.title}>
            <div className="space-y-3 text-sm text-white/75">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Hook</p>
                <p className="mt-1 text-white/90">{idea.hook}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Storyline</p>
                <p className="mt-1">{idea.storyline}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Transitions</p>
                <p className="mt-1">{idea.transitions.join(" · ")}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">CTA</p>
                <p className="mt-1">{idea.callToAction}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Hashtags</p>
                <p className="mt-1 text-white/60">{idea.hashtags.join(" ")}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <Card title="Posting Cadence Map">
        <div className="grid gap-4 md:grid-cols-2">
          {report.schedule.map((slot, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>{slot.day}</span>
                <span>{slot.bestTime}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-white/85">{slot.format}</p>
              <p className="mt-2 text-sm text-white/70">{slot.concept}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/40">Hero Hook</p>
              <p className="mt-1 text-sm text-white/80">{slot.heroHook}</p>
            </div>
          ))}
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card title="Trending Audio Pairings">
          <div className="space-y-4">
            {report.trendingSounds.map((sound, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white/85">{sound.title}</p>
                  <span className="text-xs text-white/50">{sound.bpm} BPM · {sound.energy}</span>
                </div>
                <p className="mt-2 text-sm text-white/70">{sound.usageTip}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Daily Action Sprints">
          <ul className="space-y-3 text-sm text-white/75">
            {report.dailyActions.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/40" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card title="Measurement North Stars">
          <div className="space-y-3 text-sm text-white/75">
            <ListBlock heading="Primary Metrics" items={report.measurement.northStars} />
            <ListBlock heading="Supporting Signals" items={report.measurement.supporting} />
            <ListBlock heading="Experiments" items={report.measurement.experiments} />
          </div>
        </Card>
        <Card title="Rapid-Fire Hook Bank">
          <ul className="space-y-2 text-sm text-white/80">
            {report.rapidFireHooks.map((hook, index) => (
              <li key={index} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                {hook}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
      <h3 className="text-lg font-semibold text-white/90">{title}</h3>
      <div className="mt-4">{children}</div>
    </article>
  );
}

function ListBlock({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-white/45">{heading}</p>
      <ul className="mt-2 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-white/75">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
