import { join } from "path";
import * as koffi from "koffi";
import axios from "axios";

const goExecutablePath = join(
  process.cwd(),
  "html-to-markdown",
  "html-to-markdown.so",
);

const lib = koffi.load(goExecutablePath);
const convert = lib.func("ConvertHTMLToMarkdown", "string", ["string"]);

export const htmlToMarkdownWithUrl = async (url: string) => {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
  }

  let html;
  try {
    const response = await axios.get(url, {
      headers,
      validateStatus: (status) => status < 500 // Accept any status < 500
    });

    if (response.status === 403) {
      return 'Access Denied - Could not retrieve content';
    }

    html = response.data;
  } catch (error) {
    console.error(`Error fetching URL ${url}:`, error.message);
    return 'Error retrieving content';
  }

  return htmlToMarkdown(html);
}

export const htmlToMarkdown = async (html: string) => {
  return new Promise((resolve, reject) => {
    convert.async(html, (err: Error, res: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  })
}