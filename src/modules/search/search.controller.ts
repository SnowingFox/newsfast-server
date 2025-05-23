import { Public } from '@/common/decorator/public.decorator';
import { Controller, Inject, Post, Query, Body, Get } from '@nestjs/common';
import { SearchService } from './search.service';
import { GoogleSearchBody } from './dto/google.dto';

@Public()
@Controller('search')
export class SearchController {
  @Inject()
  private readonly service: SearchService;

  @Get('/google')
  async getGoogleSearch(@Query() dto: GoogleSearchBody) {
    return this.service.googleSearch(dto);
  }

  @Post('/google')
  async googleSearch(@Body() dto: GoogleSearchBody) {
    return this.service.googleSearch(dto);
  }
}
