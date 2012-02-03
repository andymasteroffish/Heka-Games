var controller : CharacterController;
var inBedPrefab:GameObject;
var gravity:float;
var speed:float;
var runSpeed:float;
var followDist:float;	//how close the dream will get to the player

private var wordBalloonActive:boolean=false;	//is the borther currently saying something?
private var wordBalloonTimer:float;

//before being found by the player, the brother is shouting for help
private var isShouting:boolean=true;	//is the brother still calling out for help
var timeBetweenShouts:float;			//time in seconds between showing word balloons
var shoutTime:float;					//how long each word balloon is displayed for
private var curShout:int=1;				//which shouting image are we using?
var distanceToActivate:float;			//how close the player must be to stop the brother from shouting

//conversation with player
var waitTime:float;		//how many seconds between bubbles
private var isTalking:boolean=false;
private var curTalk=0;

//on the way back to the room, the brother syays a few things to the player
var timeBeforeComment:float;			//how long after starting the walk to start talking
private var curComment:int=5;			//which comment we're on. These comments start on balloon 5
private var commentsDone:boolean=false;	//are the comments done?

private var isActive:boolean=false;
private var moving : Vector3 = new Vector3(0,0,0);
private var player : GameObject;

//when he gets close to the door, the brother runs toward it
private var running:boolean=false;
var door:GameObject;			//guage running based on the door location
var runStart:float;				//how far fro the door the brother will be when he starts running

//finally, the sibling ends in bed
var bedPos:Vector3;	//location of the bed
private var inBed:boolean=false;

function Awake(){
	//set player and sibling
	player=gameObject.Find("player");
}

function Update () {
	//don't apply physics if the brother is in bed
	if(!inBed){
		//stop falling if we're on the ground
		if (controller.isGrounded)
			moving.y=0;
				
		//gravity
		moving.y+= -gravity;
		
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
			
			//check if the player is close enough to move on to the next phase
			if (Vector3.Distance(transform.position, player.transform.position)<distanceToActivate){
				stopShouting();
			}
			
		}
		
		
		//handle the convo with the player
		if (isTalking){
			if (!wordBalloonActive){
				//is it time to add a new balloon?
				if (wordBalloonTimer>waitTime){
					curTalk++;	//move to next phase
					wordBalloonActive=true;	//set that there is a balloon
					
					//after initial word from brother, player responds
					if (curTalk==1)
						player.SendMessage("showText",2);	//"You shouldn't be out here
					if (curTalk==2)
						this.SendMessage("showText",4);		//"well I needed dreams"
				}
				
			}
			else if (Input.GetKeyDown(KeyCode.Space)){
				//when the user presses space, move on to the next balloon
				//kill any potential word balloons
				this.SendMessage("killText");
				player.SendMessage("killText");
				
				//set the time to wait for the next balloon
				wordBalloonTimer=0;
				wordBalloonActive=false;
					
				//check if we're done
				if (curTalk==2)
					startFollow();
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
			    	if (player.transform.position.x<transform.position.x)
			    		moving.x-=speed;
			    	else
			    		moving.x+=speed;
			    	
		    	}
		    	
		    	//check if the brother has reached the running point
		    	if (Mathf.Abs(transform.position.x-door.transform.position.x)<runStart)
		    		running=true;
	    	}
	    	
	    	//if the brother is close to the door, just run towards it
	    	if (running){
	    		moving.x-=runSpeed;
	    		
	    		//if we hit the door, kill this object and spawn the bedroom brother
	    		if (transform.position.x<door.transform.position.x){
	    			//move to bed
	    			moveToBed();
	    		}
	    			
	    	}
	    	
	    	//see if it is time to make a comment
	    	if (!commentsDone && !wordBalloonActive && wordBalloonTimer>timeBeforeComment){
	    		this.SendMessage("showText",curComment);
				curComment++;	//increase the comment
				wordBalloonActive=true;
	    	}
	    	
	    	//see if the user advanced the comment
	    	if(Input.GetKeyDown(KeyCode.Space) && curComment>5 && !commentsDone){
	    		this.SendMessage("killText");
	    		wordBalloonActive=false;
	    		wordBalloonTimer=0;
	    		
	    		//check if we're done
	    		if (curComment==7){
	    			commentsDone=true;
	    		}
	    	}
	    	
		}
		
		controller.Move(moving);
	}
}


function OnTriggerEnter(other : Collider) {
	var object= other.gameObject;
}

//start the brother following the player and kill the hit box
function startFollow(){
 isTalking=false;
 isActive=true;
 wordBalloonTimer=0;	//reset the timer so he can make comments
 player.SendMessage("unfreeze");	//allow the player to move again
}


//called by convo controller when the player starts talking to the brother
function stopShouting(){
	isShouting=false;
	isTalking=true;
	
	//freeze the player
	player.SendMessage("freeze");
	
	//show the start of the conversation
	if (wordBalloonActive){
		this.SendMessage("showText",3);
		wordBalloonActive=true;
	}
	
}

//moves the brother to the bed to finish the interaction
function moveToBed(){
	inBed=true;
	isActive=false;
	
	//kill any active balloons
	this.SendMessage("killText");
	//teleport to bed
	transform.position=bedPos;
	
	//tell the intro convo to get ready
	gameObject.Find("introConvo").SendMessage("brotherInRoom");
}


