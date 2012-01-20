
var startVal:float;
var goalVal:float;		
//var valDecrease:float;
private var val;

private var started:boolean=false;
private var full:boolean=false;
private var empty:boolean=false;

var worldDoor:GameObject;
var bedroomDoor:GameObject;

//final message
var background:GameObject;
var sleepingBrotherBackground:Texture;
var finalMessage:GameObject;	//start hidden behind the background
var fullTexture:Texture;
private var showingFinalMessage:boolean=false;
private var canClose:boolean=false;


var pics:Texture[];
var dreams:GameObject[];

function Awake(){
	val=startVal;
	
}

function Update () {

	if (val>=goalVal && !full){
		full=true;
		val=goalVal;
		//teleport the player (and camera) into the bedroom
		gameObject.Find("player").SendMessage("teleport",Vector3(transform.position.x,transform.position.y,0));
		gameObject.Find("MainCamera").SendMessage("teleport",Vector3(transform.position.x,transform.position.y,0));
		
		//tell the bedroom door to close
		bedroomDoor.SendMessage("disable");
		
		//show the final message
		finalMessage.transform.position.z=-20;
		showingFinalMessage=true;
		
		//switch the room background texture to the sleeping one
		background.renderer.material.mainTexture=sleepingBrotherBackground;
		
		//switch the texture to the full hour glass
		renderer.material.mainTexture = fullTexture;
	}
	
	
	if (val<0 && !empty){
		empty=true;
		val=0;
		//tell all of the dreams time is up
		for (var i=0; i<dreams.length; i++){
			dreams[i].SendMessage("timeIsUp");
		}
		//tell the door to close
		worldDoor.SendMessage("disable");
	}
	
	
	//tick down the value
	if (!full && !empty && started){
		val-=Time.deltaTime;
	}
	
	//set the current pic
	if (!full){
		var percentage:float= val/goalVal;
		var currentPic:int= Mathf.Round(percentage*pics.length);
		currentPic=Mathf.Max(Mathf.Min(currentPic,pics.length-1),0);
		renderer.material.mainTexture = pics[currentPic];
	}
	
	//if the final message is up, check a few things
	if (showingFinalMessage){
		//if space has been released, when it is presed again, get rid of the messge
		if (Input.GetAxis("Jump")>0 && canClose){
			Destroy(finalMessage);
		}
		//make sure they weren't holding down space
		if(Input.GetAxis("Jump")==0)
			canClose=true;
	}

	
}


function addDream(dreamVal:float){
	if (!empty){
		val+=dreamVal;
		print("adding "+dreamVal);
	}
}

function start(){
	started=true;
}
	