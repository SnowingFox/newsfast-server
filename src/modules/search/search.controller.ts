import { Public } from '@/common/decorator/public.decorator';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { GoogleSearchQuery } from './dto/google.dto';

@Public()
@Controller('search')
export class SearchController {
  @Inject()
  private readonly service: SearchService;

  @Get('/google')
  async googleSearch(@Query() query: GoogleSearchQuery) {
    return this.service.googleSearch(query);
  }
}
