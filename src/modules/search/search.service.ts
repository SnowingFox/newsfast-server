import { htmlToMarkdown, htmlToMarkdownWithUrl } from '@/utils/html-to-markdown';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  search,
  OrganicResult, // Import the result types you need
  DictionaryResult,
  ResultTypes, // Import to filter results by type
  // @ts-ignore
} from "google-sr";
import { GoogleSearchQuery } from './dto/google.dto';
import { SearchResult } from './type';

@Injectable()
export class SearchService {
  async googleSearch(query: GoogleSearchQuery) {
    const queryResult = await search({
      query: query.keyword,
      // Specify the result types explicitly ([OrganicResult] is the default, but it is recommended to always specify the result type)
      resultTypes: [OrganicResult, DictionaryResult],
      // Optional: Customize the request using AxiosRequestConfig (e.g., enabling safe search)
      requestConfig: {
        params: {
          safe: "active",   // Enable "safe mode"
        },
      },
    }) as SearchResult[]

    let result: SearchResult[] = queryResult.map((item) => {
      return {
        ...item,
        url: item.link,
      }
    })

    if (query.format === 'markdown') {
      result = await Promise.all(queryResult.map(async (item) => {
        return {
          ...item,
          url: item.link,
          markdown: await htmlToMarkdownWithUrl(item.link),
        };
      })) as SearchResult[]
    }

    return {
      success: true,
      data: result,
    };
  }
}
