'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, Button } from './ui';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  loading = false,
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md"
          >
            <GlassCard className="border-zinc-800 shadow-2xl shadow-black/50">
              <h3 className={`text-xl font-bold mb-2 ${variant === 'danger' ? 'text-red-400' : 'text-white'}`}>
                {title}
              </h3>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                {message}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 border-zinc-700"
                >
                  {cancelText}
                </Button>
                <Button
                  variant={variant}
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Processing...' : confirmText}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
