const baseConfig = {
  supabaseUrl: 'https://krzilteeeslvyudvgfuh.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyemlsdGVlZXNsdnl1ZHZnZnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODc0NTEsImV4cCI6MjA5MzY2MzQ1MX0.HLExr86rI986vzC6YwjlwvSeM-u617nTulRz8Fksay0',
  supabaseSchema: 'public',
  supabaseWriteTable: 'quiz_sessions',
  useLocalFallbackWhenUnconfigured: true,
};

export function getBenchmarkRuntimeConfig() {
  const override = globalThis.FLOQAST_BENCHMARK_CONFIG || {};
  return {
    ...baseConfig,
    ...override,
  };
}

export function isBenchmarkSupabaseConfigured() {
  const config = getBenchmarkRuntimeConfig();
  return Boolean(
    config.supabaseUrl &&
    config.supabaseAnonKey &&
    !String(config.supabaseUrl).includes('YOUR_SUPABASE') &&
    !String(config.supabaseAnonKey).includes('YOUR_SUPABASE')
  );
}
