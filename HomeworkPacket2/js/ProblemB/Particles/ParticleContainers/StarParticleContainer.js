class StarParticleContainer extends ParticleContainer{


	initializeParticles(){
		for (var i = 0; i < this.maxParticleCount; i++) {
		var p=new StarParticle(new THREE.Vector2(10,10),new THREE.Vector3(0,0,0),new THREE.Vector3(0,1,1),iridium,0);
		this.particles.push(p);
		var num=i+1;
		console.log("Initializing a star particle!" + num + "/"+ this.maxParticleCount);
		}
	}

	initializeInactiveParticles(){
		var particle=this.getFirstInactiveParticle();
		if(particle==null){
			//console.log("woops");
			return;
		}  //no available particles.
		//console.log("particle awakens");
		particle.setPosition(getRandomPosition(0,width,0,height));
		particle.setColor(getRandomColor());
		particle.initializeLifeSpan(secondsToFrames(getRandomLifeSpan(1,3)));
		particle.setVelocityAmount(getRandomVelocityAnyDirection(options.xVelocMin,options.xVelocMax,options.yVelocMin,options.yVelocMax,25,25));
		particle.setRotationAmount(getRandomRotationAmount(0,100));
		particle.addToScene();
	}
}