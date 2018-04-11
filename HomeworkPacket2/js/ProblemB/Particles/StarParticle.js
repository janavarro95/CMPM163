/*
maybe add animations???
make animation function.
*/
class StarParticle extends Particle{

	//called every update frame.
	update(){
		if(this.active==false) return;
		this.lifespan=this.lifespan-1;
		
		//this.object.material.rotation+=this.rotation.x;
		this.object.material.rotation +=this.rotation.z;
		this.move();
		this.render();
		//console.log(this.lifespan);
	}

	render(){
		var material=this.object.material;
		var imageWidth = 1;
		var imageHeight =1;
		if ( material.map && material.map.image && material.map.image.width ) {
			imageWidth = material.map.image.width;
			imageHeight = material.map.image.height;
		}
		//console.log(imageWidth);
		var life=this.getLifeRemaining();
		this.object.scale.set(imageWidth*this.size.x*life,imageHeight*this.size.y*life);
	}

	//changes the position according to the velocity.
	move(){
		
		this.position.x+=this.velocity.x;
		this.position.y+=this.velocity.y;
		this.position.z+=this.velocity.z;
		this.setPosition(this.position);
		if(this.lifespan%Math.floor(options.trailSpawnDampener)==0){
			this.spawnTrailParticle();
		}
	}

	spawnTrailParticle(){
		var container=particleSystem.getParticleContainer("starTrail");
		container.initializeInactiveParticles(this.position,this.color);
	}
}