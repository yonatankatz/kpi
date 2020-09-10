package main

import (
	"fmt"
	"io/ioutil"
	_ "io/ioutil"
	"log"
	_ "log"
	"net/http"
	"os"
	_ "os"
	"path/filepath"
	"strings"
	"sync"
)

var dataFolder = "./data"
var mutex = &sync.RWMutex{}

func fileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}

func readFromFile(filename string, defaultVal string) string {
	if !fileExists(dataFolder + "/" + filename) {
		return writeToFile(filename, defaultVal);
	}
	content, err := ioutil.ReadFile(dataFolder + "/" + filename)
	if err != nil {
		log.Fatal(err)
	}
	var text = string(content)
	return text
}

func writeToFile(filename string, content string) string {
	f, err := os.Create(dataFolder + "/" + filename)

	if err != nil {
		log.Fatal(err)
	}

	defer f.Close()

	_, err2 := f.WriteString(content)

	if err2 != nil {
		log.Fatal(err2)
	}
	return content;
}

func handleRequest(w http.ResponseWriter, req *http.Request) {
	filenames, ok := req.URL.Query()["filename"]
	var filename string
	if filename = ""; ok {
		filename = filenames[0]
	}
	defaultVals, ok := req.URL.Query()["default"]
	var defaultVal string
	if defaultVal = ""; ok {
		defaultVal = defaultVals[0]
	}
	if req.Method == http.MethodGet {
		mutex.RLock()
		var content = readFromFile(filename, defaultVal)
		mutex.RUnlock();
		fmt.Fprintf(w, content)
	}
	if req.Method == http.MethodPost {
		mutex.Lock()
		body, _ := ioutil.ReadAll(req.Body)
		bodyAsString := string(body)
		var content = writeToFile(filename, bodyAsString)
		mutex.Unlock()
		fmt.Fprintf(w, content)
	}
	if req.Method == http.MethodDelete {
		mutex.Lock()
		os.Remove(filename)
		mutex.RUnlock();
		fmt.Fprintf(w, "{\"message\":\"deleted\"}")
	}
}

func initRequest(w http.ResponseWriter, req *http.Request) {
	mutex.Lock()
	var files []string
	err := filepath.Walk(dataFolder, func(path string, info os.FileInfo, err error) error {
		if (!info.IsDir()) {
			files = append(files, filepath.Base(path))
		}
		return nil
	})
	if err != nil {
		panic(err)
	}
	if files == nil {
		fmt.Fprintf(w, "{}")
	} else {
		var bodyAsString string
		bodyAsString = "{"
		for _, file := range files {
			fileContent := readFromFile(file, "")
			if fileContent != "" {
				bodyAsString = bodyAsString + "\"" + file + "\": " + fileContent + ","
			}
		}
		bodyAsString = bodyAsString[:(len(bodyAsString) - 1)] + "}"
		fmt.Fprintf(w, bodyAsString)
	}
	mutex.Unlock()
}


func main() {
	argsWithoutProg := os.Args[1:]
	var port = "8090"
	for _, element := range argsWithoutProg {
		if strings.HasPrefix(element, "port=") {
			port = element[5:]
		}
	}

	if _, err := os.Stat(dataFolder); os.IsNotExist(err) {
		os.Mkdir(dataFolder, os.ModePerm)
	}
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)
	http.HandleFunc("/api/", handleRequest)
	http.HandleFunc("/api/get-all", initRequest)

	http.ListenAndServe(":" + port, nil)
}
