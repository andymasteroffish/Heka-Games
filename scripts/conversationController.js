var text : Texture[];
var player : Transform;
var wordBalloon : Transform;

//where in relation to the dream to place the balloon
var xSlide:float;
var ySlide:float;

var playerXSlide:float;
var playerYSlide:float;	

//how much to zoom
var cameraZoom:float;

var brotherConvo:boolean=false;

private var currentBalloon:Transform;

private var activeConvo:boolean = false;

private var pointer:GameObject;	//pointer to select choice if there is one
private var selection:int;		//which choice the player is making

private var phase:int;	//which phase of the convo we're in
private var timer:int;		//make sure we stay on a screen for a set amount of time
var pauseTime:int;	//how long to wait

private var gameCamera:GameObject;


//at the end of some conversations, area locks or other things may need to be activated
var activateAtEnd:boolean;
var thingsToActivate:GameObject[];	//anything added to this must have a member funciton called "activateMe"


function Awake(){
	//find the pointer and camera
	pointer=gameObject.Find("conversationPointer");
	gameCamera=gameObject.Find("MainCamera");
}

function Update () {

	timer--;	//lower the timer every frame
	//don't do anything if the conversation is not active
	if(activeConvo){
	
		//for the first phase, the dream is talking. Player can just advacne the text
		if (phase==0){
			if (Input.GetKeyDown(KeyCode.Space) && timer<0)
				setupPlayerResponse();
		}
		
		//After that, the player can give their response
		if (phase==1){
			if(!brotherConvo){		//no choices can be amde when talking to the brother
				//place the selection pointer
				var balloonSize:Bounds=currentBalloon.renderer.bounds;
				var selectionHeight:float=5;	//how much space between selections
				var placement : Vector3=new Vector3(0,0,0);
				placement.x= currentBalloon.transform.position.x-5.5;
				placement.y= currentBalloon.transform.position.y+2- selection*selectionHeight;
				placement.z=-50;
				//actual put it there
				pointer.transform.position=placement;
				
				//up and down to make selection
				if (Input.GetAxis("Vertical")>0)
					selection=0;
				if (Input.GetAxis("Vertical")<0)
					selection=1;
			}
			//space to confirm
			if (Input.GetKeyDown(KeyCode.Space) && timer<0)
				setupDreamResponse();
		}
		
		//Dream gets one more response, after which the convo is over
		if (phase==2){
			if (Input.GetKeyDown(KeyCode.Space) && timer<0)
				endConvo();
		}
	
	}
}

function startTalk(){
	if (!activeConvo){
		phase=0;
		activeConvo=true;	//we're talking now
		
		//if this is the brother, make him stop shouting
		if (brotherConvo)	this.SendMessage("stopShouting");
		
		//zoom the camera
		gameCamera.SendMessage("startZoom", cameraZoom);
		
		
		//place the balloon
		placeBalloon(Vector3(transform.position.x+xSlide,transform.position.y+ySlide,-50),phase);
		
		//pause the player
		player.SendMessage("freeze");
		
		timer=pauseTime;
	}
}

function setupPlayerResponse(){
	phase=1;	//advance phase
	//get rid of current balloon
	Destroy(currentBalloon.gameObject);
	
	//place a balloon for the player
	placeBalloon(Vector3(player.transform.position.x-playerXSlide,player.transform.position.y+playerYSlide,-50),phase);
	
	
	timer=pauseTime;
}

function setupDreamResponse(){
	//move the pointer off screen
	pointer.transform.position.y=-1000;
	
	//if the players said "goodbye" and there is no response for that, end the convo now
	if (selection==1 && text.length<4){
		endConvo();
	}
	else{
		phase=2;
		
		//get rid of current balloon
		Destroy(currentBalloon.gameObject);
		
		//give the dream another balloon
		if (selection==0){
			placeBalloon(Vector3(transform.position.x+xSlide,transform.position.y+ySlide,-50),2);
		}else
			placeBalloon(Vector3(transform.position.x+xSlide,transform.position.y+ySlide,-50),3);
			
		timer=pauseTime;
	}
}

function endConvo(){
	//get rid of current balloon
	Destroy(currentBalloon.gameObject);
	//unfreeze the player
	player.SendMessage("unfreeze");
	
	//unzoom the camera
	gameCamera.SendMessage("endZoom");
	
	//if the player asked the dream to follow, have it start following
	if (selection==0){
		this.SendMessage("startFollow");
		player.SendMessage("newFollower",transform.gameObject);
		
		//activate any camera effects or other things if this conversation needs to
		if (activateAtEnd){
			for (var i:int =0; i<thingsToActivate.length; i++){
				thingsToActivate[i].SendMessage("activateMe");
			}
		}
	}
		
	activeConvo=false;
}

function placeBalloon(placement:Vector3, num:int){
	//spawn the word baloon
	currentBalloon=Instantiate(wordBalloon, placement,Quaternion(0,0,0,0));
	//rotate it
	currentBalloon.Rotate(Vector3(-270,0,-180));
	//add the text
	currentBalloon.renderer.material.mainTexture = text[num];
}