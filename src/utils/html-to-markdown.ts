import { join } from "path";
import koffi from "koffi";
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

  const html = await axios.get(url, { headers });
  return htmlToMarkdown(html.data);
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