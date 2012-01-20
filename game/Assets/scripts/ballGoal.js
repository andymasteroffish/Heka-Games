var increase:float;	//how much further the goal moves up with each goal
var sinkPerSec:float;
var yGoal:float;	//how high up the goal goes to win

var art:GameObject;	//the plane holding the art for the goal

private var startY:float;

function Awake(){

	startY=transform.position.y;
}

function Update () {
	if (transform.position.y>startY)
		transform.position.y-=sinkPerSec*Time.deltaTime;
		
	//keep the art in place
	art.transform.position.x=transform.position.x;
	art.transform.position.y=transform.position.y;
	

}


function OnCollisionEnter(collision : Collision) {
}


function OnTriggerEnter(other : Collider) {
}

function scoreGoal(){
	transform.position.y+=increase;
}