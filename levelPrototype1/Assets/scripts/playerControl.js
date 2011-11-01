var speed : float;
var jumpPower : float;
var controller : CharacterController;
var art:GameObject;	//holds the art and animaitons
var streamSpeed:float;	//how fast the stream moves the player

private var grounded : boolean;
private var moving : Vector3 = new Vector3(0,0,0);
private var frozen : boolean = false;

//different objects it could be touching
private var steepWall:boolean=false;
private var inStream:boolean=false;
private var canClimb:boolean=false;

//climbing
private var climbing:boolean=false;
var climbSpeed:float;

private var hasFollower:boolean=false;	//does the player have a dream following them right now?
private var follower:GameObject;		//the dream following

//bounce room
private var bounceRoomActive:boolean=false;	//becomes true when the player starts using the boucne room
private var bounceMove:Vector3=new Vector3(0,0,0);

function Update () {
	//stop falling if we're on the ground
	if (controller.isGrounded)
		moving.y=0;
	
	//gravity
	if (!climbing)
		moving.y+= -0.1;
		
	if(!frozen){
		//moving
		moving.x=Input.GetAxis("Horizontal")*speed;
		
		//the strema pushes the player to the right
		if (inStream)	moving.x+=streamSpeed;
		
		//start jump The gravity for the button is set super high, so as soon as the player releases the button, vertical goes back to 0
		if(Input.GetAxis("Vertical")!=0 && controller.isGrounded && !steepWall && !inStream && !climbing){
			moving.y=jumpPower;
		}
		
		//move up or down if we're climbing
		if(Input.GetAxis("Vertical")!=0 && canClimb){
			climbing=true;
			if (Input.GetAxis("Vertical")>0)
				moving.y=climbSpeed;
			else
				moving.y=-climbSpeed;
		}
	}
		
	//did we bump our head
	if ((controller.collisionFlags & CollisionFlags.Above) != 0)
        moving.y=-0.2;
	
	if (bounceMove.magnitude>1){
		controller.Move(moving+bounceMove);
		bounceMove*=0.99;
	}else{
		controller.Move(moving);
	}
	
	//stay in place
	controller.transform.position.z=0;
	
}


function OnTriggerEnter(other : Collider) {
	var object= other.gameObject;
	
	//should use a tag here
	if (object.name=="dreamHitBox"){
		//start the convo
		gameObject.Find("lousyDream").SendMessage("startTalk");
	}
	
	if (object.name=="dogHitBox"){
		//start the convo
		gameObject.Find("dogDream").SendMessage("startTalk");
	}
	
	//did the player hit a bounce room bouncer
	if (object.tag=="bouncer"){
		bounceRoomActive=true;
		//bounce the player
		bounceMove=Vector3(0,0,0);
		var distFromMid:float=transform.position.x-object.transform.position.x;
		//get the angle based on how far from the center the jump was
		var angle:float=map(distFromMid,-object.transform.localScale.x,object.transform.localScale.x,Mathf.PI,0);
		//shoot the player off at that angle
		bounceMove.x=Mathf.Cos(angle)*jumpPower;
		moving.y=jumpPower;	//and give some vertical height
		//send a message to the boucner to play its note
		object.SendMessage("makeSound");
	}
	
	if (object.tag=="ladder")
		canClimb=true;
		
	//did the player just enter an area with a different camera zoom?
	if (object.tag=="zoomZone")
		object.SendMessage("setAreaZoom");
}

function OnTriggerExit (other : Collider) {
	var object= other.gameObject;

	if (object.tag=="ladder"){
		canClimb=false;
		climbing=false;
	}
		
	//did the player just leave an area with a different camera zoom?
	if (object.tag=="zoomZone")
		object.SendMessage("endAreaZoom");
}

function OnControllerColliderHit (hit : ControllerColliderHit) {
	
	var body:Rigidbody=hit.collider.attachedRigidbody;
	//get out if it is not a rigidbody
	if (body == null)
        return;
	
	//if this is tagged with steep, make sure the player can't jump
	steepWall=(body.tag=="steep");
		
	//is the player in the stream?
	inStream=(body.tag=="stream");
	
	//check if the player just reached solid ground
	if (bounceRoomActive && body.tag!="bounceRoom"){
		bounceRoomActive=false;
		gameObject.Find("soundPlayer").SendMessage("playAll");
	}
	
}


function freeze(){
	frozen=true;
	moving.x=0;		//don't let the layer keep side to side momentum
}

function unfreeze(){
	frozen=false;
}

function newFollower(newDream:GameObject){
	//release the old dream if there was one
	if (hasFollower){
		follower.SendMessage("stopFollow");
	}
	
	follower=newDream;
	hasFollower=true;
}

function map(x:float,xh:float,xl:float,ah:float,al:float){
	return (  ((x-xl)/(xh-xl)) * (ah-al) + al );
}