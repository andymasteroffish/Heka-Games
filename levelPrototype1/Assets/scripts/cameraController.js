var target : Transform;	//the thing to follow
var springiness:float=4;

var baseZoom:float;				//the default zoom for the world
private var normZoom:float;
var adjust : Vector3;	//how far back to stay and other adjustments
var rot: float;

private var zoomGoal:float;

@System.NonSerialized
var zoom:Vector3 =new Vector3(0,0,0);

function Awake(){
	normZoom=baseZoom;
	zoomGoal=normZoom;
}

function LateUpdate () {
	var goal : Vector3 = target.position;
	goal+=adjust;
	goal+=zoom;
	
	//set the zoom
	camera.orthographicSize=Mathf.Lerp(camera.orthographicSize,zoomGoal, Time.deltaTime * springiness);
	
	//set the rotation
	transform.rotation.x=rot;
	//have the camera follow just behind the player
	transform.position=Vector3.Lerp (transform.position, goal, Time.deltaTime * springiness);
	
}

function startZoom(newZoom:float){
	zoomGoal=newZoom;
}

function endZoom(){
	zoomGoal=normZoom;
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