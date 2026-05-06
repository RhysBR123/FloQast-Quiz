import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

import {
  getBenchmarkRuntimeConfig,
  isBenchmarkSupabaseConfigured,
} from './benchmark-config.mjs';

const LOCAL_STORAGE_KEY = 'floqast-benchmark-submissions-v1';
const BENCHMARK_SCHEMA_VERSION = 'benchmark-v1';

let supabaseClient;

function getSupabaseTableConfig() {
  const config = getBenchmarkRuntimeConfig();
  return {
    schema: config.supabaseSchema || 'public',
    writeTable: config.supabaseWriteTable || 'quiz_sessions',
  };
}

function getSupabaseClient() {
  if (!isBenchmarkSupabaseConfigured()) return null;
  if (!supabaseClient) {
    const config = getBenchmarkRuntimeConfig();
    supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseClient;
}

function readLocalState() {
  const raw = globalThis.localStorage?.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return { submissions: [] };

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.submissions)) return parsed;
  } catch (error) {
    // Fall through to a clean reset.
  }

  return { submissions: [] };
}

function writeLocalState(state) {
  globalThis.localStorage?.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

function normalizeAnswerPayload(answers = []) {
  return Array.isArray(answers) ? answers : [];
}

function buildSubmissionRow({ eventSlug, source, gateData, answers, result }) {
  const tables = getSupabaseTableConfig();
  const dimensionScores = Array.isArray(result.dimensionScores)
    ? result.dimensionScores.reduce((accumulator, item) => {
        accumulator[item.key] = item.percentage;
        return accumulator;
      }, {})
    : {};

  if (tables.writeTable === 'quiz_sessions') {
    return {
      email: gateData.email,
      answers: {
        responses: normalizeAnswerPayload(answers),
        _meta: {
          schema: BENCHMARK_SCHEMA_VERSION,
          event_slug: eventSlug,
          source: source || 'campaign-web',
          total_points: Number(result.totalPoints || 0),
          maturity_level: result.profile || '',
          strongest_asset: result.strongestDimension?.meta?.label || '',
          biggest_gap: result.weakestDimension?.meta?.label || '',
          next_steps: Array.isArray(result.nextSteps)
            ? result.nextSteps.map((item) => item.action?.label || '').filter(Boolean)
            : [],
          firstname: gateData.firstname,
          lastname: gateData.lastname,
          company: gateData.company,
        },
      },
      dimensions: dimensionScores,
      total_pressure: Number(result.totalScorePct || 0),
      created_at: new Date().toISOString(),
      identified_at: new Date().toISOString(),
      hubspot_synced: false,
    };
  }

  return {
    event_slug: eventSlug,
    source: source || 'campaign-web',
    attendee_first_name: gateData.firstname,
    attendee_last_name: gateData.lastname,
    attendee_email: gateData.email,
    attendee_company: gateData.company,
    total_points: Number(result.totalPoints || 0),
    overall_score: Number(result.totalScorePct || 0),
    maturity_level: result.profile || '',
    quiz_answers: normalizeAnswerPayload(answers),
    dimension_scores: dimensionScores,
    benchmark_payload: {
      strongest_asset: result.strongestDimension?.meta?.label || '',
      biggest_gap: result.weakestDimension?.meta?.label || '',
      next_steps: Array.isArray(result.nextSteps)
        ? result.nextSteps.map((item) => item.action?.label || '').filter(Boolean)
        : [],
    },
    submitted_at: new Date().toISOString(),
  };
}

export async function saveBenchmarkAssessmentSubmission({
  eventSlug = null,
  source = 'campaign-web',
  gateData,
  answers,
  result,
}) {
  const row = buildSubmissionRow({
    eventSlug,
    source,
    gateData,
    answers,
    result,
  });

  if (isBenchmarkSupabaseConfigured()) {
    const client = getSupabaseClient();
    const tables = getSupabaseTableConfig();
    const { error } = await client.from(tables.writeTable).insert(row);
    if (!error) {
      return row;
    }
    console.warn('[Benchmark] Supabase insert failed, falling back locally:', error);
  }

  const state = readLocalState();
  state.submissions.push({
    id: globalThis.crypto?.randomUUID?.() || `local-${Date.now()}`,
    ...row,
  });
  writeLocalState(state);
  return row;
}
