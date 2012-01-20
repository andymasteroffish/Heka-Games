var gameCamera : GameObject;	//the thing to follow

var zoom:float;

var areaActive:boolean;	//some zoom zones should not happen at first

function Awake(){
	//find the camera
	gameCamera=gameObject.Find("MainCamera");
}

function OnTriggerEnter(other : Collider) {
	var object= other.gameObject;
	if (object.name=="player")
		setAreaZoom();
}

function OnTriggerExit (other : Collider) {
	var object= other.gameObject;
	if (object.name=="player")
		endAreaZoom();
}

function setAreaZoom(){
	gameCamera.SendMessage("setAreaZoom",zoom);
}

function endAreaZoom(){
	gameCamera.SendMessage("endAreaZoom");
}


//turning the zoom area on or off
function activateMe(){
	setAreaZoom();		//make the effect happen
	areaActive=true;
}
function deactivateMe(){
	areaActive=false;
}