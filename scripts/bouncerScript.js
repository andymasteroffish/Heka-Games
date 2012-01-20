var num:int;
private var controller:GameObject;

var picPlane:GameObject;
var normPic:Texture;
var altPic:Texture;

function Awake(){
	//find the sound player
	controller=gameObject.Find("bounceSoundPlayer");
}

function makeSound(){
	controller.SendMessage("playSound",num);
	flashPic();
}

function flashPic(){
	picPlane.renderer.material.mainTexture = altPic;
	yield WaitForSeconds(0.2);
	picPlane.renderer.material.mainTexture = normPic;
	
}