const baseConfig = {
  supabaseUrl: 'https://yckcchwhxznltqxrocrf.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlja2NjaHdoeHpubHRxeHJvY3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNjQ2MzEsImV4cCI6MjA3OTg0MDYzMX0.AKhQoLY2FBnyWzaW3uLVVMNOmL8FshJpLBUeGszIw5Q',
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
