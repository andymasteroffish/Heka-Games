var gameCamera : GameObject;	//the thing to follow

var zoom:float;
//var adjust : Vector3;	//how far back to stay and other adjustments

function setAreaZoom(){
	gameCamera.SendMessage("setAreaZoom",zoom);
}

function endAreaZoom(){
	gameCamera.SendMessage("endAreaZoom");
}