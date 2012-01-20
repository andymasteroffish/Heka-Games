var audioPlayer : AudioSource;
var badSound:AudioClip;
var sounds : AudioClip[];
var bouncers:GameObject[];


private var player:GameObject;

private var index:int=0;
private var order;				//correct sequence of notes
private var curLength:int=1;	//how far in the order to go this time
private var playerOrder;

private var win:boolean=false;

function Awake(){
	//set player 
	player=gameObject.Find("player");
	
	order=[0,1,3,2,4,2];//new Array();
	playerOrder=new Array();
	audioPlayer.volume=5;


}

function Update() {
	//keep the sound  with the player
	transform.position=player.transform.position;
}

//plays a single note
function playSound(num:int){
	playerOrder.Push(num);
	if (!win){
		if (playerOrder.length<=curLength){
			if (playerOrder[playerOrder.length-1]==order[playerOrder.length-1]){
				audioPlayer.clip=sounds[num];
				audioPlayer.Play();
				//playerOrder.Push(num);
			}
		}else{
			audioPlayer.clip=badSound;
				audioPlayer.Play();
		}
	}else{
		//if the player won, just play the sound
		audioPlayer.clip=sounds[num];
		audioPlayer.Play();
	}
}

//demos the note order for the player
function playCorrectOrder(){
	for (var i=0; i<curLength; i++){
		audioPlayer.clip=sounds[order[i]];
		audioPlayer.Play();
		bouncers[order[i]].SendMessage("flashPic");
		yield WaitForSeconds(audioPlayer.clip.length*0.8);
	}
}

//see if the player hit the notes in the right order
function testNoteOrder(){
	if (!win){
		yield WaitForSeconds(0.5);
		
		//test if the player hit the notes in the correct order
		var correct:boolean=true;	//assume they got it right
		//make sure they actualy hit enough notes
		if (playerOrder.length>=curLength){
			//check each one
			for (var i:int=0; i<curLength; i++){
				if (order[i]!=playerOrder[i])
					correct=false;
			}
		}else{
			correct=false;
		}
		if (correct){
			curLength++;
		}else{
			curLength=1;
		}
		
		//did the player finish the sequence
		if (curLength>order.length)
			winTheGame();
		else	//otherwise play the next part of the sequence
			playCorrectOrder();
		
		
		//clear the array for next time
		playerOrder=new Array();
	}

}

//plays all of the notes for the winner
function winTheGame(){
	win=true;
	
	for (var k:int=0; k<3; k++){
		for (var i:int=0; i<sounds.length; i++){
			audioPlayer.clip=sounds[i];
			audioPlayer.Play();
			bouncers[i].SendMessage("flashPic");
			yield WaitForSeconds(audioPlayer.clip.length*0.05);
		}
		for (i=sounds.length-1; i>=0; i--){
			audioPlayer.clip=sounds[i];
			audioPlayer.Play();
			bouncers[i].SendMessage("flashPic");
			yield WaitForSeconds(audioPlayer.clip.length*0.05);
		}
	}
}



