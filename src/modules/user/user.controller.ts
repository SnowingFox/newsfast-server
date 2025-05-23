import { Controller, Get, Inject, Query } from '@nestjs/common'
import { UserService } from './user.service'
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('用户')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
  @Inject()
  private readonly service: UserService
}
