import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js';
import { SUPABASE_CLIENT_TOKEN } from './supabase.decorator';

@Injectable()
export class SupabaseService extends SupabaseClient {
  constructor(
    protected supabaseUrl: string,
    protected supabaseKey: string,
    options?: SupabaseClientOptions<any>
  ) {
    super(supabaseUrl, supabaseKey, options);
  }
} 