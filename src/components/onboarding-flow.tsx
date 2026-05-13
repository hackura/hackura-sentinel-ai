'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import {
  updateUserProfile,
  completeOnboarding,
} from '@/lib/onboarding';

const ROLES = [
  'Security Researcher',
  'Pentester',
  'SOC Analyst',
  'Developer',
  'Student',
  'IT Administrator',
  'Bug Bounty Hunter',
  'Enterprise Team',
  'Educator',
  'Other',
];

const DISCOVERY_SOURCES = [
  'ChatGPT',
  'Google',
  'GitHub',
  'LinkedIn',
  'Facebook',
  'Instagram',
  'TikTok',
  'YouTube',
  'Friend / Colleague',
  'Conference / Event',
  'Other',
];

interface OnboardingData {
  display_name: string;
  username: string;
  role: string;
  discovery_source: string;
  interest_reason: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export function OnboardingFlow() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OnboardingData>({
    display_name: '',
    username: '',
    role: '',
    discovery_source: '',
    interest_reason: '',
  });

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
      setError(null);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    }
  };

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = (): boolean => {
    if (step === 2) {
      if (!data.display_name.trim()) {
        setError('Display name is required');
        return false;
      }
      if (data.display_name.length < 2) {
        setError('Display name must be at least 2 characters');
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleComplete = async () => {
    if (!user) return;

    if (step < 6) {
      if (!validateStep()) return;
      handleNext();
      return;
    }

    setIsSubmitting(true);
    try {
      // Save all onboarding data
      await updateUserProfile(user.id, {
        display_name: data.display_name,
        username: data.username || undefined,
        role: data.role || undefined,
        discovery_source: data.discovery_source || undefined,
        interest_reason: data.interest_reason || undefined,
      });

      // Mark onboarding as complete
      await completeOnboarding(user.id);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Error completing onboarding:', err);
      setError('Failed to complete onboarding. Please try again.');
      setIsSubmitting(false);
    }
  };

  const stepContent = [
    {
      title: 'Welcome to Hackura Sentinel AI',
      subtitle: 'AI-powered threat intelligence and infrastructure analysis.',
      content: null,
    },
    {
      title: 'What should we call you?',
      subtitle: 'Set up your profile',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Karl, Security Team"
              value={data.display_name}
              onChange={(e) => handleInputChange('display_name', e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950/50 border border-purple-500/20 rounded-lg text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Username <span className="text-zinc-500 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., security_pro"
              value={data.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950/50 border border-purple-500/20 rounded-lg text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'What best describes your role?',
      subtitle: 'Help us understand your expertise',
      content: (
        <div className="grid grid-cols-3 gap-2">
          {ROLES.map((role) => (
            <button
              key={role}
              onClick={() => handleInputChange('role', role)}
              className={`px-3 py-2 rounded-lg font-medium transition-all text-xs border ${
                data.role === role
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-zinc-950/50 border-purple-500/20 text-zinc-300 hover:border-purple-500/50'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Where did you hear about us?',
      subtitle: 'This helps us understand our reach',
      content: (
        <div className="grid grid-cols-3 gap-2">
          {DISCOVERY_SOURCES.map((source) => (
            <button
              key={source}
              onClick={() => handleInputChange('discovery_source', source)}
              className={`px-3 py-2 rounded-lg font-medium transition-all text-xs border ${
                data.discovery_source === source
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-zinc-950/50 border-purple-500/20 text-zinc-300 hover:border-purple-500/50'
              }`}
            >
              {source}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Why are you interested in Sentinel?',
      subtitle: 'Share your thoughts (optional)',
      content: (
        <div>
          <textarea
            placeholder="Tell us what excites you about threat intelligence and infrastructure analysis..."
            value={data.interest_reason}
            onChange={(e) => {
              if (e.target.value.length <= 300) {
                handleInputChange('interest_reason', e.target.value);
              }
            }}
            maxLength={300}
            className="w-full px-4 py-3 bg-zinc-950/50 border border-purple-500/20 rounded-lg text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all resize-none h-32"
          />
          <div className="text-xs text-zinc-500 mt-2">
            {data.interest_reason.length}/300 characters
          </div>
        </div>
      ),
    },
    {
      title: 'Threat intelligence systems online.',
      subtitle: 'Onboarding complete',
      content: (
        <div className="text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 border-r-purple-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border-2 border-transparent border-b-purple-400 border-l-purple-400"
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              ✓
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-white">
              {data.display_name || 'Welcome'}
            </p>
            <p className="text-sm text-zinc-400">
              Your threat intelligence dashboard is ready
            </p>
          </div>
        </div>
      ),
    },
  ];

  const current = stepContent[step - 1];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-xl">
        {/* Progress indicator */}
        <motion.div
          className="mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <motion.div
                key={num}
                className={`h-1 flex-1 rounded-full transition-all ${
                  num <= step
                    ? 'bg-purple-500'
                    : 'bg-zinc-800'
                }`}
                layoutId={`progress-${num}`}
              />
            ))}
          </div>
          <div className="text-center mt-4 text-sm text-zinc-400">
            Step {step} of 6
          </div>
        </motion.div>

        {/* Content card */}
        <motion.div
          className="bg-zinc-950/50 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Title and subtitle */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  {current.title}
                </h2>
                <p className="text-zinc-400 text-sm">
                  {current.subtitle}
                </p>
              </div>

              {/* Content */}
              {current.content && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {current.content}
                </motion.div>
              )}

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <motion.button
                    onClick={handlePrevious}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded-lg border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                )}

                <motion.button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all text-white ${
                    step === 6
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600'
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting
                    ? 'Loading...'
                    : step === 6
                    ? 'Enter Dashboard'
                    : 'Continue'}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
