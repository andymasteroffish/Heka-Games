var controller : CharacterController;
var speed:float;
var jumpPower:float;
var followDist:float;	//how close the dream will get to the player
var minDist:float;		//how close the player must be to thwe dream for it to follow
var yFollowDist:float;	//how far above the player the dog likes to stay

private var moving : Vector3 = new Vector3(0,0,0);
private var following : boolean= false;
private var player : GameObject;


var hitBox:GameObject;

function Awake(){
	//set player
	player=gameObject.Find("player");
}

function Update () {
	//stop falling if we're on the ground
	if (controller.isGrounded)
		moving.y=0;
	
	
	//gravity
	moving.y+= -0.1;
	
	//did we bump our head
	if ((controller.collisionFlags & CollisionFlags.Above) != 0)
        moving.y=0;
    
    //if following, follow the player
    if (following){
    	moving.x=0;
    	
    	//see how far the dream is from the player
    	var distFromPlayer:float= Vector3.Distance(player.transform.position, transform.position);
    	var xDist:float=Mathf.Abs(player.transform.position.x-transform.position.x);
    	if (xDist>followDist && distFromPlayer<minDist){
	    	if (player.transform.position.x<transform.position.x)
	    		moving.x-=speed;
	    	else
	    		moving.x+=speed;
    	}
    	
    	//jump if the player is above us
    	var yDist:float=player.transform.position.y-transform.position.y;
    	if (yDist>yFollowDist){
    		moving.y=jumpPower;
    	}
    	
    	if ((controller.collisionFlags & CollisionFlags.Above) != 0)
    		moving.y=-jumpPower;
    	
    }
        
    controller.Move(moving);
	
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
