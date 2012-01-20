var target : Transform;	//the thing to follow
var springiness:float=4;

var baseZoom:float;				//the default zoom for the world
private var normZoom:float;
var adjust : Vector3;	//how far back to stay and other adjustments
var rot: float;

private var zoomGoal:float;

@System.NonSerialized

private var locked:boolean=false;
private var lockedGoal:Vector3;
private var zoomInLock:boolean=false;	//remembers that the camera was locked if exiting a zoom from inside a locked zone

function Awake(){
	normZoom=baseZoom;
	zoomGoal=normZoom;
}

function LateUpdate () {
	var goal : Vector3 = target.position;
	goal+=adjust;
	
	//if the camera is locked, keep it in the same place
	if (locked)
		goal=lockedGoal;

	
	//set the zoom
	camera.orthographicSize=Mathf.Lerp(camera.orthographicSize,zoomGoal, Time.deltaTime * springiness);
	
	//set the rotation
	transform.rotation.x=rot;
	//have the camera follow just behind the player
	transform.position=Vector3.Lerp (transform.position, goal, Time.deltaTime * springiness);
	
	
}

function startZoom(newZoom:float){
	zoomGoal=newZoom;
	if (locked){
		locked=false;
		zoomInLock=true;
	}
}

function endZoom(){
	zoomGoal=normZoom;
	if (zoomInLock){
		zoomInLock=false;
		locked=true;
	}
}

//temporarily alters the normZoom
function setAreaZoom(newZoom:float){
	normZoom=newZoom;
	zoomGoal=newZoom;
}

//sets normZoom back to default
function endAreaZoom(){
	normZoom=baseZoom;
	zoomGoal=normZoom;
}

//locks the camera to not follow the player
function setAreaLock(location:Vector3){
	locked=true;	
	lockedGoal=location;
}

//ends the  lock on camera movement
function endAreaLock(){
	locked=false;
}

//jumps the camera to a new location
function teleport(target:Vector3){
	transform.position=target;
}
	