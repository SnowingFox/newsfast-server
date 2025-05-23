import { IUser } from '@/app';
import { Controller, Inject, Post, Body, Get, Res } from '@nestjs/common';
import { RecognizeDto } from './dto/recognize';
import { User } from '@/common/decorator/user.decorator';
import { CalService } from './cal.service';
import { Public } from '@/common/decorator/public.decorator';
import { generateText, streamText } from 'ai';
import { openai } from '@/common/ai';
import { Response } from 'express';

@Public()
@Controller('cal')
export class CalController {
  @Inject()
  private readonly service: CalService;

  @Post('/recognize')
  async recognize(@Body() dto: RecognizeDto, @User() user: IUser) {
    return this.service.recognize(dto, user);
  }

  @Get('/generate')
  async generate(@Res() res: Response) {
    const imageUrl = 'http://1.15.157.12:8000/storage/v1/object/public/food//c1b2237c-5ed6-46fc-978e-1c69182c86a1.png'

    const stream = streamText({
      model: openai('glm-4v-plus-0111', {}),
      system: '描述图片',
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: new URL(imageUrl)
            },
          ],
        },
      ],
      onChunk(chunk) {
        console.log(chunk)
      },
      onFinish(result) {
        console.log(result.text)
      }
    });


    return stream.pipeTextStreamToResponse(res)
  }
}
