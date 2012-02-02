var num:int;
private var controller:GameObject;

var pic:tk2dSprite;

function Awake(){
	//find the sound player
	controller=gameObject.Find("bounceSoundPlayer");
}

function makeSound(){
	controller.SendMessage("playSound",num);
	flashPic();
}

function flashPic(){
	//set the sprite to the alternate pic for a second
	pic.spriteId=1;
	yield WaitForSeconds(0.2);
	pic.spriteId=0;
	
}