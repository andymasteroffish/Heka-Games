
private var player : GameObject;
var spawner:GameObject;

function Awake(){
	//set player
	player=gameObject.Find("player");
}

function Update () {
}

function OnTriggerEnter(other : Collider) {

	var object= other.gameObject;
	if (object==player){
		spawner.SendMessage("start");
	}

}

function OnTriggerExit(other : Collider) {

	var object= other.gameObject;
	if (object==player){
		spawner.SendMessage("stop");
	}

}