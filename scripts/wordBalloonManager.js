var offset:Vector3;
var pic:tk2dSprite;
var onLeft:boolean[];	//true if the word balloon of same number should be displayed on the left
var curSprite:int=0;	//used to check if this should be flipped

private var isActive:boolean; 



function Awake(){

}

function Update(){
	//keep the balloon on the target
	var displayOffset:Vector3=offset;
	
	//if this is on the right, flip the X
	if (onLeft[curSprite])	displayOffset.x=-offset.x;
	pic.transform.position=transform.position+displayOffset;

}

//causes the balloon of the given number to show up
function showText(num:int){
	//make sure this number is within the range
	if (num<0 || num>=onLeft.Length){	
		print("BAD TEXT CALL: "+num);	//post the error to the console
		killText();		//clear anything that might be displayed
		return;	
	}
	
	//otherwise set the pic to that sprite
	pic.spriteId=num;
	curSprite=num;
	
	//put the balloon in place
	var displayOffset:Vector3=offset;
	if (onLeft[curSprite])	displayOffset.x=-offset.x;
	pic.transform.position=transform.position+displayOffset;
}

//makes the balloon go back to being transparent
function killText(){
	pic.spriteId=0;		//0 is always the transparent sprite
	isActive=false;
}