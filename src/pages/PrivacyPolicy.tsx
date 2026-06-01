import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import voxaLogoDark from '@/assets/voxa-logo-dark.png';

const PrivacyPolicy = () => {
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
          <h1 className="text-3xl font-bold mb-6">WEBSITE PRIVACY POLICY</h1>
          
          <p className={`mx-auto max-w-2xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            This Privacy Policy applies to all personal information collected by Voxa Realty (<strong>we</strong>, <strong>us</strong> or <strong>our</strong>) via the website located at www.voxarealty.com (<strong>Website</strong>).
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. What information do we collect?</h2>
            <p className={`mx-auto max-w-2xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              The kind of Personal Information that we collect from you will depend on how you use the website. The Personal Information which we collect and hold about you may include: Third Party Software API Key (Upon Request), Name, Phone Number, Email Address, Office Address.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. Types of information</h2>
            <p className={`mx-auto max-w-2xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              The Privacy Act 1998 (Cth) (Privacy Act) defines types of information, including Personal Information and Sensitive Information.
            </p>
            <p className={`mx-auto max-w-2xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <strong>Personal Information</strong> means information or an opinion about an identified individual or an individual who is reasonably identifiable:
              <br/>(a) whether the information or opinion is true or not; and
              <br/>(b) whether the information or opinion is recorded in a material form or not.
            </p>
            <p className={`mx-auto max-w-2xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              If the information does not disclose your identity or enable your identity to be ascertained, it will in most cases not be classified as "Personal Information" and will not be subject to this privacy policy.
            </p>
            <p className={`mx-auto max-w-2xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <strong>Sensitive Information</strong> is defined in the Privacy Act as including information or opinion about such things as an individual's racial or ethnic origin, political opinions, membership of a political association, religious or philosophical beliefs, membership of a trade union or other professional body, criminal record or health information.
            </p>
            <p className={`mx-auto max-w-2xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Sensitive Information will be used by us only:
              <br/>(a) for the primary purpose for which it was obtained;
              <br/>(b) for a secondary purpose that is directly related to the primary purpose; and
              <br/>(c) with your consent or where required or authorised by law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. How we collect your Personal Information</h2>
            <p className={`mx-auto max-w-2xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              (a) We may collect Personal Information from you whenever you input such information into the Website, related app or provide it to Us in any other way.
              <br/>(b) We may also collect cookies from your computer which enable us to tell when you use the Website and also to help customise your Website experience. As a general rule, however, it is not possible to identify you personally from our use of cookies.
              <br/>(c) Before deploying non-essential cookies, we will seek your prior consent through a cookie consent mechanism that allows you to manage your preferences for different cookie categories, and you may withdraw or modify your consent at any time through our cookie settings.
              <br/>(d) We display a cookie consent banner before deploying non-essential cookies, allowing you to accept all cookies, reject non-essential cookies, or customise preferences by category (analytics, marketing, functional, essential), with essential cookies deployed without consent as required for Website functionality.
              <br/>(e) We generally don’t collect Sensitive Information, but if we do, it would come from consent of the Client. This would come from the use of the Third Party Software CRM API Key, if we do have consent, it is not stored in our Database.
              <br/>(f) Where reasonable and practicable we collect your Personal Information from you only. However, sometimes we may be given information from a third party, in cases like this we will take steps to make you aware of the information that was provided by a third party.
              <br/>(g) Where we collect Third Party Software CRM API Keys with your explicit prior written consent, we process such keys in memory only without permanent database storage, encrypt them during transmission using TLS 1.2 or higher, restrict access to authorized personnel, delete them immediately after processing, maintain audit logs of all access activities, and use them solely for your authorized service purpose, with revocation available at any time via info@voxarealty.com.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Purpose of collection</h2>
            <p className={`mx-auto max-w-2xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              (a) We collect Personal Information to provide you with the best service experience possible on the Website and keep in touch with you about developments in our business.
              <br/>(b) We customarily only disclose Personal Information to our service providers who assist us in operating the Website. This includes Name, Email, and Phone Number. In terms of "Personal Information" this <strong>does not</strong> include data from the clients CRM Database and Call Logs.
              <br/>(c) We disclose Personal Information only to only our third party service providers: (a) website hosting providers located in Australia and the United States; (b) email communication service providers; (c) customer relationship management system administrators; and (d) payment processing providers. All service providers are contractually bound to maintain confidentiality and implement security measures equivalent to our own standards. This Personal Information includes only your Phone Number and Email. Where Personal Information is transferred internationally, we ensure adequate safeguards are in place in accordance with the Privacy Act 1988 (Cth) and Australian Privacy Principles.
              <br/>(d) All service providers must implement security measures including: (a) encryption of data in transit using TLS 1.2 or higher and at rest using AES-256 or equivalent; (b) multi-factor authentication for administrative access; (c) annual security audits and penetration testing; (d) incident response procedures with notification within [HOURS] hours of discovery; (e) employee training on data protection and confidentiality; (f) compliance with ISO 27001 or equivalent information security standards; and (g) data processing agreements compliant with Privacy Act 1988 (Cth). For US-based service providers, we ensure data transfers comply with Australian Privacy Principle 1.2 through Standard Contractual Clauses or adequacy determinations, and we maintain copies of all service provider security certifications and audit reports available upon request.
              <br/>(e) By using our Website, you consent to the receipt of direct marketing material. We will only use your Personal Information for this purpose if we have collected such information direct from you, and if it is material of a type which you would reasonably expect to receive from use. We do not use sensitive Personal Information in direct marketing activity. Our direct marketing material will include a simple means by which you can request not to receive further communications of this nature, such as an unsubscribe button link.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Security, Access and correction</h2>
            <p className={`mx-auto max-w-2xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              5.1. We store your Personal Information in a way that reasonably protects it from unauthorised access, misuse, modification or disclosure. When we no longer require your Personal Information for the purpose for which we obtained in, we will take reasonable steps to destroy and anonymise or de-identify it. Most of the Personal Information that is stored in our client files and records will be kept for a maximum of one year to fulfil our record keeping obligations.
              <br/>5.2. The Australian Privacy Principles: (i) permit you to obtain access to the Personal Information we hold about you in certain circumstances (Australian Privacy Principle 12); and (ii) allow you to correct inaccurate Personal Information subject to certain exceptions (Australian Privacy Principle 13).
              <br/>5.3. Where you would like to obtain such access, please contact us in writing on the contact details set out at the bottom of this privacy policy.
              <br/>5.4. If you wish to request deletion of your Personal Information, correction of inaccurate information, or receive your data in a portable format, please submit a written request to the contact details below. We will respond to access requests within seven days and process deletion or correction requests within seven days, unless legal or regulatory obligations require us to retain certain information.
              <br/>5.5. We maintain documented records of Personal Information destruction and de-identification activities, including the date of destruction, method used, and categories of information destroyed, to ensure accountability and facilitate compliance audits as required under the Privacy Act 1988 (Cth).
              <br/>5.6. We maintain specific retention periods for different categories of Personal Information: contact information (name, email, phone) is retained for twelve months from last interaction; transaction records are retained for sven years to comply with taxation and legal obligations; website analytics data is retained for thirteen months; and CRM data is retained as per client agreement or twelve months from last interaction, whichever is longer.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">6. Complaint procedure</h2>
            <p className={`mx-auto max-w-2xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              If you have a complaint concerning the manner in which we maintain the privacy of your Personal Information, please contact us as on the contact details set out at the bottom of this policy. All complaints will be considered by Voxa Realty and we may seek further information from you to clarify your concerns. If we agree that your complaint is well founded, we will, in consultation with you, take appropriate steps to rectify the problem. If you remain dissatisfied with the outcome, you may refer the matter to the Office of the Australian Information Commissioner.
              <br/>Data Breach Notification: If we discover a data breach affecting your Personal Information, we will: (1) investigate the breach within hours; (2) notify you within days unless law enforcement advises otherwise; (3) provide details of affected data, breach date, and remedial actions taken; (4) offer credit monitoring or identity protection services where appropriate; and (5) report to the Office of the Australian Information Commissioner if required under the Privacy Act 1988 (Cth). Notification will be sent via email to the address on file or by phone if email is unavailable.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">7. Overseas transfer</h2>
            <p className={`mx-auto max-w-2xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Your Personal Information will not be disclosed to recipients outside Australia unless you expressly request us to do so. If you request us to transfer your Personal Information to an overseas recipient, the overseas recipient will not be required to comply with the Australian Privacy Principles and we will not be liable for any mishandling of your information in such circumstances.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">8. GDPR</h2>
            <p className={`mx-auto max-w-2xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              In some circumstances, the European Union General Data Protection Regulation (GDPR) provides additional protection to individuals located in Europe. The fact that you may be located in Europe does not, however, on its own entitle you to protection under the GDPR. Our website does not specifically target customers located in the European Union and we do not monitor the behaviour of individuals in the European Union, and accordingly the GDPR does not apply.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">9. Proof of Business Identity</h2>
            <p className={`mx-auto max-w-2xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              We may require you to provide proof of your business identity before granting access to certain services or information through the Website. This may include, but is not limited to, providing a valid Australian Business Number (ABN), Australian Company Number (ACN), or other relevant business registration documentation.
              <br/>We collect and handle such information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles. This information will be used solely for the purpose of verifying your business identity and will not be disclosed to third parties except where required by law or with your express consent.
            </p>
          </section>

          <section className="space-y-4 pb-8">
            <h2 className="text-xl font-semibold">10. How to contact us about privacy</h2>
            <p className={`mx-auto max-w-2xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              If you have any queries, or if you seek access to your Personal Information, or if you have a complaint about our privacy practices, you can contact us through: <strong>info@voxarealty.com</strong>.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
