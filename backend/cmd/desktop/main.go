package main

import (
	"log"
	"goeasy/internal/bootstrap"
	"goeasy/internal/wailsapp"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

func main() {
	// Initialize backend services if needed
	bootstrap.Run()

	// Create an instance of the app structure
	app := wailsapp.NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "goeasy",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: wailsapp.Assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.Startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		log.Fatal(err)
	}
}
