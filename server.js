const express = require('express')
const fs = require('fs')
const path = require('path')
const util=require('util')
const app = express()
const url = require('url')
const videoPath=util.format('assets/video')
const subtitlePath=util.format('assets/subtitle')
const session=require("express-session")

app.use(express.static(path.join(__dirname, 'public')))
//app.use(express.static(application_root));

app.use(session({
  secret: "Özel-Anahtar",
  resave: false,
  saveUninitialized: true,
}));

app.get('/', function(req, res) {  
  res.sendFile(path.join(__dirname + '/index.htm'))
});

app.get('/next',function(req,res){
	var host=req.get('host');
  var currentUrl=req.protocol + '://' + host  +'/'; 

  if(req.get('referer')!=undefined){
    currentUrl=req.get('referer');
    }
	
  var videoId=getNextVideoId(req);
	res.json({currentUrl, "videoId":videoId});
	});

function getNextVideoId(req){
  if(req.session.fileList==undefined || req.session.fileList.length==0 ){
    req.session.fileList=fs.readdirSync(videoPath);
  }
  
  var index=Math.floor(Math.random()*req.session.fileList.length);
  var videoName=req.session.fileList[index];
  req.session.fileList.splice(index,1);
  return videoName.substring(0,videoName.length-4);
}

app.get('/subtitle/:videoId',function(req,res){
	console.log(req.params.videoId)
	const path = util.format('%s/%s.srt',subtitlePath,req.params.videoId)
	fs.readFile(path, 'utf8', function (err,data) {
  	if (err) {return console.log(err);}
  	console.log(data);
 	 res.json({data});
	});
		
})

app.get('/video/:videoId', function(req, res) {	
  const path = util.format('%s/%s.mp4',videoPath,req.params.videoId)
  console.log('----------'+path);
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})

app.listen(3000, function () {
  console.log('Listening on port 3000!')
})