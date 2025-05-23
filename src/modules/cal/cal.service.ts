import { Injectable } from '@nestjs/common';
import { RecognizeDto } from './dto/recognize';
import { IUser } from '@/app';
import { streamText } from 'ai';
import { openai } from '@/common/ai'
import { CalPrompts } from './prompts';
import { SupabaseService } from '@/common/supabase';

@Injectable()
export class CalService {
  constructor(
    private readonly supabase: SupabaseService,
  ) { }

  async onModuleInit() {
    const imageUrl = 'http://1.15.157.12:8000/storage/v1/object/public/food//c1b2237c-5ed6-46fc-978e-1c69182c86a1.png'

    const result = streamText({
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
  }

  async recognize(dto: RecognizeDto, user: IUser) {
    const imageUrl = await this.supabase.storage.from('food').getPublicUrl('24436383-3555-4a78-8749-d3f857b0ed87').data.publicUrl

    console.log(imageUrl)
    const result = streamText({
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
    return dto;
  }
}