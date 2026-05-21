package main

import (
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"bytes"
	"github.com/xuri/excelize/v2"
)

func main() {
	// Đọc file nhị phân
	data, err := ioutil.ReadFile("/Users/tri/Documents/Work/GoEasy/backend/test/excel/Book1.xlsx")
	if err != nil {
		fmt.Printf("ERROR ReadFile: %v\n", err)
		return
	}

	// Mã hoá sang Base64
	base64Str := base64.StdEncoding.EncodeToString(data)
	fmt.Printf("Base64 string length: %d\n", len(base64Str))

	// Giải mã Base64
	decodedData, err := base64.StdEncoding.DecodeString(base64Str)
	if err != nil {
		fmt.Printf("ERROR DecodeString: %v\n", err)
		return
	}

	// Đọc bằng excelize
	f, err := excelize.OpenReader(bytes.NewReader(decodedData))
	if err != nil {
		fmt.Printf("ERROR OpenReader: %v\n", err)
		return
	}
	defer f.Close()

	fmt.Printf("SUCCESS! Sheets: %v\n", f.GetSheetList())
}
