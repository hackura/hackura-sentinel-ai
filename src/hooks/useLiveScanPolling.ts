'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { LiveScanData, ScanStatus } from '@/types';
import { api } from '@/lib/api';

interface UseLiveScanPollingOptions {
  scanId: string;
  initialPollInterval?: number;
  maxRetries?: number;
  enableBackoff?: boolean;
}

interface PollingState {
  data: LiveScanData | null;
  loading: boolean;
  error: string | null;
  retries: number;
  isComplete: boolean;
  isFailed: boolean;
}

/**
 * Hook for polling live scan data with progressive updates
 * Handles network interruptions, retries, and graceful degradation
 */
export function useLiveScanPolling({
  scanId,
  initialPollInterval = 1000,
  maxRetries = 5,
  enableBackoff = true,
}: UseLiveScanPollingOptions): PollingState {
  const [state, setState] = useState<PollingState>({
    data: null,
    loading: true,
    error: null,
    retries: 0,
    isComplete: false,
    isFailed: false,
  });

  const pollIntervalRef = useRef(initialPollInterval);
  const retryCountRef = useRef(0);
  const pollTimeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // Cleanup polling on unmount or when scanId changes
  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [scanId]);

  const pollScan = useCallback(async () => {
    if (!scanId) return;

    // Cancel previous request if still pending
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const response = await api.get(`/scan/${scanId}`, {
        signal: abortControllerRef.current.signal,
      });

      const scanData: LiveScanData = response.data.data || response.data;

      setState((prev) => ({
        ...prev,
        data: scanData,
        loading: false,
        error: null,
        retries: 0,
      }));

      // Check if scan is complete or failed
      const isComplete = ['completed', 'failed'].includes(scanData.status);
      if (isComplete) {
        setState((prev) => ({
          ...prev,
          isComplete: scanData.status === 'completed',
          isFailed: scanData.status === 'failed',
        }));
        return; // Stop polling
      }

      // Continue polling
      const nextInterval = enableBackoff
        ? Math.min(
            initialPollInterval * Math.pow(1.5, retryCountRef.current),
            5000
          )
        : initialPollInterval;

      pollIntervalRef.current = nextInterval;
      pollTimeoutRef.current = setTimeout(pollScan, nextInterval);
    } catch (error: any) {
      // Don't treat abort errors as real errors
      if (error.name === 'AbortError') return;

      retryCountRef.current += 1;

      if (retryCountRef.current >= maxRetries) {
        setState((prev) => ({
          ...prev,
          error: 'Failed to fetch scan updates after multiple attempts',
          isFailed: true,
          loading: false,
        }));
        return; // Stop polling
      }

      setState((prev) => ({
        ...prev,
        error:
          error.message ||
          `Network error: ${error.code || 'Unknown'} (attempt ${retryCountRef.current}/${maxRetries})`,
        retries: retryCountRef.current,
      }));

      // Retry with exponential backoff
      const backoffInterval = enableBackoff
        ? Math.min(
            initialPollInterval * Math.pow(2, retryCountRef.current),
            10000
          )
        : initialPollInterval;

      pollIntervalRef.current = backoffInterval;
      pollTimeoutRef.current = setTimeout(pollScan, backoffInterval);
    }
  }, [scanId, initialPollInterval, maxRetries, enableBackoff]);

  // Start polling on mount or when scanId changes
  useEffect(() => {
    if (!scanId) return;

    retryCountRef.current = 0;
    pollScan();
  }, [scanId, pollScan]);

  return state;
}
