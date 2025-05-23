// import html2md from 'html-to-md'
// import axios from 'axios'
// import fs from 'fs'

import { join } from "path";
import koffi from "koffi";
import fs from "fs";

// const headers = {
//   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//   'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
//   'Accept-Language': 'en-US,en;q=0.9',
//   'Accept-Encoding': 'gzip, deflate, br',
//   'Connection': 'keep-alive'
// }

// const baidu = await axios.get('https://www.baidu.com', { headers })

// fs.writeFileSync('baidu.txt', baidu.data)


const goExecutablePath = join(
  process.cwd(),
  "html-to-markdown",
  "html-to-markdown.so",
);

const lib = koffi.load(goExecutablePath);
const convert = lib.func("ConvertHTMLToMarkdown", "string", ["string"]);

const html = fs.readFileSync(join(process.cwd(), "baidu.txt"), "utf-8")

convert.async(html, (err: Error, res: string) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res)
  }
})