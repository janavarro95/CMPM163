/*
maybe add animations???
make animation function.
*/
class StarParticleTrail extends Particle{

	//called every update frame.
	update(){
		this.lifespan=this.lifespan-1;
		this.render();
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
	}

	spawnSpreadParticles(){
		var p=new StarParticleTrailDust(new THREE.Vector2(0.05,0.05),getRandomPosition(safeNegX,safePosX,safeNegY,safePosY),getRandomColor(),defaultParticleTexture,secondsToFrames(getRandomLifeSpan(1,3)));
		//p.setVelocityAmount(new THREE.Vector3(this.velocity.x,this.velocity.y*-1,this.velocity.z));
		//p.setRotationAmount(getRandomRotation());
		particleSystem.addLooseParticle(p);

		var q=new StarParticleTrailDust(new THREE.Vector2(0.05,0.05),getRandomPosition(safeNegX,safePosX,safeNegY,safePosY),getRandomColor(),defaultParticleTexture,secondsToFrames(getRandomLifeSpan(1,3)));
		//q.setVelocityAmount(new THREE.Vector3(this.velocity.x*-1,this.velocity.y,this.velocity.z));
		//p.setRotationAmount(getRandomRotation());
		particleSystem.addLooseParticle(q);
		//console.log("added particle!");
	}
}