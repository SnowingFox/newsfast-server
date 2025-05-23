import { Inject } from '@nestjs/common';

export const SUPABASE_CLIENT_TOKEN = 'SUPABASE_CLIENT';
export const SUPABASE_MODULE_OPTIONS = 'SUPABASE_MODULE_OPTIONS';

export const InjectSupabase = () => Inject(SUPABASE_CLIENT_TOKEN); 