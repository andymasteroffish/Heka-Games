var walking : Texture[];
var standing : Texture[];
var changeInterval : float;

@System.NonSerialized
var still:boolean = true;

function Update() {

	var index : int = Time.time / changeInterval;
	
	
	//show walk aniamtion if we're moving
	if (Input.GetAxis("Horizontal")!=0){	
		still=false;
		// take a modulo with size so that animation repeats
		index = index % walking.length;
		
		// assign it
		renderer.material.mainTexture = walking[index];
		
		//have him face the right way
		if (Input.GetAxis("Horizontal")>0)
			renderer.material.mainTextureScale=Vector2(1,1);
		if (Input.GetAxis("Horizontal")<0)
			renderer.material.mainTextureScale=Vector2(-1,1);
		
	}
	//otherwise, revert to frame one
	else if (!still){
		still=true;
		index = index % standing.length;
		renderer.material.mainTexture = standing[0];
	}
	
	
		
		
}

/*
function checkWalk(speed:float){
	if (speed!=0)
		walking=true;
	else
		walking=false;
}*/