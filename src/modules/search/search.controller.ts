import { Public } from '@/common/decorator/public.decorator';
import { Controller, Get, Inject } from '@nestjs/common';
import { SearchService } from './search.service';

@Public()
@Controller('search')
export class SearchController {
  @Inject()
  private readonly service: SearchService;

  @Get('/google')
  async googleSearch() {
    return this.service.googleSearch('nodejs');
  }
}
