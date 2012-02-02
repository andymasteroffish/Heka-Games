var player:GameObject;
var guide:GameObject;
var hourglass:GameObject;
var door:GameObject;

var waitTime:float;		//how many seconds between bubbles
private var waitTimer:float=0;
private var showingBalloon:boolean;	//is a balloon currently being shown?

//which balloon is currently being displayed?
private var curPic:int=0;
private var guidePic:int=0;
private var playerPic:int=0;

private var playerInBedroom:boolean=false;

private var done:boolean=false;

function Awake(){
	//disable the door for now
	door.SendMessage("disable");
	
	//have the guide fly in after a little while
	guide.SendMessage("startConvo",2);
	waitTimer=3;
	
	
}

function Update () {

	//see if it is time to toss up the next balloon
	if (!showingBalloon){
		waitTimer-=Time.deltaTime;
		
		//first four messages can trigger in any room, after that, they must be in bedroom
		if (waitTimer<0 && (curPic<5 || playerInBedroom) ){
			//advance to the next balloon
			curPic++;
			showingBalloon=true;
			
			//first several balloons are the guide talking
			if (curPic<7 || curPic==8){
				guidePic++;
				guide.SendMessage("showText", guidePic);
			}
			
			//then the player gets one
			if (curPic==7){
				playerPic++;
				player.SendMessage("showText", playerPic);
			}
		}
	}
	
	//if we are showing a balloon, wait for a keypress to kill it and move on
	else{
		if(Input.GetKeyDown(KeyCode.Space)){
			//kill any potential word balloons
			guide.SendMessage("killText");
			player.SendMessage("killText");
			
			if (curPic==8){
				//We're done!
				door.SendMessage("enable");
				guide.SendMessage("endConvo");
				//kill this object
				Destroy(gameObject);
			}
				
			//set the time to wait for the next balloon
			waitTimer=waitTime;
			showingBalloon=false;
		}
	}
}

function playerEnter(){
	playerInBedroom=true;
}

