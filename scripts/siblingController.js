var controller : CharacterController;
var speed:float;
var followDist:float;	//how close the dream will get to the player
var leftLimit:float;	//no moving further left than this point
var rightLimit:float;	//no moving further left than this point

var hitBox:GameObject;

//before being found by the player, the brother is shouting for help
private var isShouting:boolean=true;	//is the brother still calling out for help
var timeBetweenShouts:float;			//time in seconds between showing word balloons
var shoutTime:float;					//how long each word balloon is displayed for
private var wordBalloonTimer:float;				
var wordBalloonPrefab:GameObject;		//points to the word balloon prefab
private var wordBalloon:GameObject;		//stores the instantiation of the prefab
private var wordBalloonActive:boolean=false;	//is the word balloon currently being shown?
private var curShout:int=0;				//which shouting image are we using?
var shoutPics:Texture[];				//holds the images for the word balloons

//where to put the word balloons relative to the brother and player
var playerOffset:Vector3;
var siblingOffset:Vector3;


//on the way back to the room, the brother syays a few things to the player
var timeBeforeComment:float;			//how long after starting the walk to start talking
private var curComment:int=0;			//which comment we're on
var commentPics:Texture[];				//holds the images
private var commentsDone:boolean=false;	//are the comments done?

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
	
	//add to the timer
	wordBalloonTimer+=Time.deltaTime;
	
	//handle shouting before the player arives
	if (isShouting){
		//is it time to add a new balloon?
		if (!wordBalloonActive && wordBalloonTimer>timeBetweenShouts){
			wordBalloonActive=true;
			wordBalloonTimer=0;
			
			//instantiate a word balloon
			wordBalloon=Instantiate(wordBalloonPrefab, transform.position, transform.rotation );
			wordBalloon.transform.Rotate(Vector3(90,180,0));
			//set the image
			wordBalloon.renderer.material.mainTexture = shoutPics[curShout];
			wordBalloonActive=true;
			//put it near the brother
			wordBalloon.transform.position=transform.position+siblingOffset;
			
			//switch between the different shouts
			if (++curShout==shoutPics.Length)	curShout=0;
		}
		
		//is it time to get rid of one?
		if (wordBalloonActive && wordBalloonTimer>shoutTime){
			wordBalloonActive=false;
			wordBalloonTimer=0;
			
			//kill the balloon
			Destroy(wordBalloon);
		}
	}

	//handle following the player home
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
    	
    	//see if it is time to make a comment
    	print(commentsDone+"  "+wordBalloonTimer+"  "+curComment);
    	if (!commentsDone && wordBalloonTimer>timeBeforeComment && curComment==0){
    		//instantiate a word balloon
			wordBalloon=Instantiate(wordBalloonPrefab, transform.position, transform.rotation );
			wordBalloon.transform.Rotate(Vector3(90,180,0));
			//set the image
			wordBalloon.renderer.material.mainTexture = commentPics[curComment];
			
			curComment++;	//increase the comment
    	}
    	
    	//see if the user advanced the comment
    	if(Input.GetKeyDown(KeyCode.Space) && curComment>0 && !commentsDone){
    		wordBalloon.renderer.material.mainTexture = commentPics[curComment];
    		//advance curComment and check if we're done
    		if (++curComment==commentPics.Length){
    			//kill the balloon
    			Destroy(wordBalloon);
    			//and mark that we're done
    			commentsDone=true;
    		}
    	}
    	
    	//if there is a word balloon, keep it near the brother
    	if (curComment>0 && !commentsDone)
    		wordBalloon.transform.position=transform.position+siblingOffset;
	    
	}
	
	controller.Move(moving);
}


function OnTriggerEnter(other : Collider) {
	var object= other.gameObject;
}

//start the brother following the player and kill the hit box
function startFollow(){
 isActive=true;
 wordBalloonTimer=0;	//reste the timer so he can make comments
 Destroy(hitBox);
}

function disappear(){
	Destroy(gameObject);
}

//called by convo controller when the player starts talking to the brother
function stopShouting(){
	isShouting=false;
	
	//if there is a word balloon currently, kill it
	if (wordBalloonActive){
		wordBalloonActive=false;
		//kill the balloon
		Destroy(wordBalloon);
	}
}


