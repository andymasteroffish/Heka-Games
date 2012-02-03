var player:GameObject;
var guide:GameObject;
var brother:GameObject;
var hourglass:GameObject;
var door:GameObject;

var waitTime:float;		//how many seconds between bubbles
private var waitTimer:float=0;
private var showingBalloon:boolean;	//is a balloon currently being shown?

//which balloon is currently being displayed?
private var curPic:int=0;
private var guidePic:int=0;
private var playerPic:int=0;

//first few balloons happen inside the bedroom at the start
private var phase1Active:boolean=false;
private var playerInBedroom:boolean=false;	//need to wait for payer to enter brother room to finish phase 1

//after the player goes out to get the brother, a few more things are said in the room
private var readyForPhase2:boolean=false;	//is the brother back in the room?
private var phase2Active:boolean=false;
private var phase2Pos:int=0;
var triggerDist:float;						//how close the player must be to trigger phase 2

function Awake(){
	//disable the door for now
	door.SendMessage("disable");
	
	//have the guide fly in after a little while
	guide.SendMessage("startConvo",2);
	waitTimer=3;
	
	
}

function Update () {
	
	if (phase1Active){
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
					phase1Active=false;
				}
					
				//set the time to wait for the next balloon
				waitTimer=waitTime;
				showingBalloon=false;
			}
		}
	}
	
	//check if the player has re-enterred the room
	if (readyForPhase2){
		if (Vector3.Distance(player.transform.position,transform.position)<triggerDist){
			print("PHASE 2");
			startPhase2();
		}
	}
	
	//handle phase 2
	if (phase2Active){
		//see if it is time to toss up the next balloon
		if (!showingBalloon){
			waitTimer-=Time.deltaTime;
			
			//first four messages can trigger in any room, after that, they must be in bedroom
			if (waitTimer<0){
				//advance to the next balloon
				phase2Pos++;
				showingBalloon=true;
				
				//first several balloons are the guide talking
				if (phase2Pos<5){
					print("guide "+phase2Pos);
					guide.SendMessage("showText", phase2Pos+7);	//the balloons for this start on 8
				}
				//the last 2 go to the brother
				else{
					print("show "+phase2Pos);
					brother.SendMessage("showText", phase2Pos+2); //the balloons for this start on 7
				}
			}
		}
		
		//if we are showing a balloon, wait for a keypress to kill it and move on
		else{
			if(Input.GetKeyDown(KeyCode.Space)){
				//kill any potential word balloons
				guide.SendMessage("killText");
				brother.SendMessage("killText");
				
				//after the guide is done, send it off
				if (phase2Pos==4)
					guide.SendMessage("endConvo");
				
				if (phase2Pos==7){
					//We're done!
					door.SendMessage("enable");
					//kill this thing!
					Destroy(gameObject);
				}
					
				//set the time to wait for the next balloon
				waitTimer=waitTime;
				showingBalloon=false;
				
				//pause for more time before the sibling comments
				if (phase2Pos>=4)	waitTimer*=3;
			}
		}
	}
}

function playerEnter(){
	playerInBedroom=true;
}

function brotherInRoom(){
	print("I am ready");
	//wait for the brother to re-enter the room
	readyForPhase2=true;
}

function startPhase2(){
	readyForPhase2=false;
	phase2Active=true;
	//have the guide fly in and get ready to talk
	guide.SendMessage("startConvo",1);
	waitTimer=2;
}

