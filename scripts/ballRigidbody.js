var body:Rigidbody;
var bouncePower:float;
var friction:float;

private var dir:Vector3 = new Vector3(0,0,0);
var gravity:Vector3;

private var killTimer:float;

private var player:GameObject;

private var justHit:boolean=false;

function Awake(){
	player=gameObject.Find("player");
}

function Update () {
	body.AddForce(gravity);
	
	if (justHit){
		justHit=false;
		body.AddForce(body.velocity*2);
	}
	
	//is it time to die?
	killTimer+=Time.deltaTime;
	if (killTimer>10){
		Destroy(gameObject);
	}
	
	

}


function OnCollisionEnter(collision : Collision) {
	var object= collision.gameObject;
	
	justHit=true;
}


function OnTriggerEnter(other : Collider) {
	var object= other.gameObject;
	
	//kill it if it hit the goal
	if (object.name=="ballGoal"){
		object.SendMessage("scoreGoal");
		Destroy(gameObject);
	}
	
	if (object.name=="playerTrigger"){
		body.AddForce(Vector3.up*200);
		player.SendMessage("ballBounce");
	}
	
}

function start(dir: Vector3){
	body.AddForce(dir* (100+Random.value*100));
}	
