package main

import (    
    "io"    
    "os"
    "fmt"
	"bufio"
	"strconv"    
	"strings"
	"unicode"
	"io/ioutil"
	"os/exec"
)

const ffmpegPath="C:/Program Files/ffmpeg/bin/ffmpeg.exe"
const mainDirectory="C:/Users/Serkan/Desktop/russian_temp"

func main() {
	videos:=GetFileList(mainDirectory)
	for _,video :=range videos{
	ReadStrFile(mainDirectory,video)
	}
}

 type Srt struct {
 	No int
 	StartTime string
 	EndTime string
 	Translation string
 }	

func GetFileList(mainDir string)  []string {	
	files, err := ioutil.ReadDir(mainDir)
	if err != nil {
		panic(err)	
	}
	var videos []string
	for _, file := range files {
		if strings.HasSuffix(file.Name(),".mp4"){	
		videos=append(videos,strings.Split(file.Name(),".mp4")[0])
		} 
	}
	return videos
}

func IsNumeric(s string) (int,bool) {
	val, err := strconv.ParseInt(strings.TrimSpace(s), 10,32)	
	return int(val), err == nil
}
func IsLineWhiteSpace(s string) bool{
	return strings.TrimSpace(s)==""
}
func IsDateInfo(s string) bool {
	return strings.Contains(s,"-->")
}

func isRussianUpper(text string) bool {
	for _, r := range []rune(text) {
	
	 		if unicode.Is(unicode.Cyrillic, r){
				 return true
			 } else {
				 	continue
			 }
	}
	return false
}

func ReadStrFile(mainDirectory string,videoName string ) error {
	f, err := os.Open(mainDirectory+"/"+videoName+".srt")
    if err != nil {
      fmt.Println("error opening file ", err)
      os.Exit(1)
    }
    defer f.Close()
	r := bufio.NewReader(f)	
	var srtSlice []Srt
	srtObj:=Srt{}	
	for {

		line, err := r.ReadString(10) // 0x0A separator = newline

		if err == io.EOF {
			fmt.Println("finished")
			 break
		 } else if err != nil {
			 panic(err)
		 }
		   
		//fmt.Println(line)
		value,result :=IsNumeric(line)
		if result {				
			
			srtObj.No=value					
		} else if IsDateInfo(line){		
			var dates=strings.Split(line,"-->")
			srtObj.StartTime=strings.Replace(dates[0],",",".",-1)
			srtObj.EndTime=strings.TrimSpace(strings.Replace(dates[1],",",".",-1))
		} else if isRussianUpper(line){
			srtObj.Translation=line			
		} else if IsLineWhiteSpace(line){
			srtSlice=append(srtSlice,srtObj)
			
			var splitCode=" -i "+videoName+".mp4"+ " -acodec aac -vcodec libx264 -crf 23 -y  -ss "+ srtObj.StartTime+" -to " +srtObj.EndTime +"  "+videoName+"_"+ strconv.Itoa(srtObj.No) +".mp4"
			fmt.Println(splitCode)
			cmd := exec.Command(ffmpegPath,"-i",mainDirectory+"/"+videoName+".mp4","-acodec", "aac", "-vcodec", "libx264", "-crf", "23" ,"-y",  "-ss",strings.Split(srtObj.StartTime,".")[0],"-to" ,srtObj.EndTime,videoName+"_"+ strconv.Itoa(srtObj.No) +".mp4")	
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr		
			cmd.Run()
			continue
		}
	  }
return nil
}