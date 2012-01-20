
function OnTriggerEnter(other : Collider) {
	var object= other.gameObject;
	if (object.tag=="dream"){
		object.SendMessage("startNormal");
		object.SendMessage("endCustom");
	}
}