import { Injectable } from '@nestjs/common';
import {
  search,
  OrganicResult, // Import the result types you need
  DictionaryResult,
  ResultTypes, // Import to filter results by type
  // @ts-ignore
} from "google-sr";

@Injectable()
export class SearchService {
  async googleSearch(query: string) {
    const queryResult = await search({
      query,
      // Specify the result types explicitly ([OrganicResult] is the default, but it is recommended to always specify the result type)
      resultTypes: [OrganicResult, DictionaryResult],
      // Optional: Customize the request using AxiosRequestConfig (e.g., enabling safe search)
      requestConfig: {
        params: {
          safe: "active",   // Enable "safe mode"
        },
      },
    });

    console.log(queryResult)

    return queryResult;
  }
}
