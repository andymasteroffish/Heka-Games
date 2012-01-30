//handles the brother's conversation witht he player while sitting in bed
private var player : GameObject;
private var guide:GameObject;
private var hourglass:GameObject;
var door:GameObject;

private var playerNearby:boolean=false;	//nothing should happen until the player is close by (meaning they have gone through the door)

var waitTime:float;					//how many seconds between bubbles
private var waitTimer:float=0;
private var showingBalloon:boolean;	//is a balloon currently being shown
			
var wordBalloonPrefab:GameObject;		//points to the word balloon prefab
private var wordBalloon:GameObject;		//stores the instantiation of the prefab
private var wordBalloonActive:boolean=false;	//is the word balloon currently being shown?

private var curPic:int=-1;				//which image are we using?
var pics:Texture[];					//holds the images for the word balloons

private var introDone:boolean=false;	//let's us know when the intro dialog is done

//where to put the word balloons relative to the brother and player
var siblingOffset:Vector3;


function Awake(){
	//find the game objects
	player=gameObject.Find("player");
	guide=gameObject.Find("guide");
	hourglass=gameObject.Find("hourglass");
	door=gameObject.Find("doorToOverworld");
	
	//disable the door for now
	door.SendMessage("disable");
	
	
}

function Update () {

	//keep the word balloon on the sibling if there is one
	if (wordBalloonActive)
		wordBalloon.transform.position=transform.position+siblingOffset;

	//check if the player is close enough
	if (!playerNearby && Vector3.Distance(player.transform.position,transform.position)<100){
		//player is close, start it up!
		playerNearby=true;
		//call in the guide
		guide.SendMessage("startConvo",2);
		waitTimer=3;
	}

	//if the player is close enough, run the conversation
	if (playerNearby && !introDone){
		//see if it is time to toss up the next balloon
		if (!showingBalloon){
			waitTimer-=Time.deltaTime;
			if (waitTimer<0){
				//advance to the next balloon
				curPic++;
				showingBalloon=true;
				
				//first 4 balloons are from the guide, the last 2 are from the brother
				if (curPic<4){
					guide.SendMessage("showText", pics[curPic]);
				}
				
				//then the sibling gets two
				if (curPic==4 || curPic==5){
					//instantiate a word balloon
					wordBalloon=Instantiate(wordBalloonPrefab, transform.position, transform.rotation );
					wordBalloon.transform.Rotate(Vector3(90,180,0));
					//set the image
					wordBalloon.renderer.material.mainTexture = pics[curPic];
					wordBalloonActive=true;
					//put it near the brother
					wordBalloon.transform.position=transform.position+siblingOffset;
				}
			}
		}
		
		//if we are showing a balloon, wait for a keypress to kill it and move on
		else{
			if(Input.GetKeyDown(KeyCode.Space)){
				//check which number balloon this is, so we know how to killit
				if (curPic<4)
					guide.SendMessage("killText");
					
				//send the guide away
				if (curPic==3)
					guide.SendMessage("endConvo");
					
				if (curPic==4 || curPic==5){
					//kill the brother's balloon
					Destroy(wordBalloon);
					wordBalloonActive=false;
				}
				
				if (curPic==5){
					//We're done!
					door.SendMessage("enable");
					guide.SendMessage("endConvo");
					//stop the conversation
					introDone=true;
					//tell the game to start
					hourglass.SendMessage("start");
				}
					
				waitTimer=waitTime;
				showingBalloon=false;
				
				//add to the wait time after the guide flies away and before the brother's last comment
				if (curPic==3 || curPic==4)	waitTimer=waitTime*4;
				
			}
		
		}
	}

	
}



