var player:GameObject;
var guide:GameObject;
var hourglass:GameObject;
var wordBalloonPrefab:GameObject;
var reminderTextPrefab:GameObject;
var door:GameObject;

private var wordBalloon:GameObject;
private var wordBalloonActive:boolean=false;
private var reminderText:GameObject;

var waitTime:float;		//how many seconds between bubbles
private var waitTimer:float=0;
private var showingBalloon:boolean;	//is a balloon currently being shown?

var playerOffset:Vector3;
var siblingOffset:Vector3;
var reminderTextOffset:Vector3;

var pics:Texture[];
private var curPic:int=-1;
var reminderTextures:Texture[];

private var playerInBedroom:boolean=false;

private var done:boolean=false;

function Awake(){
	
	//instantiate a reminderText
	reminderText=Instantiate(reminderTextPrefab, transform.position+reminderTextOffset, transform.rotation );
	reminderText.transform.Rotate(Vector3(90,180,0));
	//set the image to be the first part of the convo
	reminderText.renderer.material.mainTexture = reminderTextures[0];
	
	//disable the door for now
	door.SendMessage("disable");
	
	//have the guide fly in after a little while
	guide.SendMessage("startConvo",2);
	waitTimer=3;
	
}

function Update () {

	//keep the word balloon on the player if there is one
	if (wordBalloonActive)
		wordBalloon.transform.position=player.transform.position+playerOffset;

	//see if it is time to toss up the next balloon
	if (!showingBalloon){
		waitTimer-=Time.deltaTime;
		
		//firts four messages can trigger in any room, after that, they must be in bedroom
		if (waitTimer<0 && (curPic<3 || playerInBedroom) ){
			//advance to the next balloon
			curPic++;
			showingBalloon=true;
			
			//first several balloons are the guide talking
			if (curPic<5 || curPic==6){
				guide.SendMessage("showText", pics[curPic]);
			}
			
			//then the player gets one
			if (curPic==5){
				//instantiate a word balloon
				wordBalloon=Instantiate(wordBalloonPrefab, transform.position, transform.rotation );
				wordBalloon.transform.Rotate(Vector3(90,180,0));
				//set the image
				wordBalloon.renderer.material.mainTexture = pics[curPic];
				wordBalloonActive=true;
				//put it near the player
				wordBalloon.transform.position=player.transform.position+playerOffset;
			}
		}
	}
	
	//if we are showing a balloon, wait for a keypress to kill it and move on
	else{
		if(Input.GetKeyDown(KeyCode.Space)){
			//check which number balloon this is, so we know how to killit
			if (curPic<5 || curPic==6)
				guide.SendMessage("killText");
				
			if (curPic==5){
				//kill the player's balloon
				Destroy(wordBalloon);
				wordBalloonActive=false;
			}
			
			if (curPic==6){
				//We're done!
				door.SendMessage("enable");
				print("done");
				guide.SendMessage("endConvo");
			}
				
			waitTimer=waitTime;
			showingBalloon=false;
			
		}
	
	}

	
	
}

function playerEnter(){
	playerInBedroom=true;
}

