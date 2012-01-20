var speed : float;
var controller : CharacterController;
var art:GameObject;	//holds the art and animaitons
var crownArt:GameObject;
var crownArtTexture:Texture;
var streamSpeed:float;	//how fast the stream moves the player

private var grounded : boolean;
private var moving : Vector3 = new Vector3(0,0,0);
private var frozen : boolean = false;

//different objects it could be touching
private var steepWall:boolean=false;
private var canClimb:boolean=false;

//jumping
var gravity:float;
var terminalVelocity:float;
var jumpPower : float;
var jumpTime:int;
var timeBetweenJumps:float;
private var timerBetweenJumps:float=0;
private var jumpTimer:int=0;
private var startFall:boolean=false;
private var jumping:boolean=false;
//air contol only in one direction during the jump
private var jumpDirSet:boolean=false;
private var jumpDir:int;				//this will be either -1 or 1 for left or right

//climbing
private var climbing:boolean=false;
var climbSpeed:float;

private var hasFollower:boolean=false;	//does the player have a dream following them right now?
private var follower:GameObject;		//the dream following

//bounce room
var bouncePower:float;
private var bounceRoomActive:boolean=true;	//becomes true when the player starts using the bounce room
private var bounceMove:Vector3=new Vector3(0,0,0);

//art
var artPlane:GameObject;

function Update () {
	//gravity
	if (!climbing)
		moving.y+= gravity;
	//don't let the downward force go beyond the terminal velocity
	moving.y=Mathf.Max(moving.y,terminalVelocity);
	
		
	if(!frozen){
		//moving horizontal
		moving.x=Input.GetAxis("Horizontal")*speed;
		/*
		if (jumpTimer<=0)
			moving.x=Input.GetAxis("Horizontal")*speed;
		else{
			//set the jump dir if it hasn't been yet
			if(!jumpDirSet && Input.GetAxis("Horizontal")!=0){
				jumpDirSet=true;
				if (Input.GetAxis("Horizontal")>0)	jumpDir=1;
				else								jumpDir=-1;
			}
			if (Input.GetAxis("Horizontal") * jumpDir > 0){
				moving.x=Input.GetAxis("Horizontal")*speed;
			}
		}
		*/
		
		//reset jump timer if we're on solid ground
		jumpTimer--;
		if (controller.isGrounded && !steepWall){
			//don't stop the player if they are moving up
			//walking up a slope will give velocity, though, so count it as grounded if the jumpTimer is inactive
			if (controller.velocity.y<=0 || jumpTimer<4){
				if(jumping){
					timerBetweenJumps=0;
					jumping=false;
				}
				jumpTimer=jumpTime;
				jumpDirSet=false;
				moving.y=0;
				timerBetweenJumps+=Time.deltaTime;
			}
		}else{
			if (Input.GetAxis("Vertical")<=0){
				startFall=true;
				jumpTimer=0;
			}
		}
		
		//check if the up button is being pressed, the jump tiemr still has some power in it and there has been enough time between jumps
		//the jump timer gets cut off early, because it makes for a nicer arc
		if (Input.GetAxis("Vertical")>0 && jumpTimer>4 && timerBetweenJumps>=timeBetweenJumps){
			jumping=true;
			controller.Move(Vector3.up*jumpPower*jumpTimer);
			startFall=false;
			moving.y=0;
		}
		/*
		if(Input.GetAxis("Vertical")<=0 && !startFall){
			startFall=true;
			jumpTimer=0;
		}
		*/
		
		
		//move up or down if we're climbing
		if(Input.GetAxis("Vertical")!=0 && canClimb){
			climbing=true;
			if (Input.GetAxis("Vertical")>0)
				moving.y=climbSpeed;
			else
				moving.y=-climbSpeed;
		}
	}
		
	//did we bump our head?
	if ((controller.collisionFlags && CollisionFlags.Above) != 0 && controller.velocity.y>0){
        moving.y=-0.2;
        jumpTimer=0;	//end the jump if the player was
    }
	
	if (bounceMove.magnitude>1){
		print("bounce move");
		controller.Move(moving+bounceMove);
		bounceMove*=0.99;
	}else{
		controller.Move(moving);
	}
	
	//have the art face the right direction
	if (Input.GetAxis("Horizontal")<0)
		artPlane.renderer.material.mainTextureScale=Vector2(1,1);
	if (Input.GetAxis("Horizontal")>0)
		artPlane.renderer.material.mainTextureScale=Vector2(-1,1);
	
	//stay in place in 2d plane
	controller.transform.position.z=0;
	
}


function OnTriggerEnter(other : Collider) {
	var object= other.gameObject;
	
	//did the player hit a bounce room bouncer
	if (object.tag=="bouncer"){
		print("hit bouncer");
		bounceRoomActive=true;
		//bounce the player
		bounceMove=Vector3(0,0,0);
		var distFromMid:float=transform.position.x-object.transform.position.x;
		//get the angle based on how far from the center the jump was
		var angle:float=map(distFromMid,-object.transform.localScale.x,object.transform.localScale.x,Mathf.PI,0);
		//shoot the player off at that angle
		bounceMove.x=Mathf.Cos(angle)*bouncePower;
		moving.y=bouncePower;	//and give some vertical height
		//send a message to the boucner to play its note
		object.SendMessage("makeSound");
	}
	
	if (object.tag=="ladder")
		canClimb=true;
		
	//did the player just pick up the crown?
	if (object.name=="crownTrigger"){
		//get rid of the crown in toy 1
		Destroy(gameObject.Find("toy1Crown"));
		//add the crown to the player by changing the blank texture of the crownArt plane to be the one with the crown
		crownArt.renderer.material.mainTexture = crownArtTexture;
	}
		
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
	//steepWall=(body.tag=="steep");
		
	//check if the player just reached solid ground
	if (bounceRoomActive && body.tag=="Toy2StartPlatform"){
		bounceRoomActive=false;
		gameObject.Find("bounceSoundPlayer").SendMessage("testNoteOrder");
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
	/*
	if (hasFollower){
		follower.SendMessage("stopFollow");
	}
	*/
	
	follower=newDream;
	hasFollower=true;
}

function map(x:float,xh:float,xl:float,ah:float,al:float){
	return (  ((x-xl)/(xh-xl)) * (ah-al) + al );
}

//let the player jump again if they just touched a ball
function ballBounce(){
    jumpTimer=jumpTime;
    moving.y=0;
}

function teleport(target:Vector3){
	controller.transform.position=target;
}
