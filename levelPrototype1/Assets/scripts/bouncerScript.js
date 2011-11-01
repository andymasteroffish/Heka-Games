var num:int;
var controller:GameObject;

var picPlane:GameObject;
var normPic:Texture;
var altPic:Texture;

function makeSound(){
	controller.SendMessage("playSound",num);
	flashPic();
}

function flashPic(){
	picPlane.renderer.material.mainTexture = altPic;
	yield WaitForSeconds(0.2);
	picPlane.renderer.material.mainTexture = normPic;
	
}