class StarParticleTrailContainer extends ParticleContainer{


	initializeParticles(){
		for (var i = 0; i < this.maxParticleCount; i++) {
		var p=new StarParticleTrail(new THREE.Vector2(3,3),new THREE.Vector3(),new THREE.Vector3(1,1,1),iridium,0);
		this.particles.push(p);
		var num=i+1;
		console.log("Initializing a star trail particle!" + num + "/"+ this.maxParticleCount);
		}
	}

	initializeInactiveParticles(position,color){
		var particle=this.getFirstInactiveParticle();
		if(particle==null) return; //no available particles.
		//console.log("particle awakens");
		particle.setPositionXYZ(position.x,position.y,position.z);
		particle.setColor(vec3ToColor(color));
		particle.initializeLifeSpan(secondsToFrames(4));
		//particle.setVelocityAmount(getRandomVelocityFullControl(1,20,1,20,true,true,25,25));
		//particle.setRotationAmount(getRandomRotation());
		particle.addToScene();
	}
}