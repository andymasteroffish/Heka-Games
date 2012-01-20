var controller : CharacterController;
var speed:float;
var jumpPower:float;
var jumpLoss:float;
var followDist:float;	//how close the dream will get to the player
var minDist:float;		//how close the player must be to thwe dream for it to follow
var yFollowDist:float;	//how far above the player the dog likes to stay

private var moving : Vector3 = new Vector3(0,0,0);
private var following : boolean= false;
private var player : GameObject;

private var jump:float;
private var jumpStart:boolean = false;;
var pauseTime:float;
var timeBetweenJumps:float;
private var touchDown:boolean=false;
private var groundTimer:float;
private var topTimer:float;	//time spent not moving at the top of the jump

private var isActive:boolean=true;

var hitBox:GameObject;

function Awake(){
	//set player
	player=gameObject.Find("player");
}

function Update () {
	if(isActive){
		//stop falling if we're on the ground
		if (controller.isGrounded)
			moving.y=0;
			
		
		//gravity
		moving.y+= -0.04;
		
		//did we bump our head
		if ((controller.collisionFlags & CollisionFlags.Above) != 0){
	        moving.y=-0.01;
	    }
	    
	    //if following, follow the player
	    if (following){
		    if (controller.isGrounded){
				if (!touchDown){
					touchDown=true;
					groundTimer=timeBetweenJumps;
				}
				groundTimer-=Time.deltaTime;
				if (groundTimer<0){ 
					//JUMP!
					touchDown=false;
					jumpStart=true;
					moving.y=0;
					jump=jumpPower;
				}
			}
			
			jump-=jumpLoss;
			if (jump<0){
				jump=0;
			}
			
			moving.y+=jump;
			
			if (moving.y<0 && jumpStart){
				topTimer=pauseTime;
				jumpStart=false;
			}
			
			if (topTimer>0){
				topTimer-=Time.deltaTime;
				moving.y=0;
			}
		
	    	moving.x=0;
	    	
	    	//see how far the dream is from the player
	    	if (!touchDown){
		    	var distFromPlayer:float= Vector3.Distance(player.transform.position, transform.position);
		    	var xDist:float=Mathf.Abs(player.transform.position.x-transform.position.x);
		    	if (xDist>followDist && distFromPlayer<minDist){
			    	if (player.transform.position.x<transform.position.x)
			    		moving.x-=speed;
			    	else
			    		moving.x+=speed;
		    	}
	    	}
	    }
	        
	    controller.Move(moving);
    }
    
    //stay locked in the z plane
    controller.transform.position.z=0;
	
}


function OnTriggerEnter(other : Collider) {
	var object= other.gameObject;
	
	//should use a tag here
	if (object.name=="siblingHitBox"){
		Destroy(gameObject);
		//tell the sibling to change image
		gameObject.Find("siblingArt").SendMessage("changePic",1);
	}
	
	
	
}

function startFollow(){
	Destroy(hitBox);
	following=true;
}

function stopFollow(){
	following=false;
	//should probably put the hit box back
}

function endCustom(){
	isActive=false;
}