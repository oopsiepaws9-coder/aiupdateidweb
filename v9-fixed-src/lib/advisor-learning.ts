export type OutcomeAggregate = {
  success: number;
  partial: number;
  failed: number;
  switchedTool: number;
  notUsed: number;
};

export type OutcomeSignal = {
  samples: number;
  observedScore: number;
  confidence: number;
  adjustment: number;
  eligible: boolean;
};

const MIN_SAMPLES = 12;
const FULL_WEIGHT_SAMPLES = 80;
const MAX_ADJUSTMENT = 8;
const PRIOR_MEAN = 0.62;
const PRIOR_STRENGTH = 18;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function buildOutcomeSignal(data: OutcomeAggregate): OutcomeSignal {
  const samples = data.success + data.partial + data.failed + data.switchedTool;
  if (samples <= 0) return { samples: 0, observedScore: 62, confidence: 0, adjustment: 0, eligible: false };

  const weightedSuccess = data.success + data.partial * 0.55 + data.switchedTool * 0.15;
  const posterior = (weightedSuccess + PRIOR_MEAN * PRIOR_STRENGTH) / (samples + PRIOR_STRENGTH);
  const observedScore = Math.round(posterior * 100);
  const confidence = Math.round(clamp((samples - MIN_SAMPLES + 1) / (FULL_WEIGHT_SAMPLES - MIN_SAMPLES + 1), 0, 1) * 100);
  const eligible = samples >= MIN_SAMPLES;

  if (!eligible) return { samples, observedScore, confidence: 0, adjustment: 0, eligible: false };

  const reliability = confidence / 100;
  const centered = posterior - PRIOR_MEAN;
  const adjustment = Math.round(clamp(centered * 40 * reliability, -MAX_ADJUSTMENT, MAX_ADJUSTMENT) * 10) / 10;

  return { samples, observedScore, confidence, adjustment, eligible: true };
}

export function applyOutcomeAdjustment(baseScore: number, signal?: OutcomeSignal) {
  if (!signal?.eligible) return Math.round(clamp(baseScore, 0, 100));
  return Math.round(clamp(baseScore + signal.adjustment, 0, 100));
}

export const OUTCOME_LEARNING_GUARDRAILS = {
  minimumSamples: MIN_SAMPLES,
  fullWeightSamples: FULL_WEIGHT_SAMPLES,
  maxAdjustment: MAX_ADJUSTMENT,
  priorMean: PRIOR_MEAN,
  note: "Outcome tidak mengubah ranking sebelum minimum sample tercapai; penyesuaian dibatasi dan memakai shrinkage ke prior.",
} as const;
