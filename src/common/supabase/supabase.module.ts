import { DynamicModule, Module, Provider } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { SUPABASE_MODULE_OPTIONS } from './supabase.decorator';
import { AppConfig } from '@/app.config';



export interface SupabaseModuleOptions {
  url: string;
  key: string;
  options?: any;
  isGlobal?: boolean;
}

export interface SupabaseOptionsFactory {
  createSupabaseOptions(): Promise<SupabaseModuleOptions> | SupabaseModuleOptions;
}

export interface SupabaseModuleAsyncOptions {
  isGlobal?: boolean;
  useFactory?: (...args: any[]) => Promise<SupabaseModuleOptions> | SupabaseModuleOptions;
  inject?: any[];
  useClass?: any;
  useExisting?: any;
}

@Module({})
export class SupabaseModule {


  static forRootAsync(options: SupabaseModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = [
      ...this.createAsyncProviders(options),
      {
        provide: SupabaseService,
        useFactory: (moduleOptions: SupabaseModuleOptions) => {
          const { url, key, options: clientOptions } = moduleOptions;
          return new SupabaseService(url, key, clientOptions);
        },
        inject: [SUPABASE_MODULE_OPTIONS],
      },
    ];

    const exports = [SupabaseService];

    if (options.isGlobal) {
      return {
        global: true,
        module: SupabaseModule,
        imports: options.useExisting || options.useClass ? [] : [],
        providers,
        exports,
      };
    }

    return {
      module: SupabaseModule,
      imports: options.useExisting || options.useClass ? [] : [],
      providers,
      exports,
    };
  }

  private static createAsyncProviders(options: SupabaseModuleAsyncOptions): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: SUPABASE_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }

    if (options.useClass) {
      return [
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
        {
          provide: SUPABASE_MODULE_OPTIONS,
          useFactory: async (optionsFactory: SupabaseOptionsFactory) =>
            await optionsFactory.createSupabaseOptions(),
          inject: [options.useClass],
        },
      ];
    }

    if (options.useExisting) {
      return [
        {
          provide: SUPABASE_MODULE_OPTIONS,
          useFactory: async (optionsFactory: SupabaseOptionsFactory) =>
            await optionsFactory.createSupabaseOptions(),
          inject: [options.useExisting],
        },
      ];
    }

    return [];
  }
}
