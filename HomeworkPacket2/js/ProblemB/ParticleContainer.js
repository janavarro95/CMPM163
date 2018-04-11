class ParticleContainer{
	constructor(name,maxParticleCount){
		this.name=name;
		this.maxParticleCount=maxParticleCount;
		this.particles=[];
	}

	initializeParticles(){

	}

	getActiveParticleAmount(){
		var count=0;
		for (var i = this.particles.length - 1; i >= 0; i--) {
			if(this.particles[i].active==true)count++;
		}
		return count;
	}

	getFirstInactiveParticle(){
		for (var i = 0; i <= this.particles.length; i++) {
			if(this.particles[i]==null) continue;
			if(this.particles[i].active==false) return this.particles[i]; 
		}
		return null;
	}

	initializeInactiveParticle(){
		/*
		var particle=getFirstInactiveParticle();
		if(particle==null) return; //no available particles.
		particle.setPosition(getRandomPosition(safeNegX,safePosX,safeNegY,safePosY));
		particle.setColor(getRandomColor());
		particle.initializeLifeSpan(secondsToFrames(getRandomLifeSpan(1,10)));
		particle.setVelocityAmount(getRandomVelocityFullControl(1,20,1,20,true,true,25,25));
		particle.setRotationAmount(getRandomRotation());
		*/
	}

	cleanUpLooseParticles(){
		for (var i = this.particles.length - 1; i >= 0; i--) {
			if(this.particles[i].lifespan==0|| this.particles[i]==null){
				this.particles[i].removeFromScene();
				//this.particles[i]=null;
				//delete this.particles[i];
			}
		}
		var list=[];
		
		for (var i = this.particles.length - 1; i >= 0; i--) {
			if(this.particles[i]!=null) list.push(this.particles[i]);
		}
		
		this.particles=list;
	}

	update(){
		for (var i = 0; i < this.particles.length; i++) {
			if(this.particles[i]==null){
			console.log("ERROR AT:"+i);
			return;
		}
			this.particles[i].update();
		}
	}
}