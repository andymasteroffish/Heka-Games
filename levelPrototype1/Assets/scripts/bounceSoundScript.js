var player:GameObject;
var audioPlayer : AudioSource;
var sounds : AudioClip[];
var bouncers:GameObject[];

private var index:int=0;
private var order;

function Awake(){
	//player.clip=sounds[index];
	//player.Play();
	
	order=new Array();
	audioPlayer.volume=5;


}

function Update() {
	transform.position=player.transform.position;
	
		
}

function playSound(num:int){
	audioPlayer.clip=sounds[num];
	audioPlayer.Play();
	order.Push(num);
	
}

function playAll(){
	yield WaitForSeconds(0.5);
	
	//play the sounds in the order they were hit
	for (var i=0; i<order.length; i++){
		audioPlayer.clip=sounds[order[i]];
		audioPlayer.Play();
		bouncers[order[i]].SendMessage("flashPic");
		yield WaitForSeconds(audioPlayer.clip.length*0.8);
	}
	
	//clear the array for next time
	order=new Array();

}

