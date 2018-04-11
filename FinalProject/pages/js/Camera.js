class Camera{
	constructor(camera,name,isPerspective){
		this.camera=camera;
		this.name=name;
		this.isPerspective=isPerspective;
		this.hello();
	}

    hello(){
		console.log("hello");
	}

	setPosition(x,y,z){
		this.camera.position.x=x;
		this.camera.position.y=y;
		this.camera.position.z=z;
	}

	translate(x,y,z){
		this.camera.position.x+=x;
		this.camera.position.y+=y;
		this.camera.position.z+=z;
	}

	move(x,y,z){
		this.translate(x,y,z);
	}

	addToScene(scene){
		scene.add(this.camera);
	}

	removeFromScene(scene){
		scene.remove(this.camera);
	}

};