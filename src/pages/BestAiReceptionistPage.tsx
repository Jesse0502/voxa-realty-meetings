import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MessageSquare,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import voxaLogo from "@/assets/voxa-logo.png";

const evaluationCriteria = [
  {
    title: "Speed to first response",
    description:
      "The best AI receptionist for real estate agents should respond to new leads in under 10 seconds, every time.",
    icon: <Clock3 className="h-5 w-5 text-primary" />,
  },
  {
    title: "Real estate context awareness",
    description:
      "It should understand buyer and seller intent, property details, and the local agency workflow without sounding robotic.",
    icon: <MessageSquare className="h-5 w-5 text-primary" />,
  },
  {
    title: "Conversion-focused qualification",
    description:
      "The system must qualify motivation and timeline, then route the right leads to your team for appraisals and inspections.",
    icon: <Star className="h-5 w-5 text-primary" />,
  },
];

const comparisonRows = [
  {
    label: "Missed call follow-up in seconds",
    voxa: "Yes",
    generic: "Often delayed",
  },
  {
    label: "Portal lead workflows for real estate",
    voxa: "Built for REA and Domain",
    generic: "General purpose",
  },
  {
    label: "Lead qualification for listings and buyers",
    voxa: "Yes, with intent capture",
    generic: "Basic templates",
  },
  {
    label: "CRM sync for agency pipelines",
    voxa: "Native real estate handoff",
    generic: "Manual exports",
  },
];

const faqItems = [
  {
    question: "What is the best AI receptionist for real estate agents?",
    answer:
      "The best option is one that responds instantly, qualifies intent accurately, and moves high-value leads into your team workflow without delay.",
  },
  {
    question: "Can an AI receptionist really help win more listings?",
    answer:
      "Yes. Fast first response and better seller qualification increase appointment rates, which directly improves listing opportunities.",
  },
  {
    question: "Does Voxa replace agents?",
    answer:
      "No. Voxa handles repetitive front-line lead response so agents can spend more time on appraisals, negotiations, and closing deals.",
  },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};

const BestAiReceptionistPage = () => {
  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={voxaLogo}
              alt="Voxa Realty"
              className="h-12 w-auto sm:h-14"
            />
          </Link>

          <Button
            asChild
            className="h-11 rounded-full px-6 text-sm font-semibold"
          >
            <Link to="/">Book a call</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10 lg:py-14">
        <article className="space-y-12">
          <header className="max-w-4xl space-y-4">
            <p className="section-kicker">Real estate AI buyer guide</p>
            <h1 className="text-[clamp(2.1rem,4.5vw,4rem)] font-semibold leading-[0.95] tracking-tight text-foreground">
              Best AI receptionist for real estate agents: what to look for in
              2026
            </h1>
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">
              If you are comparing tools, focus on conversion outcomes, not only
              automation claims. The best AI receptionist for real estate agents
              should respond instantly, qualify lead intent, and book more
              qualified conversations for your team.
            </p>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {evaluationCriteria.map(({ title, description, icon }) => (
              <div key={title} className="surface-card rounded-2xl p-5">
                <div className="inline-flex rounded-full bg-primary/10 p-2">
                  {icon}
                </div>
                <h2 className="mt-4 text-2xl font-semibold leading-tight text-foreground">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </section>

          <section className="space-y-4">
            <h2 className="text-4xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-5xl">
              Voxa vs generic AI receptionist tools
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Many tools can send a message. Few are designed for real estate
              sales workflows. Voxa is purpose-built for agents who need speed,
              qualification, and clean CRM handoff.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-border/70 bg-white/75">
              <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border/70 bg-primary/5">
                    <th className="px-4 py-3 font-semibold text-foreground">
                      Capability
                    </th>
                    <th className="px-4 py-3 font-semibold text-foreground">
                      Voxa Realty
                    </th>
                    <th className="px-4 py-3 font-semibold text-foreground">
                      Generic AI Tool
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map(({ label, voxa, generic }) => (
                    <tr
                      key={label}
                      className="border-b border-border/60 last:border-b-0"
                    >
                      <td className="px-4 py-3 text-foreground/90">{label}</td>
                      <td className="px-4 py-3 text-foreground">
                        <span className="inline-flex items-center gap-2 font-medium text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                          {voxa}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {generic}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(faqStructuredData),
              }}
            />
            <h2 className="text-4xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-5xl">
              FAQ: choosing the best AI receptionist for real estate agents
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {faqItems.map(({ question, answer }) => (
                <div key={question} className="surface-card rounded-2xl p-5">
                  <h3 className="text-xl font-semibold leading-tight text-foreground">
                    {question}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card rounded-3xl p-6 sm:p-8">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Ready to map Voxa to your lead flow?
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Book a strategy call to review your missed-call process, internet
              lead response time, and the fastest rollout path for your team.
            </p>
            <Button
              asChild
              className="mt-6 h-11 rounded-full px-6 text-sm font-semibold"
            >
              <Link to="/">
                Book a call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </section>
        </article>
      </main>
    </div>
  );
};

export default BestAiReceptionistPage;
