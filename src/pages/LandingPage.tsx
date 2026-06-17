import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PublicNavbar } from "@/components/PublicNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Bot,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Fingerprint,
  Link2,
  Loader2,
  MessageSquare,
  PhoneForwarded,
  PhoneCall,
  Rocket,
  Sparkles,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
const proofStats = [
  { value: "<1s", label: "Instant reply time" },
  { value: "24/7", label: "Coverage, no gaps" },
  { value: "100%", label: "Leads Captured" },
];

const workflowSteps = [
  {
    number: "01",
    title: "Customization & Needs Analysis",
    icon: ClipboardList,
    description:
      "We define exactly what your AI agent should do — the qualification flow, the questions it needs to ask callers, and how leads should be prioritized from the first ring.",
  },
  {
    number: "02",
    title: "Seamless Integrations",
    icon: Link2,
    description:
      "We connect Voxa directly to your realestate.com.au profile and active listings. Custom CRM integrations ReapitSales, AgentBox, Zenu at zero extra cost.",
  },
  {
    number: "03",
    title: "Phone Number Mapping",
    icon: PhoneForwarded,
    description:
      "Your existing number stays the same. Missed calls route instantly to Voxa so no lead is ever dropped even when you're mid-showing or off the clock.",
  },
  {
    number: "04",
    title: "Go Live & Start Using",
    icon: Rocket,
    description:
      "Start your day as normal. Voxa handles every missed call, books appointments, and keeps prospects warm until your team is ready to close.",
  },
];

const seoFaqs = [
  {
    question: "Does Voxa store my data?",
    answer:
      "No. Voxa processes calls in real-time and fetches CRM data on demand. We do not retain any personal information after the call ends, ensuring your data remains secure and private.",
  },
  {
    question: "Can Voxa follow up both buyer and seller leads?",
    answer:
      "Yes. Voxa handles both buyer and seller conversations, gathering key property details and qualifying leads before routing them to your team.",
  },
  {
    question: "Is this only for solo agents?",
    answer:
      "Voxa is currently optimized for solo agents. However, we offer custom solutions for small teams and larger brokerages. Contact our sales team to discuss your specific requirements.",
  },
  {
    question: "How much does it cost?",
    answer:
      "We offer flexible pricing tiers to suit different needs. The Starter plan is A$149/month with 240 coverage mins and 240 SMS included. The Growth plan is A$249/month with 360 coverage mins and 360 SMS. The Pro plan is A$449/month with 600 coverage mins and 600 SMS. All plans require a 3-month minimum term and a one-time A$89 refundable setup fee.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most agents are live within 24 hours. Our team handles the entire configuration process, connects your existing systems, and runs comprehensive testing before launch.",
  },
  {
    question: "Does Voxa replace my agents?",
    answer:
      "No. Voxa complements your team by handling initial lead response and qualification. This allows your agents to focus on high-value conversations with prospects who are already informed and ready to proceed.",
  },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: seoFaqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};

