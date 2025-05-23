import { SUPABASE_SDK_CLIENT } from "@nestixis/nestjs-supabase";
import { Inject } from "@nestjs/common";

export const InjectSupabase = () => Inject(SUPABASE_SDK_CLIENT)