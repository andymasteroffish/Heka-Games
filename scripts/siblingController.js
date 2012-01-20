var controller : CharacterController;
var speed:float;
var followDist:float;	//how close the dream will get to the player
var leftLimit:float;	//no moving further left than this point
var rightLimit:float;	//no moving further left than this point

var hitBox:GameObject;

private var isActive:boolean=false;

private var moving : Vector3 = new Vector3(0,0,0);
private var player : GameObject;


function Awake(){
	//set player and sibling
	player=gameObject.Find("player");
}

function Update () {
	//stop falling if we're on the ground
	if (controller.isGrounded)
		moving.y=0;
			
	//gravity
	moving.y+= -0.1;

	if (isActive){
		//did we bump our head
		if ((controller.collisionFlags & CollisionFlags.Above) != 0)
	        moving.y=0;
	    
	    //if following, follow the player
    	moving.x=0;
    	
    	//see how far the dream is from the player
    	var xDist:float=Mathf.Abs(player.transform.position.x-transform.position.x);
    	if (xDist>followDist){
	    	if (player.transform.position.x<transform.position.x){
	    		if(transform.position.x>leftLimit){
	    			moving.x-=speed;
	    		}
	    	}else{
	    		if(transform.position.x<rightLimit)
	    			moving.x+=speed;
	    	}
    	}
	    
	}
	
	controller.Move(moving);
}


function OnTriggerEnter(other : Collider) {
	var object= other.gameObject;
}

//start the brother following the player and kill the hit box
function startFollow(){
 isActive=true;
 Destroy(hitBox);

}


function disappear(){
	Destroy(gameObject);
}



