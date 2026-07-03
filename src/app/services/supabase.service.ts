import { Injectable, Service } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Service()
export class SupabaseService {
  readonly client: SupabaseClient = createClient(
    import.meta.env['VITE_SUPABASE_URL'],
    import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY']
  );
}
