import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const openai = createOpenAI({
  apiKey: '7aac75c410064906a1ab020027702517.fb2QKFzkAX0sWPR7',
  baseURL: "https://open.bigmodel.cn/api/paas/v4/",
});

const systemPrompt = `### System ###
分析图片中的食物，并提供其热量信息和营养成分，并且考虑他的重量因素、大小

###type define###
interface FoodNutrition {
  /** 食物名称 */
  food_name: string;
  /** 热量（千卡） */
  calories: number;
  /** 蛋白质（克） */
  protein: number;
  /** 碳水化合物（克） */
  carbohydrates: number;
  /** 脂肪（克） */
  fat: number;
  /** 重量（克） */
  weight: number;
  /** 数量 */
  count: number;
}

interface Seasoning {
  /** 调料名称 */
  seasoning_name: string;
  /** 调料重量（克） */
  seasoning_weight: number;
  /** 热量（千卡） */
  calories: number;
  /** 蛋白质（克） */
  protein: number;
  /** 碳水化合物（克） */
  carbohydrates: number;
  /** 脂肪（克） */
  fat: number;
  /** 重量（克） */
  weight: number;
  /** 数量 */
  count: number;
}

interface Result {
  /** 食物主要信息 @default {} */
  nutrition: FoodNutrition;
  /** 调料 @default {[]} */
  seasoning: Seasoning[];
}

并严格按照以下格式输出，按照Result输出`

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: openai('glm-4v-plus-0111', {}),
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: new URL('https://sns-webpic-qc.xhscdn.com/202503201514/82619400bf7847f5df7cd1ad04849658/1040g2sg31avol4gqn2705pn2ggr7ee8qadcq95g!nd_dft_wlteh_webp_3')
          },
        ],
      },
    ],
  });

  return result.toDataStreamResponse();
}