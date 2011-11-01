var secondPic:Texture[];

private var xPos:float=0;
private var yPos:float=0;

private var startX:float;
private var startY:float;

var maxDist:float;		//how far the sibling can float from the starting point
var drunkSpeed:float;	//how much it can move with each frame

function Awake(){
	//get the starting poisiotn
	startX=transform.position.x;
	startY=transform.position.y;
	
	xPos=startX;
	yPos=startY;
}

function Update () {

	//move the position
	xPos+=Random.Range(-drunkSpeed,drunkSpeed);
	yPos+=Random.Range(-drunkSpeed,drunkSpeed);
	
	//constrain it so it can't go too far
	xPos=Mathf.Min(Mathf.Max(xPos,startX-maxDist),startX+maxDist);
	yPos=Mathf.Min(Mathf.Max(yPos,startY-maxDist),startY+maxDist);
	
	//set it
	transform.position=Vector3(xPos,yPos,0.5);
	
}

function changePic(num:int){
	renderer.material.mainTexture = secondPic[num];
	//kill the door
	Destroy(gameObject.Find("door"));
}