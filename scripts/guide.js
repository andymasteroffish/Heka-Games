var offset:Vector3; 	//how far from the player the guide centers itself
var range:Number;		//how far from the offset center the guide will go
var speed:Number;		//how fast it buzzes around

var springiness:Number;	//how quickly the guide moves toward the goal

private var player:GameObject;
var pic:GameObject;

private var isActive:boolean; 

//flying in
private var enterTime:float;
private var waitingToEnter:boolean;

//leaving
private var isLeaving:boolean;
private var leavingGoal:Vector3;
private var leavingTimer:Number;	//count down to the guide flying off
var pauseAfterConvo:Number;			//how logn to wait after the convo	

//words
var wordBalloon:GameObject;
var wordOffset:Vector3;		//where to place the word balloon in relation to the goal point
private var isTalking:boolean;

//this would proabbly work, but might not be necessary if we use Sprite Manager
/*
var words:Texture[];		//holds the word images currently being used. Individual convos loaded into this.
var firstConvo:Texture[];	//holds just words for one convo
*/

function Awake(){
	//set player and sibling
	player=gameObject.Find("player");
	pic.renderer.enabled = false;
	wordBalloon.renderer.enabled=false;
	
	isActive=false;
	isLeaving=false;
	isTalking=false;
	
	leavingTimer=99999999;	//make this far too big to happen by itself
	
	enterTime=0;
	waitingToEnter=false;
	
}

function Update () {

	//see if the guide is waiting to enter
	if (waitingToEnter){
		enterTime-=Time.deltaTime;
		if (enterTime<0){
			waitingToEnter=false;
			flyIn();
		}	
	}

	if (isActive){
		//set the goal to be enar the player
		var goal:Vector3=player.transform.position+offset;
		//add some noise
		goal.x+=(Mathf.PerlinNoise(Time.time*speed,1)-0.5)*range;
		goal.y+=(Mathf.PerlinNoise(Time.time*speed,1000)-0.5)*range;	//just get it slightly offset from x
		//have the guide get close to it
		transform.position=Vector3.Lerp (transform.position, goal, Time.deltaTime * springiness);
			
		//position the word balloon and check on a few things if a convo is hapenning
		wordBalloon.transform.position=player.transform.position+offset+wordOffset;
		
		
		//check if it is time to go
		leavingTimer-=Time.deltaTime;
		if (leavingTimer<0)
			flyOut();
	}
	
	if (isLeaving){
		//have the guide get closer to the offscreen point
		transform.position=Vector3.Lerp (transform.position, leavingGoal, Time.deltaTime * springiness);
		
		//if the guide is close to leaving goal, make we're done for now
		if (Vector3.Distance(transform.position,leavingGoal)<1){
			isLeaving=false;
			pic.renderer.enabled=false;
		}
	}
}

//starts the count down to fly in
function startConvo(time:float){
	enterTime=time;
	waitingToEnter=true;
}

//starts count down to flying away
function endConvo(){
	//start the timer to fly away
	leavingTimer=pauseAfterConvo;
}

//causes the guide to fly in from offscreen
function flyIn(){
	isActive=true;
	
	//turn the image on of it was off
	pic.renderer.enabled = true;
	
	//position the guide above the player
	transform.position.y=player.transform.position.y+200;
	transform.position.x=player.transform.position.x+(Random.value*60-30);
	transform.position.z=player.transform.position.z;
	
	//set the leaving timer to a huge number
	leavingTimer=9999999;
}


//causes the guide to fly away
function flyOut(){
	isActive=false;
	isLeaving=true;
	
	//set the leaving goal
	leavingGoal.y=player.transform.position.y+200;
	leavingGoal.x=player.transform.position.x+(Random.value*60-30);
	leavingGoal.z=player.transform.position.z;
}


//starts a conversation
function showText(wordsImg:Texture){
	isTalking=true;
	wordBalloon.renderer.enabled=true;
	wordBalloon.renderer.material.mainTexture=wordsImg;
}


//remove the text from the screen
function killText(){
	isTalking=false;
	wordBalloon.renderer.enabled=false;
}



