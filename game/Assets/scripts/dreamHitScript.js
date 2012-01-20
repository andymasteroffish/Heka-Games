var parent : Transform;	//the dream this goes with


function OnTriggerEnter(other : Collider) {
	var object= other.gameObject;
	if (object.name=="player"){
		parent.SendMessage("startTalk");
	}
}