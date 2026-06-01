import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import voxaLogoDark from '@/assets/voxa-logo-dark.png';

const TermsOfService = () => {
  const [isDark] = useState(() => {
    const saved = localStorage.getItem("voxaTheme");
    return saved === "dark";
  });

  useEffect(() => {
    if (isDark) {
      localStorage.setItem("voxaTheme", "dark");
    } else {
      localStorage.setItem("voxaTheme", "light");
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen w-full overflow-y-auto ${isDark ? "bg-gray-900 text-white" : "bg-gray-50/50 text-slate-900"}`}>
      <header className="fixed inset-x-0 top-4 z-30 px-4 sm:top-6">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#071220]/65 px-3 py-2 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-[12px] sm:px-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={voxaLogoDark}
              alt="Voxa Realty Logo"
              className="h-9 w-auto sm:h-10"
            />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="/#how-it-works" className="text-sm font-semibold text-white/70 transition-colors hover:text-white">
              How it works
            </a>
            <a href="/#what-voxa-does" className="text-sm font-semibold text-white/70 transition-colors hover:text-white">
              Features
            </a>
            <a href="/#faq" className="text-sm font-semibold text-white/70 transition-colors hover:text-white">
              FAQ
            </a>
          </nav>
          <a
            href="/"
            className="flex items-center h-10 rounded-xl bg-[#119c9e] px-4 text-sm font-semibold text-white hover:bg-[#0e8082]"
          >
            Book a call
          </a>
        </div>
      </header>

      <main className="flex-1 relative mx-auto mt-24 flex max-w-4xl flex-col items-center justify-center p-6 md:p-10">
          <div className={`w-full shadow-md rounded-xl p-4 md:p-8 space-y-6 ${isDark ? "bg-gray-800 border border-gray-700 text-center" : "bg-white border border-gray-200 text-center"}`}>
          <h1 className="text-3xl font-bold mb-2">VOXA REALTY TERMS OF SERVICE</h1>
          <p className={`font-medium mb-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Effective Date: June 1, 2026
          </p>
          
          <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            These Terms of Service ("Terms") govern your access to and use of the Voxa Realty platform, website, software, AI voice agents, integrations, communications tools, and related services (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms.
          </p>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">1. About Voxa Realty</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Voxa Realty provides AI-powered voice assistants and communication automation tools designed for real estate professionals and businesses.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">2. Eligibility</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              You must be at least 18 years old, legally capable of entering binding contracts, and authorised to act on behalf of any business using the Services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">3. Account Registration</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              You are responsible for maintaining accurate account information, protecting login credentials, and all activity under your account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">4. Subscription Services</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Certain Services are offered on a subscription basis. Fees are billed in advance, non-refundable unless required by law, and may automatically renew until cancelled.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">5. AI-Generated Communications</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              AI-generated outputs may contain inaccuracies. Users remain responsible for reviewing and verifying information before relying upon it.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">6. Call Recording and Consent</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Users are responsible for complying with applicable privacy, telecommunications, and consent laws regarding call recording and communications processing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">7. Customer Data</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Customers retain ownership of their data while granting Voxa a licence to process data solely to provide and improve the Services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">8. Data Processing and AI Training</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Voxa may use aggregated and anonymised usage data to improve platform performance and security.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">9. Integrations</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Voxa may integrate with third-party services but is not responsible for outages, API changes, or third-party security incidents.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">10. Acceptable Use</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Users must not violate laws, send spam, impersonate others, distribute malware, or misuse the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">11. Intellectual Property</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              All Voxa software, branding, AI systems, and related intellectual property remain the property of Voxa Realty.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">12. Confidentiality</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Each party agrees to protect confidential information received from the other party.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">13. Service Availability</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Voxa does not guarantee uninterrupted service and may perform maintenance or upgrades from time to time.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">14. Disclaimer</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Services are provided on an "as is" and "as available" basis to the maximum extent permitted by law.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">15. Limitation of Liability</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Voxa's aggregate liability is limited to fees paid by the customer during the twelve months preceding a claim.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">16. Indemnity</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Users agree to indemnify Voxa against claims arising from misuse of the Services or breach of these Terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">17. Suspension and Termination</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Voxa may suspend or terminate accounts for breaches, non-payment, or security concerns.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">18. Changes to Services</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Voxa may modify, discontinue, or update Services at any time.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">19. Changes to Terms</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Updated Terms become effective upon publication on the Voxa Realty website.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">20. Governing Law</h2>
            <p className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              These Terms are governed by the laws of Victoria, Australia.
            </p>
          </section>

          <section className="space-y-2 pb-8">
            <h2 className="text-xl font-semibold">21. Contact Information</h2>
            <div className={`mx-auto max-w-3xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <p><strong>Voxa Realty</strong></p>
              <p>Website: www.voxarealty.com</p>
              <p>Email: legal@voxarealty.com</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
