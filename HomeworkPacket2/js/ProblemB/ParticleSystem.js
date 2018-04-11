class ParticleSystem{
	constructor(){
		this.emitters=[];
		this.particleContainers=[];
	}

	addParticleContainer(particleContainer){
		this.particleContainers.push(particleContainer)
	}

	addEmitter(emitter){
		this.emitters.add(emitter);
	}

	update(){
		for (var i = this.emitters.length - 1; i >= 0; i--) {
			this.emitters[i].update();
		}

		for (var i =0; i < this.particleContainers.length; i++) {
			this.particleContainers[i].update();
		}
		for (var i =0; i < this.particleContainers.length; i++) {
			this.particleContainers[i].cleanUpLooseParticles();
		}

	}

	getParticleContainer(name){
		for (var i = this.particleContainers.length - 1; i >= 0; i--) {
			if(this.particleContainers[i].name==name) return this.particleContainers[i];
		}
	}

	addParticleToContainer(name){
		var container=getParticleContainer(name);
		container.initializeInactiveParticle();
	}
}