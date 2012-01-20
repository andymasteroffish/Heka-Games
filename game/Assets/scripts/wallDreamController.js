var controller : CharacterController;
var speed:float;
var jumpPower:float;
var followDist:float;	//how close the dream will get to the player
var minDist:float;		//how close the player must be to thwe dream for it to follow
var yFollowDist:float;	//how far above the player the dog likes to stay
var art:GameObject;
var hitBox:GameObject;

private var isActive:boolean=true;
private var moving : Vector3 = new Vector3(0,0,0);
private var following : boolean= false;
private var player : GameObject;
private var grounded:boolean = false;

function Awake(){
	//set player
	player=gameObject.Find("player");
}

function Update () {
	if (isActive){
		//stop falling if we're on the ground
		if (controller.collisionFlags & CollisionFlags.Sides){
			moving.x=0;
			grounded=true;
		}
		else{
			grounded=false;
		}
		
		
		//sideways gravity
		moving.x+= -0.1;
		
	    
	    //if following, follow the player
	    if (following){
	    	moving.y=0;
	    	
	    	//see how far the dream is from the player
	    	var yDist:float=Mathf.Abs(player.transform.position.y-transform.position.y);
	    	if (yDist>followDist){
	    		
		    	if (player.transform.position.y<transform.position.y)
		    		moving.y-=speed;
		    	else
		    		moving.y+=speed;
	    	}
	    	
	    	//jump if the player is above us
	    	if (Input.GetAxis("Vertical")!=0 && grounded){
	    		moving.x=jumpPower;
	    	}
	    }   
	    controller.Move(moving);
	    
	}
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
	//flip the image
	//Vector3(90,180,0)
	art.transform.eulerAngles=Vector3(90,180,0);
	art.transform.position.x+= -14.46;
	art.transform.position.y+= 10.49;
}
