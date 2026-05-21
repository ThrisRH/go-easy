package main

import (
	"fmt"
	"github.com/xuri/excelize/v2"
)

func inspectFile(path string) {
	fmt.Printf("\n=== Inspecting file: %s ===\n", path)
	f, err := excelize.OpenFile(path)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer f.Close()

	sheets := f.GetSheetList()
	fmt.Printf("Sheets: %v\n", sheets)
	if len(sheets) == 0 {
		return
	}

	rows, err := f.GetRows(sheets[0])
	if err != nil {
		fmt.Printf("Error reading rows: %v\n", err)
		return
	}

	fmt.Printf("Total rows: %d\n", len(rows))
	limit := 10
	if len(rows) < limit {
		limit = len(rows)
	}

	for i := 0; i < limit; i++ {
		fmt.Printf("Row %d: %q\n", i+1, rows[i])
	}
}

func main() {
	inspectFile("/Users/tri/Documents/Work/GoEasy/backend/test/excel/Book1.xlsx")
}
