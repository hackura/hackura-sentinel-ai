'use client';

import { PublicNavbar } from '@/components/public-navbar';
import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-zinc-300">
      <PublicNavbar showHomeButton />
      
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert prose-zinc max-w-none"
        >
          <h1 className="text-4xl font-bold text-white mb-8">Terms & Conditions</h1>
          <p className="text-zinc-400 mb-8">Last Updated: May 12, 2026</p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Hackura Sentinel AI platform, you agree to be bound by these Terms & Conditions. If you do not agree, you may not use our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">2. Use of Services</h2>
            <h3 className="text-xl font-medium text-zinc-200 mb-2">2.1 Eligibility</h3>
            <p>
              You must be at least 18 years old or the age of majority in your jurisdiction to use our services.
            </p>
            <h3 className="text-xl font-medium text-zinc-200 mb-2">2.2 Acceptable Use</h3>
            <p>
              You agree not to use the platform for any illegal activities, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Unauthorized access to other systems (hacking).</li>
              <li>Distribution of malware or phishing content.</li>
              <li>Interfering with the platform's operation or security.</li>
              <li>Using our threat intelligence for malicious purposes.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">3. Accounts and Security</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Intellectual Property</h2>
            <p>
              All content, features, and functionality on the platform are the exclusive property of Hackura Sentinel AI and its licensors. You may not reproduce or distribute any part of our platform without prior written consent.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Limitation of Liability</h2>
            <p>
              Hackura Sentinel AI provides threat intelligence "as is." While we strive for accuracy, we do not guarantee that our analysis is error-free. We are not liable for any damages resulting from your use of the platform or reliance on our intelligence.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the platform at our discretion, without notice, if you violate these terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">7. Governing Law</h2>
            <p>
              These terms are governed by the laws of the jurisdiction in which Hackura Sentinel AI is registered, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to Terms</h2>
            <p>
              We may update these Terms & Conditions from time to time. Your continued use of the platform after changes are posted constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Us</h2>
            <p>
              For any questions regarding these terms, please contact legal@hackura.ai.
            </p>
          </section>
        </motion.div>
      </div>
    </main>
  );
}