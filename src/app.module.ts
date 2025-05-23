import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from 'nestjs-prisma'
import { fileLoader, TypedConfigModule } from 'nest-typed-config'
import { AppConfig } from './app.config'
import { schemeValidator } from '@/utils/schemaValidator'
import { ThrottlerModule } from '@nestjs/throttler'
import { ScheduleModule } from '@nestjs/schedule'
import { CommonModule } from './common/common.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { CalModule } from './modules/cal/cal.module';
import { SupabaseModule } from './common/supabase'
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule.forRootAsync({
      isGlobal: true,
      useFactory({ supabase }: AppConfig) {
        return {
          url: supabase.url,
          key: supabase.key,
        }
      },
      inject: [AppConfig],
    }),
    TypedConfigModule.forRoot({
      schema: AppConfig,
      load: fileLoader(),
      validate: schemeValidator,
    }),
    ThrottlerModule.forRootAsync({
      useFactory({ throttle }: AppConfig) {
        return {
          throttlers: [throttle],
        }
      },
      inject: [AppConfig],
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    AuthModule,
    UserModule,
    CalModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
