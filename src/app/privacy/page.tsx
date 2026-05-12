'use client';

import { PublicNavbar } from '@/components/public-navbar';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-zinc-300">
      <PublicNavbar showHomeButton />

      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert prose-zinc max-w-none"
        >
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          <p className="text-zinc-400 mb-8">Last Updated: May 12, 2026</p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p>
              Hackura Sentinel AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cybersecurity intelligence platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium text-zinc-200 mb-2">2.1 Personal Information</h3>
            <p>
              When you create an account, we collect your email address, name, and billing information (if applicable). We use this to manage your account and provide our services.
            </p>
            <h3 className="text-xl font-medium text-zinc-200 mb-2">2.2 Usage Data</h3>
            <p>
              We collect information about your interactions with our platform, including URLs scanned, search queries, and platform navigation patterns. This data is used to improve our threat detection models.
            </p>
            <h3 className="text-xl font-medium text-zinc-200 mb-2">2.3 Security Data</h3>
            <p>
              As a security platform, we may collect technical data such as IP addresses, browser types, and device information to protect our services from abuse and to provide accurate threat analysis.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our cybersecurity services.</li>
              <li>To improve our AI-powered threat detection and graph intelligence.</li>
              <li>To process transactions and send related information.</li>
              <li>To communicate with you about updates, security alerts, and support.</li>
              <li>To comply with legal obligations and protect against fraudulent activity.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal data. We may share information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Third-party vendors who help us with hosting, payments, and analytics.</li>
              <li><strong>Legal Requirements:</strong> If required by law or to protect the rights and safety of our users.</li>
              <li><strong>Aggregated Data:</strong> We may share anonymized, aggregated threat intelligence with the broader security community.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct, or delete your personal data. You can manage most of your data through your account settings or by contacting our support team.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Security</h2>
            <p>
              We implement industry-standard security measures, including encryption and secure access controls, to protect your data. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at privacy@hackura.ai.
            </p>
          </section>
        </motion.div>
      </div>
    </main>
  );
}