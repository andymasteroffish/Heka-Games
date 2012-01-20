var ballPrefab : GameObject;

private var spitting:boolean=false;
var timeBetweenBalls:float;
var direction:Vector3;
private var spawnTimer:float=0;

function Update () {
	if (spitting){
		
		spawnTimer+=Time.deltaTime;
		
		if (spawnTimer>timeBetweenBalls){
			spawnTimer=0;
			var newBall:GameObject=Instantiate(ballPrefab,transform.position, transform.rotation);
			newBall.SendMessage("start",direction);
		}
		
	}
}

function start(){
	spitting=true;
}

function stop(){
	spitting=false;
}