//this should be on a trigger object

var playerTarget:GameObject;
var cameraTarget:GameObject;

var messageTexture:Texture;
var disabledMessageTexture:Texture;
var message:GameObject;
var messageYOffset:float;
private var curMessage:GameObject;

private var player : GameObject;
private var gameCamera : GameObject;

private var canTeleport:boolean=false;

private var buttonWasDown:boolean=false;
private var disabled:boolean=false;

function Awake(){
	player=gameObject.Find("player");
	gameCamera=gameObject.Find("MainCamera");
}

function Update () {

	//if the player is there and pressing space, teleport them
	if (Input.GetAxis("Jump")>0 && canTeleport && !buttonWasDown && !disabled){
		player.SendMessage("teleport",playerTarget.transform.position);
		gameCamera.SendMessage("teleport",cameraTarget.transform.position);
	}
	
	if (buttonWasDown){
		if (Input.GetAxis("Jump")<=0)
			buttonWasDown=false;
	}
}

function OnTriggerEnter(other : Collider) {
	var object= other.gameObject;
	
	if (object.name=="player"){
		//if(!disabled)
			canTeleport=true;
		
		if (Input.GetAxis("Jump")>0){
			buttonWasDown=true;
		}
		
		//create the message
		curMessage=Instantiate(message,transform.position, transform.rotation);
		curMessage.transform.position.y+=messageYOffset;
		curMessage.transform.Rotate(Vector3(90,180,0));
		//put the right texture on it
		if (!disabled){
			curMessage.renderer.material.mainTexture =messageTexture;
		}else{
			curMessage.renderer.material.mainTexture =disabledMessageTexture;
		}
	}
	
}

function OnTriggerExit (other : Collider) {
	var object= other.gameObject;

	if (object.name=="player"){
		canTeleport=false;
		
		//kill the message
		Destroy(curMessage);
	}
	
}

function enable(){
	disabled=false;
	buttonWasDown=true;
}

function disable(){
	disabled=true;
	canTeleport=false;
}
