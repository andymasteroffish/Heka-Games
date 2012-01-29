var player:GameObject;
var hourglass:GameObject;
var wordBalloonPrefab:GameObject;
var reminderTextPrefab:GameObject;
var door:GameObject;

private var wordBalloon:GameObject;
private var reminderText:GameObject;

var waitTime:float;		//how many seconds between bubbles
private var waitTimer:float=0;

var playerOffset:Vector3;
var siblingOffset:Vector3;
var reminderTextOffset:Vector3;

var pics:Texture[];
var reminderTextures:Texture[];

private var curPic:int=0;

//know where to put the balloon 0 means player, 1 means sibling
private var talking;	

private var done:boolean=false;

function Awake(){
	talking=[0,1,0,1,1];
	
	//instantiate a word balloon
	wordBalloon=Instantiate(wordBalloonPrefab, transform.position, transform.rotation );
	wordBalloon.transform.Rotate(Vector3(90,180,0));
	//set the image to be the first part of the convo
	wordBalloon.renderer.material.mainTexture = pics[curPic];
	
	//instantiate a reminderText
	reminderText=Instantiate(reminderTextPrefab, transform.position+reminderTextOffset, transform.rotation );
	reminderText.transform.Rotate(Vector3(90,180,0));
	//set the image to be the first part of the convo
	reminderText.renderer.material.mainTexture = reminderTextures[0];
	
	//disable the door for now
	door.SendMessage("disable");
	
}

function Update () {

	if(!done){
		waitTimer+=Time.deltaTime;
		
		if(Input.GetAxis("Jump")>0 && waitTimer>waitTime){
			curPic++;
			if (curPic<pics.length){
				//set the image
				wordBalloon.renderer.material.mainTexture = pics[curPic];
				waitTimer=0;	//reset the timer
				
				//see if it is time to change the reminder text
				if (curPic==2){
					reminderText.renderer.material.mainTexture = reminderTextures[1];
				}
				if (curPic==4){
					Destroy(reminderText);
				}
				
			}
			else{
				//end the convo
				door.SendMessage("enable");
				//destroy the balloon
				Destroy(wordBalloon);
				//start the hourglass
				hourglass.SendMessage("start");
				//set done to be true
				done=true;
			}
		}
	
		if (curPic<pics.length){
			//if the word balloon is for the player, have it follow them, otherwise put it by the sibling
			if (talking[curPic]==0)
				wordBalloon.transform.position=player.transform.position+playerOffset;
			else
				wordBalloon.transform.position=transform.position+siblingOffset;
		}
	}
	
}

