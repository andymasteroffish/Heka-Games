var controller : CharacterController;
var inBedPrefab:GameObject;
var speed:float;
var runSpeed:float;
var followDist:float;	//how close the dream will get to the player
var leftLimit:float;	//no moving further left than this point
var rightLimit:float;	//no moving further left than this point


//before being found by the player, the brother is shouting for help
private var isShouting:boolean=true;	//is the brother still calling out for help
var timeBetweenShouts:float;			//time in seconds between showing word balloons
var shoutTime:float;					//how long each word balloon is displayed for
private var wordBalloonActive:boolean=false;	//is the borther currently saying something?
private var wordBalloonTimer:float;
private var curShout:int=1;				//which shouting image are we using?

var distanceToActivate:float;			//how close the player must be to stop the brother from shouting

//on the way back to the room, the brother syays a few things to the player
var timeBeforeComment:float;			//how long after starting the walk to start talking
private var curComment:int=0;			//which comment we're on
private var commentsDone:boolean=false;	//are the comments done?

private var isActive:boolean=false;
private var moving : Vector3 = new Vector3(0,0,0);
private var player : GameObject;

//when he gets close to the door, the brother runs toward it
private var running:boolean=false;
var runStart:float;				//xlocation where the brother starts running
var runGoal:float;				//xlocation of the door where the brother dissapears



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
	
	//add to the timer
	wordBalloonTimer+=Time.deltaTime;
	
	//handle shouting before the player arives
	if (isShouting){
		//is it time to add a new balloon?
		if (!wordBalloonActive && wordBalloonTimer>timeBetweenShouts){
			wordBalloonActive=true;
			this.SendMessage("showText",curShout);
			
			//switch between the different shouts
			if (++curShout==3)	curShout=1;
		}
		
		//is it time to get rid of one?
		if (wordBalloonActive && wordBalloonTimer>shoutTime){
			wordBalloonActive=false;
			this.SendMessage("killText");
			wordBalloonTimer=0;
		}
		
		//check if the player is clsoe enough to move on to the next phase
		if (Vector3.Distance(transform.position, player.transform.position)<distanceToActivate){
			stopShouting();
		}
	}

	//handle following the player home
	if (isActive){
		//did we bump our head
		if ((controller.collisionFlags & CollisionFlags.Above) != 0)
	        moving.y=0;
	    
	    //if following, follow the player
    	moving.x=0;
    	
    	if (!running){
	    	//see how far the brother is from the player
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
	    	
	    	//check if the brother has reached the running point
	    	if (transform.position.x<runStart)
	    		running=true;
    	}
    	
    	//if the brother is close to the door, just run towards it
    	if (running){
    		moving.x-=runSpeed;
    		
    		//if we hit the door, kill this object and spawn the bedroom brother
    		if (transform.position.x<runGoal){
    			//instantiate the in bed brother
				var newBrother:GameObject=Instantiate(inBedPrefab, transform.position, transform.rotation );
				newBrother.transform.position=Vector3(907,-189,0);
				
				//if there is a word balloon, destroy it
				//if (wordBalloonActive)	Destroy(wordBalloon);
    			
    			//kill this object
    			Destroy(gameObject);
    		}
    			
    	}
    	
    	//see if it is time to make a comment
    	if (!commentsDone && wordBalloonTimer>timeBeforeComment && curComment==0){
    	/*
    		wordBalloonActive=true;
    		//instantiate a word balloon
			wordBalloon=Instantiate(wordBalloonPrefab, transform.position, transform.rotation );
			wordBalloon.transform.Rotate(Vector3(90,180,0));
			//set the image
			wordBalloon.renderer.material.mainTexture = commentPics[curComment];
			*/
			
			curComment++;	//increase the comment
    	}
    	
    	//see if the user advanced the comment
    	if(Input.GetKeyDown(KeyCode.Space) && curComment>0 && !commentsDone){
    		//check if we're done
    		if (curComment==2){
    			//kill the balloon
    			//Destroy(wordBalloon);
    			wordBalloonActive=false;
    			//and mark that we're done
    			commentsDone=true;
    		}
    		
    		else{
	    		//wordBalloon.renderer.material.mainTexture = commentPics[curComment];
	    		//advance curComment
	    		curComment++;
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
 wordBalloonTimer=0;	//reset the timer so he can make comments
}


//called by convo controller when the player starts talking to the brother
function stopShouting(){
	isShouting=false;
	
	//freeze the player
	player.SendMessage("freeze");
	
	//show the start of the conversation
	if (wordBalloonActive){
		this.SendMessage("showText",3);
	}
	
}