const LandingPage = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleBookingOpenChange = (open: boolean) => {
    setBookingOpen(open);

    if (!open) {
      setFormSubmitted(false);
      setFormLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName || !formPhone || formLoading) return;

    setFormLoading(true);
    const normalizedPhone = `+61${formPhone.replace(/\D/g, "").replace(/^0+/, "")}`;

    try {
      const response = await fetch("https://formspree.io/f/maqkerye", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formName,
          phone: normalizedPhone,
          agency_suburb: formEmail,
          intent: "book_call",
          source: "landing_page",
          _subject: "New Voxa booking request",
        }),
      });

      if (!response.ok) {
        throw new Error(`Formspree request failed: ${response.status}`);
      }

      setFormSubmitted(true);
      toast.success(
        "Booking request received. We will email available times shortly.",
      );
      setFormName("");
      setFormEmail("");
      setFormPhone("");
    } catch (error) {
      console.error("Failed to submit form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#071220] text-white">
      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <div className="relative min-h-[100svh] overflow-hidden">
        {/* Dark hero base */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100svh] bg-[#071220]" />
        {/* Teal ambient glows */}
        <div className="pointer-events-none absolute left-[-16%] top-[-12%] z-0 h-[38rem] w-[38rem] rounded-full bg-teal-500/12 blur-[120px]" />
        <div className="pointer-events-none absolute right-[-14%] top-[0%] z-0 h-[32rem] w-[32rem] rounded-full bg-teal-400/10 blur-[120px]" />
        {/* Teal grid */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100svh] w-full bg-[linear-gradient(to_right,rgba(20,184,166,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,184,166,0.07)_1px,transparent_1px)] bg-[size:40px_40px]" />
        {/* Center vignette */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100svh] bg-[radial-gradient(ellipse_80%_55%_at_50%_42%,rgba(4,10,22,0.62),transparent)]" />

        {/* Cityscape SVG */}
        <svg
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100svh] w-full"
          viewBox="0 0 1440 720"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="win-warm"
              width="8"
              height="11"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="1.5"
                y="2"
                width="4"
                height="5.5"
                rx="0.3"
                fill="rgba(255,200,60,0.8)"
              />
            </pattern>
            <pattern
              id="win-cool"
              width="8"
              height="11"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="1.5"
                y="2"
                width="4"
                height="5.5"
                rx="0.3"
                fill="rgba(190,230,255,0.65)"
              />
            </pattern>
            <pattern
              id="win-wide"
              width="11"
              height="13"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="1.5"
                y="2"
                width="6"
                height="7"
                rx="0.3"
                fill="rgba(255,205,65,0.75)"
              />
            </pattern>
            <pattern
              id="win-sparse"
              width="14"
              height="18"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="2"
                y="3"
                width="5"
                height="7"
                rx="0.3"
                fill="rgba(255,200,60,0.6)"
              />
            </pattern>
            <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="soft-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="bldg-shade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(0,0,0,0.35)" />
              <stop offset="30%" stopColor="rgba(0,0,0,0)" />
            </linearGradient>
            <linearGradient id="mid-haze" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(7,18,32,0)" />
              <stop offset="100%" stopColor="rgba(7,18,32,0.8)" />
            </linearGradient>
          </defs>

          {/* Hazier background layer */}
          <g
            fill="#0a1628"
            className="animate-bldg-back hidden sm:block"
            opacity="0.45"
          >
            <rect x="0" y="380" width="60" height="240" />
            <rect x="65" y="320" width="90" height="300" />
            <rect x="160" y="350" width="55" height="270" />
            <rect x="220" y="300" width="70" height="320" />
            <rect x="295" y="260" width="100" height="360" />
            <rect x="400" y="310" width="80" height="310" />
            <rect x="485" y="240" width="110" height="380" />
            <rect x="600" y="280" width="85" height="340" />
            <rect x="690" y="320" width="70" height="300" />
            <rect x="765" y="250" width="100" height="370" />
            <rect x="870" y="300" width="75" height="320" />
            <rect x="950" y="260" width="90" height="360" />
            <rect x="1045" y="320" width="65" height="300" />
            <rect x="1115" y="290" width="80" height="330" />
            <rect x="1200" y="330" width="70" height="290" />
            <rect x="1275" y="280" width="85" height="340" />
            <rect x="1365" y="310" width="75" height="310" />
          </g>

          {/* Mobile skyline — 7 wide buildings, full width */}
          <g
            transform="translate(0,-180)"
            className="animate-bldg-main sm:hidden"
            opacity="0.9"
          >
            {/* Background haze for mobile */}
            <rect
              x="0"
              y="400"
              width="1440"
              height="500"
              fill="url(#mid-haze)"
              className="pointer-events-none"
            />
            {/* Bldg 1 */}
            <rect x="0" y="490" width="185" height="510" fill="#0e1d38" />
            <rect
              x="0"
              y="490"
              width="185"
              height="510"
              fill="url(#win-warm)"
              opacity="0.75"
            />
            <rect
              x="0"
              y="490"
              width="185"
              height="510"
              fill="url(#bldg-shade)"
            />
            <rect x="80" y="438" width="4" height="52" fill="#253a55" />
            <circle
              cx="82"
              cy="438"
              r="2.5"
              fill="rgba(255,80,60,0.9)"
              filter="url(#soft-glow)"
              className="animate-aviation"
            />
            {/* Bldg 2 — shorter accent */}
            <rect x="193" y="540" width="155" height="460" fill="#0c1b34" />
            <rect
              x="193"
              y="540"
              width="155"
              height="460"
              fill="url(#win-sparse)"
              opacity="0.55"
            />
            <rect
              x="193"
              y="540"
              width="155"
              height="460"
              fill="url(#bldg-shade)"
            />
            {/* Bldg 3 — tallest left-center */}
            <rect x="356" y="350" width="230" height="650" fill="#121f3c" />
            <rect
              x="356"
              y="350"
              width="230"
              height="650"
              fill="url(#win-wide)"
              opacity="0.78"
            />
            <rect
              x="356"
              y="350"
              width="230"
              height="650"
              fill="url(#bldg-shade)"
            />
            <rect x="368" y="298" width="206" height="52" fill="#121f3c" />
            <rect
              x="368"
              y="298"
              width="206"
              height="52"
              fill="url(#win-wide)"
              opacity="0.78"
            />
            <rect x="463" y="248" width="6" height="50" fill="#253a55" />
            <circle
              cx="466"
              cy="248"
              r="3"
              fill="rgba(255,80,60,0.95)"
              filter="url(#soft-glow)"
              className="animate-aviation-2"
            />
            {/* Bldg 4 — medium center-left */}
            <rect x="596" y="450" width="185" height="550" fill="#0d1c35" />
            <rect
              x="596"
              y="450"
              width="185"
              height="550"
              fill="url(#win-cool)"
              opacity="0.6"
            />
            <rect
              x="596"
              y="450"
              width="185"
              height="550"
              fill="url(#bldg-shade)"
            />
            {/* Bldg 5 — tall center-right */}
            <rect x="789" y="390" width="255" height="610" fill="#0f1d37" />
            <rect
              x="789"
              y="390"
              width="255"
              height="610"
              fill="url(#win-cool)"
              opacity="0.72"
            />
            <rect
              x="789"
              y="390"
              width="255"
              height="610"
              fill="url(#bldg-shade)"
            />
            <rect x="802" y="338" width="229" height="52" fill="#0f1d37" />
            <rect
              x="802"
              y="338"
              width="229"
              height="52"
              fill="url(#win-cool)"
              opacity="0.72"
            />
            {/* Bldg 6 — medium right-center */}
            <rect x="1053" y="420" width="195" height="580" fill="#0d1b34" />
            <rect
              x="1053"
              y="420"
              width="195"
              height="580"
              fill="url(#win-warm)"
              opacity="0.76"
            />
            <rect
              x="1053"
              y="420"
              width="195"
              height="580"
              fill="url(#bldg-shade)"
            />
            <rect x="1065" y="366" width="171" height="54" fill="#0d1b34" />
            <rect
              x="1065"
              y="366"
              width="171"
              height="54"
              fill="url(#win-warm)"
              opacity="0.76"
            />
            <rect x="1138" y="306" width="6" height="60" fill="#253a55" />
            <circle
              cx="1141"
              cy="306"
              r="2.5"
              fill="rgba(255,80,60,0.9)"
              filter="url(#soft-glow)"
              className="animate-aviation-3"
            />
            {/* Bldg 7 */}
            <rect x="1257" y="480" width="183" height="520" fill="#111e38" />
            <rect
              x="1257"
              y="480"
              width="183"
              height="520"
              fill="url(#win-warm)"
              opacity="0.7"
            />
            <rect
              x="1257"
              y="480"
              width="183"
              height="520"
              fill="url(#bldg-shade)"
            />
          </g>

          {/* Desktop skyline — original detailed buildings */}
          <g
            transform="translate(0,-180)"
            className="animate-bldg-main hidden sm:block"
            opacity="0.9"
          >
            {/* Atmospheric mid-ground depth haze */}
            <rect
              x="0"
              y="410"
              width="1440"
              height="500"
              fill="url(#mid-haze)"
              className="pointer-events-none"
            />
            <rect x="0" y="550" width="75" height="350" fill="#0e1d38" />
            <rect
              x="0"
              y="550"
              width="75"
              height="350"
              fill="url(#win-warm)"
              opacity="0.9"
            />
            <rect
              x="0"
              y="550"
              width="75"
              height="350"
              fill="url(#bldg-shade)"
            />
            <rect x="80" y="470" width="58" height="430" fill="#111f3c" />
            <rect
              x="80"
              y="470"
              width="58"
              height="430"
              fill="url(#win-cool)"
              opacity="0.75"
            />
            <rect
              x="80"
              y="470"
              width="58"
              height="430"
              fill="url(#bldg-shade)"
            />
            <rect x="108" y="435" width="3" height="35" fill="#253a55" />
            <circle
              cx="109"
              cy="435"
              r="2"
              fill="rgba(255,80,60,0.9)"
              filter="url(#soft-glow)"
              className="animate-aviation"
            />
            <rect x="143" y="500" width="88" height="400" fill="#0d1c36" />
            <rect
              x="143"
              y="500"
              width="88"
              height="400"
              fill="url(#win-warm)"
              opacity="0.7"
            />
            <rect
              x="143"
              y="500"
              width="88"
              height="400"
              fill="url(#bldg-shade)"
            />
            <rect x="156" y="450" width="62" height="50" fill="#0d1c36" />
            <rect
              x="156"
              y="450"
              width="62"
              height="50"
              fill="url(#win-warm)"
              opacity="0.7"
            />
            <rect x="236" y="530" width="55" height="370" fill="#0c1b34" />
            <rect x="296" y="400" width="98" height="500" fill="#0f1d37" />
            <rect
              x="296"
              y="400"
              width="98"
              height="500"
              fill="url(#win-cool)"
              opacity="0.8"
            />
            <rect
              x="296"
              y="400"
              width="98"
              height="500"
              fill="url(#bldg-shade)"
            />
            <rect x="312" y="348" width="66" height="52" fill="#0f1d37" />
            <rect
              x="312"
              y="348"
              width="66"
              height="52"
              fill="url(#win-cool)"
              opacity="0.8"
            />
            <rect x="346" y="310" width="4" height="38" fill="#253a55" />
            <rect x="400" y="475" width="78" height="425" fill="#0e1c35" />
            <rect
              x="400"
              y="475"
              width="78"
              height="425"
              fill="url(#win-warm)"
              opacity="0.75"
            />
            <rect
              x="400"
              y="475"
              width="78"
              height="425"
              fill="url(#bldg-shade)"
            />
            {/* Melbourne Eureka Tower representation */}
            <rect x="495" y="325" width="92" height="575" fill="#0c182b" />
            <rect
              x="495"
              y="325"
              width="92"
              height="575"
              fill="url(#win-wide)"
              opacity="0.85"
            />
            <rect
              x="495"
              y="325"
              width="92"
              height="575"
              fill="url(#bldg-shade)"
            />
            {/* Mid tier */}
            <rect x="505" y="275" width="72" height="50" fill="#0c182b" />
            <rect
              x="505"
              y="275"
              width="72"
              height="50"
              fill="url(#win-wide)"
              opacity="0.85"
            />
            {/* Top crown (gold) */}
            <rect
              x="515"
              y="225"
              width="52"
              height="50"
              fill="#9e7b23"
              opacity="0.9"
            />
            <rect
              x="515"
              y="225"
              width="52"
              height="50"
              fill="url(#bldg-shade)"
            />
            <rect x="535" y="165" width="6" height="60" fill="#253a55" />
            <rect
              x="538"
              y="155"
              width="2"
              height="10"
              fill="rgba(255,80,60,0.8)"
            />
            <circle
              cx="539"
              cy="155"
              r="2.5"
              fill="rgba(255,80,60,0.95)"
              filter="url(#soft-glow)"
              className="animate-aviation-2"
            />
            {/* Next building */}
            <rect x="603" y="430" width="82" height="470" fill="#0d1c35" />
            <rect
              x="603"
              y="430"
              width="82"
              height="470"
              fill="url(#win-warm)"
              opacity="0.68"
            />
            <rect
              x="603"
              y="430"
              width="82"
              height="470"
              fill="url(#bldg-shade)"
            />
            <rect x="690" y="490" width="62" height="410" fill="#10203a" />
            <rect
              x="690"
              y="600"
              width="62"
              height="300"
              fill="url(#win-sparse)"
              opacity="0.55"
            />
            <rect
              x="690"
              y="490"
              width="62"
              height="410"
              fill="url(#bldg-shade)"
            />
            <rect x="758" y="395" width="102" height="505" fill="#0e1d37" />
            <rect
              x="758"
              y="395"
              width="102"
              height="505"
              fill="url(#win-warm)"
              opacity="0.78"
            />
            <rect
              x="758"
              y="395"
              width="102"
              height="505"
              fill="url(#bldg-shade)"
            />
            <rect x="807" y="358" width="4" height="37" fill="#253a55" />
            <ellipse cx="840" cy="393" rx="8" ry="3.5" fill="#0c1b2f" />
            <rect x="832" y="393" width="16" height="18" fill="#0c1b2f" />
            <ellipse cx="840" cy="411" rx="8" ry="3.5" fill="#0c1b2f" />
            <line
              x1="834"
              y1="411"
              x2="830"
              y2="425"
              stroke="#0c1b2f"
              strokeWidth="2"
            />
            <line
              x1="840"
              y1="411"
              x2="840"
              y2="425"
              stroke="#0c1b2f"
              strokeWidth="2"
            />
            <line
              x1="846"
              y1="411"
              x2="850"
              y2="425"
              stroke="#0c1b2f"
              strokeWidth="2"
            />
            <rect x="866" y="450" width="78" height="450" fill="#0f1d38" />
            <rect
              x="866"
              y="450"
              width="78"
              height="450"
              fill="url(#win-cool)"
              opacity="0.72"
            />
            <rect
              x="866"
              y="450"
              width="78"
              height="450"
              fill="url(#bldg-shade)"
            />
            <rect x="950" y="408" width="92" height="492" fill="#0d1b34" />
            <rect
              x="950"
              y="408"
              width="92"
              height="492"
              fill="url(#win-warm)"
              opacity="0.77"
            />
            <rect
              x="950"
              y="408"
              width="92"
              height="492"
              fill="url(#bldg-shade)"
            />
            <rect x="963" y="356" width="66" height="52" fill="#0d1b34" />
            <rect
              x="963"
              y="356"
              width="66"
              height="52"
              fill="url(#win-warm)"
              opacity="0.77"
            />
            <rect x="1048" y="478" width="68" height="422" fill="#0c1b33" />
            <rect
              x="1048"
              y="700"
              width="68"
              height="200"
              fill="url(#win-sparse)"
              opacity="0.5"
            />
            <rect x="1122" y="435" width="82" height="465" fill="#0e1d37" />
            <rect
              x="1122"
              y="435"
              width="82"
              height="465"
              fill="url(#win-cool)"
              opacity="0.74"
            />
            <rect
              x="1122"
              y="435"
              width="82"
              height="465"
              fill="url(#bldg-shade)"
            />
            <rect x="1210" y="465" width="73" height="435" fill="#101f39" />
            <rect
              x="1210"
              y="465"
              width="73"
              height="435"
              fill="url(#win-warm)"
              opacity="0.68"
            />
            <rect
              x="1210"
              y="465"
              width="73"
              height="435"
              fill="url(#bldg-shade)"
            />
            <ellipse cx="1237" cy="463" rx="7" ry="3" fill="#0c1b2f" />
            <rect x="1230" y="463" width="14" height="15" fill="#0c1b2f" />
            <ellipse cx="1237" cy="478" rx="7" ry="3" fill="#0c1b2f" />
            <line
              x1="1232"
              y1="478"
              x2="1229"
              y2="490"
              stroke="#0c1b2f"
              strokeWidth="2"
            />
            <line
              x1="1237"
              y1="478"
              x2="1237"
              y2="490"
              stroke="#0c1b2f"
              strokeWidth="2"
            />
            <line
              x1="1242"
              y1="478"
              x2="1245"
              y2="490"
              stroke="#0c1b2f"
              strokeWidth="2"
            />
            <rect x="1289" y="415" width="88" height="485" fill="#0d1c36" />
            <rect
              x="1289"
              y="415"
              width="88"
              height="485"
              fill="url(#win-warm)"
              opacity="0.79"
            />
            <rect
              x="1289"
              y="415"
              width="88"
              height="485"
              fill="url(#bldg-shade)"
            />
            <rect x="1301" y="363" width="64" height="52" fill="#0d1c36" />
            <rect
              x="1301"
              y="363"
              width="64"
              height="52"
              fill="url(#win-warm)"
              opacity="0.79"
            />
            <rect x="1331" y="325" width="4" height="38" fill="#253a55" />
            <circle
              cx="1333"
              cy="325"
              r="2"
              fill="rgba(255,80,60,0.9)"
              filter="url(#soft-glow)"
              className="animate-aviation-3"
            />
            <rect x="1383" y="490" width="57" height="410" fill="#111e38" />
            <rect
              x="1383"
              y="490"
              width="57"
              height="410"
              fill="url(#win-warm)"
              opacity="0.72"
            />
            <rect
              x="1383"
              y="490"
              width="57"
              height="410"
              fill="url(#bldg-shade)"
            />
          </g>

          {/* Foreground silhouettes — closest layer, no windows */}
          <g fill="#040b15">
            <rect x="0" y="615" width="130" height="185" />
            <rect x="125" y="638" width="85" height="162" />
            <rect x="205" y="605" width="105" height="195" />
            <rect x="305" y="648" width="65" height="152" />
            <rect x="365" y="592" width="90" height="208" />
            <rect x="450" y="630" width="140" height="170" />
            <rect x="580" y="610" width="80" height="190" />
            <rect x="650" y="640" width="110" height="160" />
            <rect x="750" y="580" width="90" height="220" />
            <rect x="830" y="625" width="70" height="175" />
            <rect x="890" y="605" width="100" height="195" />
            <rect x="980" y="635" width="90" height="165" />
            <rect x="1070" y="620" width="85" height="180" />
            <rect x="1150" y="598" width="100" height="202" />
            <rect x="1245" y="637" width="80" height="163" />
            <rect x="1320" y="608" width="120" height="192" />
          </g>

          <rect
            x="0"
            y="798"
            width="1440"
            height="2"
            fill="rgba(20,184,166,0.6)"
            filter="url(#neon-glow)"
          />
          <rect x="0" y="798" width="1440" height="282" fill="#071220" />
        </svg>

        {/* Bottom fading scrim */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-64 bg-gradient-to-t from-[#071220] via-[#071220]/80 to-transparent" />

        <PublicNavbar onBookCall={() => setBookingOpen(true)} />

        {/* ── Hero copy — centered ── */}
        <main className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-8xl flex-col items-center justify-center px-6 pb-14 pt-32 text-center lg:px-10">
          <div className="w-full">
            <p className="animate-rise-fade [animation-fill-mode:both] text-[0.68rem] font-bold uppercase tracking-[0.32em] text-[#119c9e]">
              Based in Melbourne
            </p>
            <h1 className="animate-rise-fade font-serif animate-delay-1 [animation-fill-mode:both] mx-auto mt-4 max-w-5xl text-[clamp(3.2rem,6.5vw,5.4rem)] leading-[1.0] text-white [text-shadow:0_10px_26px_rgba(15,23,42,0.32)]">
              Your Phone Answered,
              <br />
              <span className="text-[#119c9e]">Even When You Cannot.</span>
            </h1>
            <p className="animate-rise-fade animate-delay-2 [animation-fill-mode:both] mx-auto mt-6 mb-2 w-full max-w-[520px] text-center text-base leading-relaxed text-white/90 sm:text-lg">
              Voxa is an AI Assistant that knows your listings and CRM data,
              handles missed calls on your behalf, and gives you hours back
              every week.
            </p>

            <div className="animate-rise-fade animate-delay-3 [animation-fill-mode:both] mt-10 flex flex-col items-center justify-center gap-3">
              <Button
                className="h-12 w-full sm:w-auto rounded-xl bg-[#119c9e] px-7 text-sm font-semibold text-white shadow-[0_18px_40px_-18px_rgba(17,156,158,0.7)] transition-transform hover:-translate-y-0.5 hover:bg-[#0e8082]"
                onClick={() => setBookingOpen(true)}
              >
                Book a strategy call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ── Proof bar — centered ── */}
          <div className="animate-rise-fade animate-delay-3 [animation-fill-mode:both] mt-10 sm:mt-12 w-full max-w-2xl pt-8">
            <div className="grid grid-cols-3 gap-x-2 gap-y-6 sm:gap-x-14">
              {proofStats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-5xl">
                    {value}
                  </p>
                  <p className="mt-2 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-sky-200/50 sm:text-[0.68rem] sm:tracking-[0.22em]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ═══════════════════════════════════════════
          CONVERSATION MOCKUP — visual proof of product
      ═══════════════════════════════════════════ */}
      <section
        id="what-voxa-does"
        className="relative z-10 overflow-hidden bg-[#071220] py-16 sm:py-20 lg:py-28"
      >
        {/* Right ambient glow */}
        <div className="pointer-events-none absolute right-[-18%] top-[0%] -z-10 h-[36rem] w-[36rem] rounded-full bg-teal-500/8 blur-[110px]" />
        {/* Left edge accent line */}
        <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-px bg-gradient-to-b from-transparent via-[#119c9e]/20 to-transparent" />
        {/* Faint dot constellation — top right */}
        <div className="pointer-events-none absolute right-[4%] top-[8%] -z-10 h-48 w-48 bg-[radial-gradient(circle,rgba(17,156,158,0.18)_1px,transparent_1px)] bg-[size:18px_18px]" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
            {/* Left: copy */}
            <div>
              <p className="section-kicker">What Voxa actually does</p>
              <h2 className="mt-3 text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl">
                Responds. Qualifies.
                <br />
                Informs. Automatically.
              </h2>
              <p className="mt-4 text-base leading-7 text-sky-100/60">
                Every day realtors miss calls on inspections, in meetings, or
                after hours. Voxa answers on their behalf using their own phone
                number picks up instantly, holds a natural conversation, and
                qualifies every caller's intent so your agent knows exactly who
                to call back and why.
              </p>

              <Link
                to="/best-ai-receptionist-for-real-estate-agents"
                className="mt-7 inline-flex items-center text-sm font-bold text-[#119c9e] transition-colors hover:text-[#0e8082]"
              >
                Read the guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Right: call flow diagram */}
            <div className="select-none rounded-2xl border border-white/[0.07] bg-[#0b1726] p-4 sm:p-5 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.5)]">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-100/40">
                Call flow
              </p>

              {/* Step 1 — Incoming call */}
              <div className="flex flex-col items-center">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10">
                  <PhoneCall className="h-5 w-5 text-rose-400" />
                  <span className="absolute inset-0 animate-ping rounded-full bg-rose-300/40" />
                </div>
                <p className="mt-2 text-sm font-semibold text-white">
                  Incoming call
                </p>
                <p className="text-xs text-sky-100/50">
                  Agent on inspection — unavailable
                </p>
              </div>

              {/* Connector */}
              <div className="relative mx-auto my-2 flex h-8 w-1 justify-center overflow-hidden rounded-full bg-white/10">
                <span className="animate-flow-dot-grey absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white/40" />
              </div>

              {/* Step 2 — Unanswered */}
              <div className="flex justify-center">
                <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5">
                  <p className="text-xs font-semibold text-amber-400">
                    Call unanswered
                  </p>
                </div>
              </div>

              {/* Fork line */}
              <div className="relative mx-8 mt-3 mb-1 h-5">
                <div className="absolute inset-x-0 top-0 h-1 rounded-full bg-white/10" />
                <div className="absolute left-[19.5%] top-0 h-full w-1 rounded-full bg-white/10" />
                <div className="absolute right-[19.5%] top-0 h-full w-1 rounded-full bg-white/10" />
              </div>

              {/* Two paths */}
              <div className="mt-1 grid grid-cols-2 gap-3">
                {/* Without Voxa */}
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-100/40">
                    Without Voxa
                  </p>
                  <div className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                    <p className="text-sm text-white">📭 No answer</p>
                    <p className="mt-0.5 text-[11px] text-sky-100/50">
                      Goes to voicemail
                    </p>
                  </div>
                  <div className="h-5 w-0.5 rounded-full bg-white/10" />
                  <div className="w-full rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center">
                    <p className="text-xs font-semibold text-red-400">
                      Lead goes cold
                    </p>
                    <p className="mt-0.5 text-[11px] text-sky-100/50">
                      Opportunity lost
                    </p>
                  </div>
                </div>

                {/* With Voxa */}
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#119c9e]">
                    With Voxa
                  </p>
                  <div className="w-full rounded-xl border border-[#119c9e]/25 bg-[#119c9e]/5 p-3 text-center">
                    <p className="text-xs font-semibold text-[#119c9e]">
                      Voxa answers
                    </p>
                    <p className="mt-0.5 text-[11px] text-sky-100/50">
                      On your own number
                    </p>
                  </div>
                  <div className="relative h-6 w-1 overflow-hidden rounded-full bg-[#119c9e]/20">
                    <span
                      className="animate-flow-dot absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#119c9e]"
                      style={{ animationDelay: "0.35s" }}
                    />
                  </div>
                  <div className="w-full rounded-xl border border-[#119c9e]/25 bg-[#119c9e]/5 p-3 text-center">
                    <p className="text-xs font-semibold text-[#119c9e]">
                      Qualifies intent
                    </p>
                    <p className="mt-0.5 text-[11px] text-sky-100/50">
                      Budget · timeline · type
                    </p>
                  </div>
                  <div className="relative h-6 w-1 overflow-hidden rounded-full bg-[#119c9e]/20">
                    <span
                      className="animate-flow-dot absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#119c9e]"
                      style={{ animationDelay: "0.7s" }}
                    />
                  </div>
                  <div className="w-full rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-center">
                    <p className="text-xs font-semibold text-emerald-400">
                      ✓ Call booked
                    </p>
                    <p className="mt-0.5 text-[11px] text-sky-100/50">
                      Agent gets full brief
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WORKFLOW — numbered, linear, connected
      ═══════════════════════════════════════════ */}
      <section id="how-it-works" className="relative overflow-hidden bg-[#040d17] py-16 sm:py-20 lg:py-28">
        {/* Slow-drifting top-left orb */}
        <motion.div
          animate={{ y: [-18, 18, -18], x: [-10, 10, -10] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[-10%] top-[5%] -z-10 h-[32rem] w-[32rem] rounded-full bg-teal-600/8 blur-[110px]"
        />
        {/* Slow-drifting bottom-right orb */}
        <motion.div
          animate={{ y: [12, -12, 12], x: [8, -8, 8] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="pointer-events-none absolute bottom-[0%] right-[-8%] -z-10 h-[28rem] w-[28rem] rounded-full bg-cyan-500/6 blur-[100px]"
        />
        {/* Diagonal grid accent */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(20,184,166,0.04)_1px,transparent_1px),linear-gradient(45deg,rgba(20,184,166,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-10">
          {/* Header */}
          <div className="max-w-2xl">
            <p className="section-kicker">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-sm leading-6 text-sky-100/70 sm:text-base">
              Get your AI receptionist fully customized, integrated, and live in
              less than 24 hours.
            </p>
          </div>

          {/* Steps + flowing connector */}
          <div className="relative mt-16">
            {/* Animated connector — desktop only */}
            <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-1/2 z-0 hidden h-2 -translate-y-1/2 lg:block">
              <div className="pipeline-stream absolute inset-y-0 left-0 right-0 rounded-full" />
            </div>

            {/* Cards grid */}
            <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-14">
              {workflowSteps.map((step, i) => (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-white/[0.07] bg-[#0b1726] p-6"
                >
                  {/* Step number badge */}
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#67d7d8]/30 bg-[#67d7d8]/10">
                    <span className="text-sm font-bold tracking-wide text-[#67d7d8]">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <step.icon className="mb-5 h-5 w-5 text-[#67d7d8]/75" />

                  {/* Text */}
                  <h3 className="text-base font-semibold leading-snug tracking-tight text-white sm:text-[1.05rem]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.7] text-sky-100/55">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Button
              className="h-11 w-full sm:w-auto rounded-xl bg-[#119c9e] px-6 text-sm font-semibold text-white hover:bg-[#0e8082]"
              onClick={() => setBookingOpen(true)}
            >
              See it in action
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRICING — three tier cards
      ═══════════════════════════════════════════ */}
      <section
        id="pricing"
        className="relative overflow-hidden border-t border-white/[0.07] bg-[#071220] py-16 sm:py-20 lg:py-28"
      >
        {/* Pulsing center glow — sits behind the Growth card */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.07, 0.16, 0.07] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[130px]"
        />
        {/* Top gradient rule */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#119c9e]/35 to-transparent" />
        {/* Corner dot grid — bottom right */}
        <div className="pointer-events-none absolute bottom-[4%] right-[3%] -z-10 h-40 w-40 bg-[radial-gradient(circle,rgba(17,156,158,0.16)_1px,transparent_1px)] bg-[size:16px_16px]" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-10">
          <div className="text-center">
            <p className="section-kicker">Pricing</p>
            <h2 className="mt-3 text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-base text-sky-100/60">
              Choose the plan that fits your call volume. All plans include core features.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Starter Plan */}
            <div className="rounded-2xl border border-white/[0.07] bg-[#0b1726] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Starter</h3>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-white">$149</span>
                <span className="ml-2 text-sm text-sky-100/50">/month</span>
              </div>
              <p className="mt-4 text-sm text-sky-100/60">
                Perfect for individual agents getting started with AI call handling.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-sm text-sky-100/80">
                  <Check className="mr-3 h-4 w-4 text-[#119c9e]" />
                  240 coverage mins included
                </li>
                <li className="flex items-center text-sm text-sky-100/80">
                  <Check className="mr-3 h-4 w-4 text-[#119c9e]" />
                  240 SMS included
                </li>
                <li className="flex items-center text-sm text-sky-100/80">
                  <Check className="mr-3 h-4 w-4 text-[#119c9e]" />
                  realestate.com.au integration
                </li>
                <li className="flex items-center text-sm text-sky-100/80">
                  <Check className="mr-3 h-4 w-4 text-[#119c9e]" />
                  24/7 call answering
                </li>
              </ul>
              <Button
                className="mt-8 h-11 w-full rounded-xl bg-[#119c9e] px-6 text-sm font-semibold text-white hover:bg-[#0e8082]"
                onClick={() => setBookingOpen(true)}
              >
                Get Started
              </Button>
            </div>

            {/* Growth Plan — Most Popular */}
            <div className="relative rounded-2xl border-2 border-[#119c9e] bg-[#0b1726] p-6 shadow-[0_0_40px_-10px_rgba(17,156,158,0.25)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-[#119c9e] px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Growth</h3>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-white">$249</span>
                <span className="ml-2 text-sm text-sky-100/50">/month</span>
              </div>
              <p className="mt-4 text-sm text-sky-100/60">
                For active agents who need more capacity and premium features.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-sm text-sky-100/80">
                  <Check className="mr-3 h-4 w-4 text-[#119c9e]" />
                  360 coverage mins included
                </li>
                <li className="flex items-center text-sm text-sky-100/80">
                  <Check className="mr-3 h-4 w-4 text-[#119c9e]" />
                  360 SMS included
                </li>
                <li className="flex items-center text-sm text-sky-100/80">
                  <Check className="mr-3 h-4 w-4 text-[#119c9e]" />
                  Custom CRM integration
                </li>
                <li className="flex items-center text-sm text-sky-100/80">
                  <Check className="mr-3 h-4 w-4 text-[#119c9e]" />
                  Priority support
                </li>
              </ul>
              <Button
                className="mt-8 h-11 w-full rounded-xl bg-[#119c9e] px-6 text-sm font-semibold text-white hover:bg-[#0e8082]"
                onClick={() => setBookingOpen(true)}
              >
                Get Started
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="rounded-2xl border border-white/[0.07] bg-[#0b1726] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Pro</h3>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-white">$449</span>
                <span className="ml-2 text-sm text-sky-100/50">/month</span>
              </div>
              <p className="mt-4 text-sm text-sky-100/60">
                Tailored solutions for agencies and teams with higher volume needs.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-sm text-sky-100/80">
                  <Check className="mr-3 h-4 w-4 text-[#119c9e]" />
                  600 coverage mins included
                </li>
                <li className="flex items-center text-sm text-sky-100/80">
                  <Check className="mr-3 h-4 w-4 text-[#119c9e]" />
                  600 SMS included
                </li>
                <li className="flex items-center text-sm text-sky-100/80">
                  <Check className="mr-3 h-4 w-4 text-[#119c9e]" />
                  Multi-agent support
                </li>
                <li className="flex items-center text-sm text-sky-100/80">
                  <Check className="mr-3 h-4 w-4 text-[#119c9e]" />
                  Dedicated account manager
                </li>
              </ul>
              <Button
                variant="outline"
                className="mt-8 h-11 w-full rounded-xl border-white/20 px-6 text-sm font-semibold text-white/70 hover:border-[#119c9e] hover:text-[#119c9e]"
                onClick={() => setBookingOpen(true)}
              >
                Contact Sales
              </Button>
            </div>
          </div>

          {/* Commitment note */}
          <div className="mt-10 text-center text-sm text-sky-100/50">
            <p className="font-medium text-sky-100/80">$89 one-time refundable setup fee</p>
            <p className="mt-1">
              All plans require a 3-month minimum term, billed monthly. After the initial term, month-to-month, cancel with 30 days notice.
            </p>
          </div>
        </div>
      </section>

 

      {/* ═══════════════════════════════════════════
          FAQ — accordion, single column, light
      ═══════════════════════════════════════════ */}
      <section
        id="faq"
        className="relative overflow-hidden border-t border-white/[0.07] bg-[#040d17] py-16 sm:py-20 lg:py-28"
      >
        {/* Left drifting orb */}
        <motion.div
          animate={{ y: [-14, 14, -14] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[-12%] top-[15%] -z-10 h-[30rem] w-[30rem] rounded-full bg-teal-500/7 blur-[100px]"
        />
        {/* Top gradient rule */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#119c9e]/25 to-transparent" />
        {/* Right dot grid */}
        <div className="pointer-events-none absolute right-[5%] top-[12%] -z-10 h-44 w-44 bg-[radial-gradient(circle,rgba(17,156,158,0.14)_1px,transparent_1px)] bg-[size:20px_20px]" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="section-kicker">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl">
                Common questions
              </h2>
              <p className="mt-4 text-sm leading-6 text-sky-100/60">
                Can't find your answer? Book a call and we'll walk you through
                everything.
              </p>
              <Button
                variant="outline"
                className="mt-6 h-10 w-full sm:w-auto rounded-xl border-white/20 text-sm font-semibold text-sky-100/60 hover:border-white/30 hover:bg-white/5"
                onClick={() => setBookingOpen(true)}
              >
                Book a call
              </Button>
            </div>

            <Accordion
              type="single"
              collapsible
              className="divide-y divide-white/[0.07]"
            >
              {seoFaqs.map(({ question, answer }) => (
                <AccordionItem
                  key={question}
                  value={question}
                  className="border-0 py-1"
                >
                  <AccordionTrigger className="py-4 text-left text-base font-semibold text-white hover:no-underline">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-6 text-sky-100/60">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BOTTOM CTA BAND
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#071220] py-16 sm:py-20 lg:py-24">
        {/* Animated left orb */}
        <motion.div
          animate={{ x: [-25, 25, -25], y: [-15, 15, -15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[10%] top-[5%] -z-10 h-[32rem] w-[32rem] rounded-full bg-teal-500/12 blur-[100px]"
        />
        {/* Animated right orb */}
        <motion.div
          animate={{ x: [18, -18, 18], y: [12, -12, 12] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="pointer-events-none absolute right-[8%] bottom-[0%] -z-10 h-[26rem] w-[26rem] rounded-full bg-cyan-400/10 blur-[90px]"
        />
        {/* Horizontal teal line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#119c9e]/40 to-transparent" />
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-slate-400">
            Ready when you are
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Stop wasting time on slow follow-up.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-sky-100/70">
            Book a 20-minute call and we'll map exactly how Voxa fits into your
            current lead workflow.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <Button
              className="h-12 w-full sm:w-auto rounded-xl bg-[#119c9e] px-8 text-sm font-semibold text-white shadow-[0_18px_40px_-18px_rgba(17,156,158,0.55)] transition-transform hover:-translate-y-0.5 hover:bg-[#0e8082]"
              onClick={() => setBookingOpen(true)}
            >
              Book a strategy call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BOOKING DIALOG
      ═══════════════════════════════════════════ */}
      <Dialog open={bookingOpen} onOpenChange={handleBookingOpenChange}>
        <DialogContent className="w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#071220] p-0 max-w-lg">
          {formSubmitted ? (
            /* ── Success state ── */
            <div className="relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden px-8 py-12 text-center sm:px-12">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(20,184,166,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,184,166,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />
              <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[80px]" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#119c9e]/30 bg-[#119c9e]/10 text-[#119c9e]">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <DialogTitle className="relative mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Request received!
              </DialogTitle>
              <DialogDescription className="relative mt-3 max-w-xs text-sm leading-6 text-sky-100/50">
                We'll reach out shortly with available times to book your strategy call.
              </DialogDescription>
              <Button
                className="relative mt-8 h-11 rounded-xl bg-[#119c9e] px-7 text-sm font-semibold text-white hover:bg-[#0e8082]"
                onClick={() => setBookingOpen(false)}
              >
                Done
              </Button>
            </div>
          ) : (
            <>
              {/* ── Decorative header ── */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#0c1f33] via-[#0a1a2b] to-[#071220] px-7 pb-6 pt-7">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(20,184,166,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,184,166,0.06)_1px,transparent_1px)] bg-[size:28px_28px]" />
                <div className="pointer-events-none absolute right-[-15%] top-[-30%] h-52 w-52 rounded-full bg-teal-400/10 blur-[70px]" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#119c9e]/30 to-transparent" />
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#119c9e]/30 bg-[#119c9e]/10 text-[#119c9e]">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <DialogTitle className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Book a strategy call
                  </DialogTitle>
                  <DialogDescription className="mt-1.5 text-sm leading-6 text-sky-100/50">
                    Leave your details and our team will reach out to schedule a time.
                  </DialogDescription>
                </div>
              </div>

              {/* ── Form ── */}
              <div className="px-7 pb-7 pt-6">
                <form onSubmit={handleFormSubmit} className="grid gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="booking-name"
                      className="text-[11px] font-bold uppercase tracking-widest text-sky-100/60"
                    >
                      Name <span className="text-rose-400">*</span>
                    </Label>
                    <Input
                      id="booking-name"
                      type="text"
                      placeholder="Your full name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                      maxLength={100}
                      disabled={formLoading}
                      className="h-11 rounded-xl border-white/[0.08] bg-white/[0.04] px-4 text-white placeholder:text-white/25 focus-visible:border-[#119c9e]/50 focus-visible:ring-1 focus-visible:ring-[#119c9e]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="booking-phone"
                      className="text-[11px] font-bold uppercase tracking-widest text-sky-100/60"
                    >
                      Phone <span className="text-rose-400">*</span>
                    </Label>
                    <div className="flex h-11 items-center rounded-xl border border-white/[0.08] bg-white/[0.04] focus-within:border-[#119c9e]/50 focus-within:ring-1 focus-within:ring-[#119c9e]/50">
                      <span className="border-r border-white/[0.08] px-3.5 text-sm font-semibold text-white/70">
                        +61
                      </span>
                      <Input
                        id="booking-phone"
                        type="tel"
                        inputMode="numeric"
                        placeholder="4xx xxx xxx"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        required
                        maxLength={12}
                        disabled={formLoading}
                        className="h-full border-0 bg-transparent pl-3.5 text-white placeholder:text-white/25 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="booking-email"
                      className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-sky-100/60"
                    >
                      Agency / Suburb
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-medium tracking-widest text-sky-100/35">
                        optional
                      </span>
                    </Label>
                    <Input
                      id="booking-email"
                      type="text"
                      placeholder="e.g. Ray White · Brighton"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      maxLength={255}
                      disabled={formLoading}
                      className="h-11 rounded-xl border-white/[0.08] bg-white/[0.04] px-4 text-white placeholder:text-white/25 focus-visible:border-[#119c9e]/50 focus-visible:ring-1 focus-visible:ring-[#119c9e]/50"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={formLoading || !formName || !formPhone}
                    className="mt-1 h-11 rounded-xl bg-[#119c9e] text-sm font-semibold text-white hover:bg-[#0e8082] disabled:opacity-40"
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Send booking request"
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#119c9e]/60" />
                    <p className="text-[11px] font-medium tracking-wider text-sky-100/35">
                      A real person will call you back shortly
                    </p>
                    <div className="h-1.5 w-1.5 rounded-full bg-[#119c9e]/60" />
                  </div>
                </form>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.07] bg-[#071220] px-6 py-5 lg:px-10">
        <div className="w-full text-center items-center justify-between gap-3 text-center md:text-left text-xs text-sky-100/40 sm:text-sm">
          <p className="text-center">© 2026 Voxa Realty · Helping real estate agents never miss a lead</p>
          
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
