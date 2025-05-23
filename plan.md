# Cal-AI App Technical Plan (Optimized)

## Overview
Cal-AI is a calorie tracking application that uses AI to identify food from images and provide nutritional information. Users can track their daily calorie intake, set goals, and monitor their progress. The app provides insights into nutritional balance and weight management.

## Database Schema (Prisma)

Based on the existing schema structure and organization pattern, we'll use separate schema files and enums.

### Main Schema: `/prisma/schema/schema.prisma`
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["prismaSchemaFolder"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### User Schema: `/prisma/schema/user.prisma`
```prisma
model User {
  id              Int           @id @default(autoincrement())
  email           String        @unique
  username        String
  password        String?       // Hashed password (null for social auth)
  avatar          String?
  ipAddress       String?
  desc            String        @default("No description yet")
  role            Role          @default(User)
  dailyCalorieGoal Int?
  
  birthDate       DateTime?
  gender          Gender?
  height          Float?        // in cm
  
  // Auth relations
  apple           AppleUser?
  
  // App relations
  foodEntries     FoodEntry[]
  nutritionGoals  NutritionGoal[]
  weightEntries   WeightEntry[]
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([id, email, username])
}

model AppleUser {
  id              String        @id
  userId          Int           @unique
  user            User          @relation(fields: [userId], references: [id])
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([id, userId])
}
```

### Food Schema: `/prisma/schema/food.prisma`
```prisma
model FoodEntry {
  id              Int           @id @default(autoincrement())
  userId          Int
  user            User          @relation(fields: [userId], references: [id])
  
  // Food information
  foodName        String
  imageUrl        String?       // Stored in Supabase
  mealType        MealType
  date            DateTime      // The date of consumption
  
  // Nutritional information
  calories        Int
  carbs           Float
  protein         Float
  fat             Float
  servingSize     Float?        // in grams
  servingUnit     String?       // e.g., "g", "oz", "cup"
  
  // AI analysis information
  confidenceScore Int?        // AI confidence in identification
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([userId, date, mealType])
}

model NutritionGoal {
  id              Int           @id @default(autoincrement())
  userId          Int
  user            User          @relation(fields: [userId], references: [id])
  
  dailyCalories   Int
  dailyCarbs      Float
  dailyProtein    Float
  dailyFat        Float
  startDate       DateTime      @default(now()) // When this goal was set
  isActive        Boolean       @default(true)
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([userId, isActive])
}

model WeightEntry {
  id              Int           @id @default(autoincrement())
  userId          Int
  user            User          @relation(fields: [userId], references: [id])
  
  weight          Float         // in kg
  date            DateTime
  note            String?
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([userId, date])
}
```

### Enums: `/prisma/schema/enum/food.prisma`
```prisma
enum MealType {
  Breakfast
  Lunch
  Dinner
  Snack
}
```

### Enums: `/prisma/schema/enum/user.prisma`
```prisma
enum Role {
  Admin
  User
  Banned
}

enum Gender {
  Male
  Female
  Other
}
```

## Modules

### AuthModule
Handles user authentication and authorization using JWT.

#### Services
- `AuthService`: Manages user registration, login, token generation and verification
  - `register(data)`: Register a new user
  - `login(email, password)`: Authenticate a user with credentials
  - `appleLogin(token)`: Handle Apple authentication
  - `refreshToken(token)`: Generate a new access token
  - `validateUser(payload)`: Verify user from JWT payload

#### Controllers
- `AuthController`: Exposes auth endpoints
  - `POST /auth/register`: Register a new user account
  - `POST /auth/login`: Login with email/password
  - `POST /auth/apple`: Login with Apple
  - `POST /auth/refresh`: Refresh access token

### UserModule
Manages user profiles and settings.

#### Services
- `UserService`: Handles CRUD operations for user profiles
  - `findById(id)`: Get user by ID
  - `findByEmail(email)`: Get user by email
  - `updateProfile(id, data)`: Update user profile
  - `updateSettings(id, settings)`: Update user settings
  - `getProfileWithStats(id)`: Get user with associated stats

#### Controllers
- `UserController`: Exposes endpoints for user profile management
  - `GET /users/me`: Get current user profile
  - `PATCH /users/me`: Update user profile
  - `GET /users/me/stats`: Get user statistics summary

### FoodEntryModule
Manages food entries and nutritional information.

#### Services
- `FoodEntryService`: Handles CRUD operations for food entries
  - `create(userId, data)`: Create a new food entry
  - `findAll(userId, filters)`: Get all user's food entries
  - `findById(id, userId)`: Get specific food entry
  - `update(id, userId, data)`: Update a food entry
  - `delete(id, userId)`: Delete a food entry
  - `getDailyEntries(userId, date)`: Get entries for specific date
  - `getWeeklyEntries(userId, startDate)`: Get entries for a week

- `FoodRecognitionService`: Integrates with OpenAI to recognize food from images
  - `recognizeFood(imageBuffer)`: Process image and identify food with AI
  - `getNutritionalInfo(foodName, portion)`: Get nutritional data for identified food

#### Controllers
- `FoodEntryController`: Exposes endpoints for managing food entries
  - `POST /food-entries`: Create a new food entry with image
  - `GET /food-entries`: Get all food entries with pagination and filters
  - `GET /food-entries/:id`: Get a specific food entry
  - `PATCH /food-entries/:id`: Update a food entry
  - `DELETE /food-entries/:id`: Delete a food entry
  - `POST /food-entries/recognize`: Analyze food image without saving
  - `GET /food-entries/daily`: Get food entries for specific date
  - `GET /food-entries/weekly`: Get food entries for the current week

### NutritionGoalModule
Manages user nutritional goals.

#### Services
- `NutritionGoalService`: Handles operations for nutrition goals
  - `create(userId, data)`: Create a nutrition goal
  - `getActive(userId)`: Get user's active nutrition goal
  - `update(id, userId, data)`: Update a nutrition goal
  - `setActive(id, userId)`: Set a goal as active
  - `getHistory(userId)`: Get history of nutrition goals

#### Controllers
- `NutritionGoalController`: Exposes endpoints for managing nutrition goals
  - `POST /nutrition-goals`: Create a new nutrition goal
  - `GET /nutrition-goals/active`: Get current active nutrition goal
  - `PATCH /nutrition-goals/:id`: Update a nutrition goal
  - `POST /nutrition-goals/:id/activate`: Set a goal as active
  - `GET /nutrition-goals/history`: Get history of nutrition goals

### AnalyticsModule
Handles data aggregation for user analytics.

#### Services
- `AnalyticsService`: Aggregates user data for insights
  - `getDailyCalories(userId, date)`: Get daily calorie summary
  - `getWeeklyCalories(userId, endDate)`: Get weekly calorie summary
  - `getMonthlyCalories(userId, endDate)`: Get monthly calorie summary
  - `getNutrientBreakdown(userId, startDate, endDate)`: Get nutrient breakdown
  - `getWeightProgress(userId, startDate, endDate)`: Get weight progress
  - `getGoalProgress(userId)`: Get progress toward nutritional goals

#### Controllers
- `AnalyticsController`: Exposes endpoints for retrieving analytics
  - `GET /analytics/calories/daily`: Get daily calorie breakdown
  - `GET /analytics/calories/weekly`: Get weekly calorie breakdown
  - `GET /analytics/calories/monthly`: Get monthly calorie breakdown
  - `GET /analytics/nutrients`: Get nutrient breakdown for time period
  - `GET /analytics/weight`: Get weight progress over time
  - `GET /analytics/goals`: Get progress toward nutritional goals

### SupabaseModule
Handles integration with Supabase for image storage.

#### Services
- `SupabaseService`: Manages image storage
  - `uploadImage(file, userId)`: Upload an image to Supabase
  - `getImageUrl(path)`: Get a public URL for an image
  - `deleteImage(path)`: Delete an image from storage

## AI Integration (OpenAI)

The `FoodRecognitionService` will integrate with @ai-sdk/openai to analyze food images:

```typescript
// Example implementation concept
import { OpenAI } from '@ai-sdk/openai';

@Injectable()
export class FoodRecognitionService {
  private openai: OpenAI;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  
  async recognizeFood(imageBuffer: Buffer): Promise<FoodAnalysisResult> {
    // Convert image to base64
    const base64Image = imageBuffer.toString('base64');
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a nutritional analysis assistant. Identify the food in the image and provide nutritional information.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'What food is in this image? Please provide the following information in JSON format: foodName, servingSize (in grams if possible), calories, carbs (g), protein (g), fat (g), and confidenceScore (0-1).' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          ],
        },
      ],
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    return result;
  }
}
```

## Implementation Priority

1. Setup Prisma schema and database migrations
2. Implement AuthModule for user registration and login
3. Implement SupabaseModule for image storage
4. Implement FoodEntryModule with AI integration
5. Implement UserModule for profile management
6. Implement NutritionGoalModule for goal setting
7. Implement AnalyticsModule for progress tracking

## Optimized API Endpoints

### Removed Unnecessary Endpoints
- Removed `/users/me/goals` endpoints as they are redundant with the nutrition goals endpoints
- Consolidated weight tracking into the analytics module
- Simplified the nutrition endpoints to avoid duplication

### Added Important Endpoints
- Added `/food-entries/recognize` for analyzing food without saving
- Added endpoints for managing goal history
- Added endpoint for comprehensive user stats

## Security Considerations

- Use argon2 for password hashing
- Implement JWT for authentication with short-lived access tokens and refresh tokens
- Rate limiting for AI analysis endpoints to prevent abuse
- Input validation using class-validator and transformation using class-transformer
- Proper error handling with structured error responses
- Data sanitization to prevent SQL injection
- Authorization guards to ensure users can only access their own data
