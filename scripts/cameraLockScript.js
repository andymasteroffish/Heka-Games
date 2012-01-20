private var gameCamera : GameObject;	//the thing to follow

var offset:Vector3;
var zoom:float;

var areaActive:boolean;	//some lock zones should not happen at first

function Awake(){
	//find the camera
	gameCamera=gameObject.Find("MainCamera");
}

function OnTriggerEnter(other : Collider) {
	var object= other.gameObject;
	if (object.name=="player" && areaActive)
		setAreaLock();
}

function OnTriggerExit (other : Collider) {
	var object= other.gameObject;
	if (object.name=="player" && areaActive)
		endAreaLock();
}


function setAreaLock(){
	var newCameraPos:Vector3=transform.position+offset;
	newCameraPos.z=-100;
	
	gameCamera.SendMessage("setAreaZoom",zoom);
	gameCamera.SendMessage("setAreaLock",newCameraPos);
}

function endAreaLock(){
	gameCamera.SendMessage("endAreaZoom");
	gameCamera.SendMessage("endAreaLock");
}

//turning the lock area on or off
function activateMe(){
	setAreaLock();		//make the effect happen
	areaActive=true;
}
function deactivateMe(){
	areaActive=false;
}