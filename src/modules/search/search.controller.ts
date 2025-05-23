import { Public } from '@/common/decorator/public.decorator';
import { Controller, Get } from '@nestjs/common';

@Public()
@Controller('search')
export class SearchController {
  @Get('/google')
  async googleSearch() {
  }
}
