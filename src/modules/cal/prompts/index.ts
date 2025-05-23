const recognize = `### System ###
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

export const CalPrompts = {
  recognize,
}
