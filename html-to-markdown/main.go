package main

import (
	"log"
	"C"

	htmltomarkdown "github.com/JohannesKaufmann/html-to-markdown/v2"
)

//export ConvertHTMLToMarkdown
func ConvertHTMLToMarkdown(html *C.char) *C.char {
	markdown, err := htmltomarkdown.ConvertString(C.GoString(html))
	if err != nil {
		log.Fatal(err)
	}

	return C.CString(markdown)
}

func main() {

}

