//this script just tells a game object whent he player has passed into it

var target : GameObject;	//the thing to follow

function Awake(){

}

function OnTriggerEnter(other : Collider) {
	var object= other.gameObject;
	if (object.name=="player")
		target.SendMessage("playerEnter");
}

function OnTriggerExit (other : Collider) {
/*
	var object= other.gameObject;
	if (object.name=="player" && areaActive)
		endAreaLock();
*/
}

