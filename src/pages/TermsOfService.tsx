import React from 'react';
import { Link } from 'react-router-dom';
import voxaLogoDark from '@/assets/voxa-logo-dark.png';

const sections: { num: string; title: string; body: React.ReactNode }[] = [
  {
    num: "01",
    title: "About Voxa Realty",
    body: (
      <>
        Voxa Realty (<strong className="text-white/90">we</strong>, <strong className="text-white/90">us</strong> or <strong className="text-white/90">our</strong>) is an Australian business based in Melbourne, Victoria, that provides AI-powered voice assistants and communication automation tools designed for real estate professionals (<strong className="text-white/90">Services</strong>).
        <br /><br />
        These Terms of Service (<strong className="text-white/90">Terms</strong>) govern your access to and use of the Voxa Realty platform, website, AI voice agents, virtual phone numbers, integrations, and related services. By creating an account or using any part of the Services, you agree to be bound by these Terms and our Privacy Policy.
        <br /><br />
        If you do not agree to these Terms, do not use the Services.
      </>
    ),
  },
  {
    num: "02",
    title: "Eligibility",
    body: (
      <>
        To use the Services you must:
        <br /><br />
        — be at least 18 years of age;<br />
        — have the legal capacity to enter into binding contracts under the laws of your jurisdiction;<br />
        — be a real estate professional, agency, or business entity authorised to use AI-assisted communication tools in your jurisdiction; and<br />
        — ensure that any person acting on behalf of a business entity has authority to bind that entity to these Terms.
        <br /><br />
        By using the Services on behalf of a company, agency, or other legal entity, you represent that you have the authority to bind that entity to these Terms.
      </>
    ),
  },
  {
    num: "03",
    title: "Account registration",
    body: (
      <>
        To access the platform you must register for an account. You agree to:
        <br /><br />
        — provide accurate, current, and complete information during registration;<br />
        — keep your account information up to date;<br />
        — maintain the security of your login credentials and not share them with third parties;<br />
        — notify us immediately at info@voxarealty.com if you suspect unauthorised access to your account; and<br />
        — accept responsibility for all activity that occurs under your account, whether or not authorised by you.
        <br /><br />
        We reserve the right to refuse registration or cancel accounts at our discretion.
      </>
    ),
  },
  {
    num: "04",
    title: "Subscription plans and billing",
    body: (
      <>
        The Services are offered on a subscription basis. By subscribing you agree to the following:
        <br /><br />
        <strong className="text-white/90">Minimum term:</strong> All plans require a 3-month minimum commitment, billed monthly. You may not cancel within the first 3 months of a subscription.
        <br /><br />
        <strong className="text-white/90">After the minimum term:</strong> Subscriptions continue on a month-to-month basis and may be cancelled with 30 days written notice to info@voxarealty.com.
        <br /><br />
        <strong className="text-white/90">Setup fee:</strong> A one-time setup fee of $89 AUD is charged at onboarding. This fee is refundable within 14 days of payment if the Services have not been activated.
        <br /><br />
        <strong className="text-white/90">Billing:</strong> Monthly subscription fees are charged in advance via Stripe. You authorise us to charge your nominated payment method on the same date each month.
        <br /><br />
        <strong className="text-white/90">Call minute balance:</strong> Each subscription tier includes a monthly call-minute allocation. Unused minutes do not roll over. Usage in excess of your plan's allocation may result in suspension of the AI assistant until the next billing cycle or an upgrade prompt.
        <br /><br />
        <strong className="text-white/90">Price changes:</strong> We may change subscription prices by giving at least 30 days notice. Continued use after the effective date constitutes acceptance of the new price.
        <br /><br />
        <strong className="text-white/90">Non-refundable:</strong> Except for the setup fee refund window above, subscription fees are non-refundable unless required by applicable Australian consumer law.
      </>
    ),
  },
  {
    num: "05",
    title: "Virtual phone numbers",
    body: (
      <>
        As part of onboarding, we provision a virtual phone number via Twilio on your behalf. You acknowledge and agree that:
        <br /><br />
        — the virtual number remains the property of Voxa Realty for the duration of your subscription;<br />
        — upon cancellation or termination, the number may be released back to Twilio's pool or reassigned to another subscriber;<br />
        — you should not use the Voxa virtual number as your sole or permanent business contact number; and<br />
        — we are not liable for any loss of business or leads resulting from the release or reassignment of a number following termination.
        <br /><br />
        The $89 setup fee covers, in part, the cost of provisioning your virtual number and configuring the AI assistant.
      </>
    ),
  },
  {
    num: "06",
    title: "AI-generated communications",
    body: (
      <>
        The Voxa platform uses large language model technology provided by Vapi to generate voice responses on your behalf. You acknowledge that:
        <br /><br />
        <strong className="text-white/90">Accuracy:</strong> AI-generated responses may contain errors, omissions, or inaccuracies. You remain solely responsible for reviewing call transcripts and following up with callers where necessary.
        <br /><br />
        <strong className="text-white/90">Representation:</strong> The AI assistant speaks on your behalf using your configured prompt and first message. You are responsible for ensuring your configuration is accurate, lawful, and not misleading. Voxa Realty is not liable for misrepresentations made by an AI assistant operating under your configuration.
        <br /><br />
        <strong className="text-white/90">No advice:</strong> The AI assistant does not provide legal, financial, or professional real estate advice. Any information it conveys to callers is based solely on the knowledge base and prompt you configure.
        <br /><br />
        <strong className="text-white/90">Consumer law:</strong> You must not configure your AI assistant in a way that would breach the Australian Consumer Law (Schedule 2 of the Competition and Consumer Act 2010 (Cth)), including by making false or misleading representations about properties or services.
      </>
    ),
  },
  {
    num: "07",
    title: "Call recording and consent obligations",
    body: (
      <>
        All calls handled by the Voxa AI assistant are recorded and transcribed. As the subscribing agent, you are responsible for compliance with all applicable laws regarding call recording, including:
        <br /><br />
        — the <em>Telecommunications (Interception and Access) Act 1979</em> (Cth);<br />
        — applicable state and territory surveillance and listening device legislation; and<br />
        — the Australian Privacy Principles under the <em>Privacy Act 1988</em> (Cth).
        <br /><br />
        <strong className="text-white/90">Disclosure requirement:</strong> You must configure your AI assistant's first message to inform callers that the call is being recorded. Voxa Realty provides the technical means to include this disclosure but is not responsible for your failure to do so.
        <br /><br />
        <strong className="text-white/90">Liability:</strong> You agree to indemnify and hold harmless Voxa Realty from any claims, penalties, or liability arising from your failure to obtain required consent for call recording.
        <br /><br />
        Call recordings are stored on Vapi's servers in the United States. Transcripts are stored in our database. Both are accessible to you through the Platform dashboard and are subject to our Privacy Policy.
      </>
    ),
  },
  {
    num: "08",
    title: "Customer data",
    body: (
      <>
        <strong className="text-white/90">Ownership:</strong> You retain all ownership rights to data you upload, configure, or generate through the Platform, including assistant prompts, knowledge base content, contact records, and call data (<strong className="text-white/90">Customer Data</strong>).
        <br /><br />
        <strong className="text-white/90">Licence to us:</strong> You grant Voxa Realty a limited, non-exclusive licence to process, store, and transmit Customer Data solely to provide the Services to you. We do not use your Customer Data for our own marketing or sell it to third parties.
        <br /><br />
        <strong className="text-white/90">Caller data:</strong> You acknowledge that call transcripts, recordings, and structured outputs contain personal information belonging to third-party callers. You agree to handle this data in accordance with the Privacy Act 1988 (Cth) and any other applicable privacy laws, and to provide callers with a means to request deletion of their data.
        <br /><br />
        <strong className="text-white/90">Data on termination:</strong> Upon cancellation, your data will be retained for up to 12 months and then deleted, unless you request earlier deletion by contacting info@voxarealty.com. We do not guarantee data export functionality; you should export any data you need before cancelling.
      </>
    ),
  },
  {
    num: "09",
    title: "Third-party integrations",
    body: (
      <>
        The Platform integrates with the following third-party services to deliver core functionality:
        <br /><br />
        <strong className="text-white/90">Vapi</strong> — AI voice engine and call transcription (United States).<br />
        <strong className="text-white/90">Twilio</strong> — Virtual phone number provisioning and call routing (United States).<br />
        <strong className="text-white/90">Stripe</strong> — Payment processing (United States).<br />
        <strong className="text-white/90">MongoDB Atlas</strong> — Cloud database (Australia / United States).<br />
        <strong className="text-white/90">Google</strong> — Optional Calendar and Sheets integration.
        <br /><br />
        We are not responsible for outages, API changes, policy changes, or security incidents affecting third-party services. Disruption to a third-party service does not entitle you to a refund or service credit unless the disruption renders the core call-answering functionality of the Platform inoperable for more than 72 consecutive hours.
        <br /><br />
        By using optional integrations (e.g. Google), you agree to the relevant third party's own terms of service and privacy policy.
      </>
    ),
  },
  {
    num: "10",
    title: "Acceptable use",
    body: (
      <>
        You agree not to use the Services to:
        <br /><br />
        — violate any applicable law, regulation, or code of conduct;<br />
        — make false or misleading statements to callers about properties, services, prices, or your identity;<br />
        — harass, threaten, or abuse any person;<br />
        — send unsolicited commercial communications (spam) in contravention of the <em>Spam Act 2003</em> (Cth);<br />
        — impersonate another person or entity;<br />
        — attempt to gain unauthorised access to any part of the Platform or its underlying infrastructure;<br />
        — reverse engineer, decompile, or extract the source code of any part of the Platform;<br />
        — resell, sublicense, or white-label the Services without our prior written consent; or<br />
        — use the Platform in any way that could damage, disable, or impair the Services or interfere with other users.
        <br /><br />
        We reserve the right to suspend or terminate your account immediately and without notice if we reasonably believe you have breached this section.
      </>
    ),
  },
  {
    num: "11",
    title: "Intellectual property",
    body: (
      <>
        All intellectual property rights in the Platform, including the software, AI models, voice technology, design, branding, trade marks, and documentation, are owned by or licensed to Voxa Realty. Nothing in these Terms transfers any intellectual property rights to you.
        <br /><br />
        You are granted a limited, non-exclusive, non-transferable licence to access and use the Platform solely for the purposes described in these Terms and for the duration of your active subscription.
        <br /><br />
        You retain ownership of content you create and upload, such as your assistant prompt, knowledge base documents, and business information. By uploading such content you represent that you have the rights to do so and that it does not infringe any third-party intellectual property rights.
      </>
    ),
  },
  {
    num: "12",
    title: "Confidentiality",
    body: (
      <>
        <strong className="text-white/90">Our obligations:</strong> We will keep your account credentials, assistant configuration, business information, and Customer Data confidential and will not disclose them to third parties except as required to provide the Services, as described in our Privacy Policy, or as required by law.
        <br /><br />
        <strong className="text-white/90">Your obligations:</strong> You agree to keep confidential any non-public information about the Platform, pricing structures, technical documentation, or business operations that we share with you, and to use such information only for the purpose of using the Services.
        <br /><br />
        Confidentiality obligations do not apply to information that: (a) is or becomes publicly known through no fault of the receiving party; (b) was already known to the receiving party at the time of disclosure; or (c) is required to be disclosed by law or court order.
      </>
    ),
  },
  {
    num: "13",
    title: "Service availability",
    body: (
      <>
        We aim to provide a reliable service but do not guarantee uninterrupted or error-free availability. Scheduled maintenance will be notified where practicable. Emergency maintenance may occur without notice.
        <br /><br />
        The Platform depends on third-party infrastructure including Vapi, Twilio, and MongoDB Atlas. We are not responsible for downtime caused by these providers.
        <br /><br />
        We do not provide a formal Service Level Agreement (SLA) unless separately agreed in writing. If you require guaranteed uptime commitments, please contact us at info@voxarealty.com to discuss enterprise arrangements.
      </>
    ),
  },
  {
    num: "14",
    title: "Disclaimer of warranties",
    body: (
      <>
        To the maximum extent permitted by law, the Services are provided on an <strong className="text-white/90">"as is"</strong> and <strong className="text-white/90">"as available"</strong> basis without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement.
        <br /><br />
        We do not warrant that: (a) the Services will meet your specific business requirements; (b) the AI assistant will respond accurately in all circumstances; (c) the Services will be available at all times; or (d) any errors will be corrected within a particular timeframe.
        <br /><br />
        Nothing in these Terms excludes, restricts, or modifies any right or remedy, or any guarantee, warranty, or other term or condition, implied or imposed by any legislation that cannot lawfully be excluded or limited, including the Australian Consumer Law.
      </>
    ),
  },
  {
    num: "15",
    title: "Limitation of liability",
    body: (
      <>
        To the maximum extent permitted by applicable law, Voxa Realty's aggregate liability to you for any claims arising out of or related to these Terms or the Services is limited to the total fees you paid to us in the <strong className="text-white/90">twelve months immediately preceding the event giving rise to the claim</strong>.
        <br /><br />
        We are not liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, loss of data, loss of business opportunity, or loss of goodwill, even if we have been advised of the possibility of such damages.
        <br /><br />
        We are not liable for: (a) missed or lost leads due to AI assistant errors or service downtime; (b) non-compliance by you with call recording consent requirements; (c) actions or omissions of third-party sub-processors (Vapi, Twilio, Stripe); or (d) loss arising from your failure to review and act on call transcripts.
        <br /><br />
        Nothing in these Terms limits liability for fraud, death or personal injury caused by negligence, or any other liability that cannot be excluded by law.
      </>
    ),
  },
  {
    num: "16",
    title: "Indemnity",
    body: (
      <>
        You agree to indemnify, defend, and hold harmless Voxa Realty, its directors, employees, and contractors from and against any claims, damages, losses, costs, and expenses (including reasonable legal fees) arising from or related to:
        <br /><br />
        — your use of the Services in breach of these Terms;<br />
        — your failure to obtain required consent for call recording;<br />
        — false or misleading content in your AI assistant's configuration;<br />
        — your violation of any applicable law or third-party rights; or<br />
        — any claim by a caller or third party arising from your use of the Platform.
      </>
    ),
  },
  {
    num: "17",
    title: "Suspension and termination",
    body: (
      <>
        <strong className="text-white/90">By you:</strong> You may cancel your subscription after the 3-month minimum term by providing 30 days written notice to info@voxarealty.com. Your subscription will remain active until the end of the current billing period following the notice period.
        <br /><br />
        <strong className="text-white/90">By us:</strong> We may suspend or terminate your account immediately and without notice if: (a) you breach these Terms and fail to remedy the breach within 7 days of notice; (b) you fail to pay any fees when due; (c) we reasonably believe your use poses a legal, security, or reputational risk; or (d) we are required to do so by law.
        <br /><br />
        <strong className="text-white/90">Effect of termination:</strong> On termination, your right to use the Services ceases immediately. Your virtual phone number will be released. Your data will be retained for up to 12 months and then deleted per our Privacy Policy, unless you request earlier deletion. Fees paid are non-refundable except as required by law.
      </>
    ),
  },
  {
    num: "18",
    title: "Changes to the Services",
    body: "We may update, modify, or discontinue features of the Services at any time. Where a change materially reduces the core functionality of a plan you have paid for, we will provide at least 14 days notice by email. If you do not accept a material change, you may cancel your subscription and receive a pro-rata refund for the unused portion of the current billing period. Continued use after the effective date of a change constitutes acceptance.",
  },
  {
    num: "19",
    title: "Changes to these Terms",
    body: (
      <>
        We may update these Terms from time to time. When we make material changes, we will notify you by email and by posting the updated Terms on the website. The updated Terms will take effect 14 days after the notification email is sent.
        <br /><br />
        If you do not agree to the updated Terms, you must stop using the Services before the effective date. Continued use after the effective date constitutes acceptance of the revised Terms.
        <br /><br />
        The current version of these Terms will always be available at www.voxarealty.com/terms-of-service.
      </>
    ),
  },
  {
    num: "20",
    title: "Governing law and disputes",
    body: (
      <>
        These Terms are governed by the laws of Victoria, Australia, and the parties submit to the non-exclusive jurisdiction of the courts of Victoria.
        <br /><br />
        Before commencing legal proceedings, you agree to contact us at info@voxarealty.com to attempt to resolve any dispute in good faith within 30 days. If the dispute cannot be resolved, either party may refer it to mediation through the Resolution Institute (Australia) before pursuing litigation.
        <br /><br />
        Nothing in this clause prevents either party from seeking urgent injunctive or other equitable relief from a court of competent jurisdiction.
      </>
    ),
  },
  {
    num: "21",
    title: "General",
    body: (
      <>
        <strong className="text-white/90">Entire agreement:</strong> These Terms, together with our Privacy Policy and any order form or subscription confirmation, constitute the entire agreement between you and Voxa Realty with respect to the Services.
        <br /><br />
        <strong className="text-white/90">Severability:</strong> If any provision of these Terms is found to be unenforceable, that provision will be modified to the minimum extent necessary to make it enforceable, and the remaining provisions will continue in full force.
        <br /><br />
        <strong className="text-white/90">Waiver:</strong> Failure to enforce any provision of these Terms does not constitute a waiver of our right to enforce it in the future.
        <br /><br />
        <strong className="text-white/90">Assignment:</strong> You may not assign your rights or obligations under these Terms without our prior written consent. We may assign our rights and obligations to a successor entity in connection with a merger, acquisition, or sale of assets.
        <br /><br />
        <strong className="text-white/90">Effective date:</strong> These Terms were last updated in June 2025.
      </>
    ),
  },
  {
    num: "22",
    title: "Contact",
    body: (
      <>
        For all enquiries relating to these Terms:
        <br /><br />
        <strong className="text-white/90">Voxa Realty</strong><br />
        Email: info@voxarealty.com<br />
        Based in Melbourne, Victoria, Australia<br />
        Website: www.voxarealty.com
      </>
    ),
  },
];

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#071220] text-white">

      {/* ── Nav ── */}
      <header className="fixed inset-x-0 top-4 z-30 px-4 sm:top-6">
        <div className="mx-auto w-full max-w-5xl rounded-2xl border border-white/10 bg-[#071220]/65 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-[12px]">
          <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={voxaLogoDark} alt="Voxa Realty" className="h-9 w-auto sm:h-10" />
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <Link to="/login" className="text-sm font-semibold text-white/70 transition-colors hover:text-white">Sign In</Link>
              <Link to="/privacy-policy" className="text-sm font-semibold text-white/70 transition-colors hover:text-white">Privacy Policy</Link>
              <Link to="/voice-library" className="text-sm font-semibold text-white/70 transition-colors hover:text-white">Voice Library</Link>
            </nav>
            <Link
              to="/"
              className="inline-flex h-10 items-center rounded-xl bg-[#119c9e] px-4 text-sm font-semibold text-white hover:bg-[#0e8082]"
            >
              Book a call
            </Link>
          </div>
        </div>
      </header>

      {/* ── Page header ── */}
      <div className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[linear-gradient(to_right,rgba(20,184,166,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,184,166,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[28rem] w-[28rem] rounded-full bg-teal-500/10 blur-[100px]" />
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.32em] text-[#119c9e]">Legal</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-sky-100/60">
            These Terms govern your use of the Voxa Realty platform, AI voice assistants, virtual phone numbers, and all related services. Effective 1 June 2025.
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="mx-auto max-w-5xl px-6 pb-24 lg:px-10">
        <div className="divide-y divide-white/[0.06]">
          {sections.map((s) => (
            <div key={s.num} className="grid gap-6 py-10 lg:grid-cols-[220px_1fr] lg:gap-16">
              <div className="flex items-start gap-3">
                <span className="shrink-0 text-xs font-bold tracking-widest text-[#119c9e]/70">{s.num}</span>
                <h2 className="text-base font-semibold leading-snug tracking-tight text-white">{s.title}</h2>
              </div>
              <div className="text-sm leading-7 text-sky-100/60">
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] bg-[#071220] px-6 py-5 lg:px-10">
        <div className="mx-auto flex flex-col md:flex-row max-w-5xl items-center justify-between gap-3 text-center md:text-left text-xs text-white/30 sm:text-sm">
          <p className="font-semibold text-white/50">Voxa Realty</p>
          <p>AI receptionist and sales agent software for real estate teams.</p>
          <Link to="/privacy-policy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
        </div>
      </footer>

    </div>
  );
};

export default TermsOfService;
