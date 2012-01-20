var controller : CharacterController;
var speed:float;
var followDist:float;	//how close the dream will get to the player
var minDist:float;		//how close the player must be to thwe dream for it to follow
var siblingValue:float;
var leftLimit:float;	//no moving further left than this point
var rightLimit:float;	//no moving further left than this point

private var isActive:boolean=false;

private var moving : Vector3 = new Vector3(0,0,0);
private var following : boolean= true;
private var player : GameObject;

private var hourglass: GameObject;

private var timeLeft:boolean =true;

function Awake(){
	//set player and sibling
	player=gameObject.Find("player");
	hourglass=gameObject.Find("hourglass");
}

function Update () {
	if (isActive){
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
		    	if (player.transform.position.x<transform.position.x){
		    		if(transform.position.x>leftLimit)
		    			moving.x-=speed;
		    	}else{
		    		if(transform.position.x<rightLimit)
		    			moving.x+=speed;
		    	}
	    	}
	    }
	    
	    controller.Move(moving);
	
	}
}


function OnTriggerEnter(other : Collider) {
	var object= other.gameObject;

	if (object.name=="siblingDoorArea"){
		disappear();
	}

}

//called when the dream goes through the shift zone to make it normal
function startNormal(){
	//print("bring it back");
	isActive=true;
}

function disappear(){
	if (timeLeft){
		hourglass.SendMessage("addDream",siblingValue);
		Destroy(gameObject);
	}
}

//called when the hourglass runs out
function timeIsUp(){
	timeLeft=false;
}

