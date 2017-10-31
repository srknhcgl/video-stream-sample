/** 
* You can manipulate the video here
* For example: Uncomment the code below and in the index to get a Start/Stop button
*/
function init() {
   const VP = document.getElementById('videoPlayer')
   const VS = document.getElementById("videoSrc")
   const VPToggle = document.getElementById('toggleButton')
   const VPSubtitle = document.getElementById('txtSrt')
   const VPNext = document.getElementById('btnNext')
}
document.addEventListener('DOMContentLoaded', init, false);

 $(function(){
   const VPj = $("#videoPlayer")
   const VSj = $("#videoSrc")
   const VPTogglej = $("#toggleButton")
   const VPSubtitlej = $("#txtSrt")
   const VPNextj = $("#btnNext")
   const VPToggleji= VPTogglej.find(">i");  
   const DivSubtitlej =$("#innerSubTitle");
   const IBookIco=$("#bookIco");
//////////////////////////////////////////

//VPj.hover(hoverVideo, hideVideo);

/*function hoverVideo(e) {	  
	var isVisible=VPTogglej.is(":visible");
	debugger
	if(!isVisible)
    {
    	VPTogglej.show(); 
    	VPNextj.show();
	}
}

function hideVideo(e) {	
	var isVisible=VPTogglej.is(":visible");
	debugger
	if(e.type!="mouseleave" && isVisible)
    {
	    VPTogglej.hide(); 
	    VPNextj.hide();
	}
}*/
   
//////////////////////////////////////////
  VPTogglej.click(function(){    
  
    if(VPToggleji.hasClass("fa-play-circle-o"))
    {
      VPToggleji.removeClass("fa-play-circle-o");
      VPToggleji.addClass("fa-pause-circle-o");
    }
    else if(VPToggleji.hasClass("fa-pause-circle-o")){
      VPToggleji.removeClass("fa-pause-circle-o");
      VPToggleji.addClass("fa-play-circle-o");
    }

    if (VPj[0].paused) {      
      VPj[0].play();
     }
     else {      
      VPj[0].pause();
    }
  });
///////////////////////////////////////////
VPj.on("play",function(){
  VPToggleji.removeClass("fa-play-circle-o");
  VPToggleji.addClass("fa-pause-circle-o");
});
//////////////////////////////////////////
VPj.on("pause",function(){
  VPToggleji.removeClass("fa-pause-circle-o");
  VPToggleji.addClass("fa-play-circle-o");
});
//////////////////////////////////////////
VPNextj.click(function() {    
   
     xmlhttp = new XMLHttpRequest();
     xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
           if (xmlhttp.status == 200) {
               var data=JSON.parse(xmlhttp.responseText);
               
               VSj.attr('src',data.currentUrl+'video/'+data.videoId);                  
               VSj.attr("data-id", data.videoId);
               VPj[0].load();
               VPj[0].play();

               DivSubtitlej.text('');
               IBookIco.show();
           }
           else if (xmlhttp.status == 400) {alert('There was an error 400');}
           else {alert('something else other than 200 was returned');}
        }
    };
    xmlhttp.open("GET", "/next", true);
    xmlhttp.send();
   });
//////////////////////////////////////////
 VPSubtitlej.click(function() {     
   var id=VSj.attr("data-id");   
   xmlhttp = new XMLHttpRequest();
   xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
           if (xmlhttp.status == 200) {
               var data=JSON.parse(xmlhttp.responseText);               
               DivSubtitlej.text(data.data);
               IBookIco.hide();
           }
           else if (xmlhttp.status == 400) {alert('There was an error 400');}
           else {alert('something else other than 200 was returned');}
        }
    };
    xmlhttp.open("GET", "/subtitle/"+id, true);
    xmlhttp.send();
   });
//////////////////////////////////////////
VPNextj.click();
})



