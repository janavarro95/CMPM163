var defaultParticleTexture=new Texture(new THREE.TextureLoader().load( 'particles/particle2.png' ),new THREE.Vector2(64,64));
var iridium=new Texture(new THREE.TextureLoader().load( 'particles/iridium.png' ),new THREE.Vector2(16,16));
var tinyParticle=new Texture(new THREE.TextureLoader().load( 'particles/tinyParticle.png' ),new THREE.Vector2(8,8));

var textureLoader = new THREE.TextureLoader();
/*
maybe add animations???
make animation function.
*/
class Particle{
	//size is vector2
	constructor(size,position,color,texture,lifespan){
		this.color=color;
		this.texture=texture;
		this.size=size;
		this.maxLifeSpan=lifespan;
		this.lifespan=lifespan;
		this.position=position;
		this.rotation=new THREE.Vector3();
		this.velocity=new THREE.Vector3();
		this.active=false;

		
		//var mapC = textureLoader.load( "textures/sprite2.png" );


		var materialC = new THREE.SpriteMaterial( { map: texture.image, color:vec3ToColor(this.color), fog: true } );
		//materialC.color=color;
		this.object = new THREE.Sprite( materialC );
		this.object.position.set( position.x, position.y, position.z );
		//this.object.position.normalize();
		//this.object.position.multiplyScalar( 2000 );

		//material.color=this.color;
		//this.object=new THREE.Mesh( geometry, ParticleMaterial);
		//this.setPosition(position);
	}

	//sets the texture and can dynamically change the texture.
	setTexture(texture){
		this.texture=texture;
		this.object.material.uniforms.texture.value=texture.image;
	}

	//called every update frame.
	update(){
		if(this.active==false){
		 console.log("sprite not active!");
		 return;
		}
		this.lifespan=this.lifespan-1;

		this.object.rotation.x+=this.rotation.x;
		this.move();

		this.render()
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
		this.object.scale.set(imageWidth*this.size.x,imageHeight*this.size.y);
	}

	initializeLifeSpan(amount){
		this.lifespan=amount;
		this.maxLifeSpan=amount;
	}

	//changes the default color incase there is no texture.
	setColor(color){
		this.color.x=color.r;
		this.color.y=color.g;
		this.color.z=color.b;
		this.object.material.color=vec3ToColor(this.color);
		//this.object.material.uniforms.color.value=color;
	}

	setColorRGB(R,G,B){
		this.color.R=R;
		this.color.G=G;
		this.color.B=B;
		this.object.material.color=vec3ToColor(color);
		//this.object.material.uniforms.color.value=this.color;
	}

	//removes this particle from the game world.
	removeFromScene(){
		this.active=false;
		//this.object.material.dispose();

		//this.object.mesh.dispose(); // new
		//this.object.geometry.dispose();
		//console.log("object disposed");
		//texture.dispose();
		scene.remove(this.object);
		//delete this.object;
	}

	//sets the position for the particle.
	setPosition(position){
		//console.log(position);
		this.setPositionXYZ(position.x,position.y,position.z);
	}

	setPositionXYZ(x,y,z){
		this.position.x=x;
		this.position.y=y;
		this.position.z=z;
		this.object.position.set( x, y, z );
	}

	//changes the position according to the velocity.
	move(){
		this.position.x=this.velocity.x;
		this.position.y=this.velocity.y;
		this.position.z=this.velocity.z;
		this.object.position.x+=this.velocity.x;
		this.object.position.y+=this.velocity.y;
		this.object.position.z+=this.velocity.z;
	}

	//adds to the amount to rotate for the particle.
	addRotationAmount(rotation){
		this.rotation.x+=rotation.x;
		this.rotation.y+=rotation.x;
		this.rotation.z+=rotation.x;
	}

	//adds to the velocity amount for the particle.
	addVelocityAmount(velocity){
		this.velocity.x+=velocity.x;
		this.velocity.y+=velocity.y;
		this.velocity.z+=velocity.z;
	}

	//changes the position.
	addPositionAmount(velocity){
		var vec=new THREE.Vector3(this.velocity.x+velocity.x,this.velocity.y+velocity.y,this.velocity.z+velocity.z);
		this.setPosition(vec);
	}

	//Sets the amount to rotate for the particle.
	setRotationAmount(rotation){
		this.rotation=rotation;
	}

	//sets the velocity amount for the particle.
	setVelocityAmount(velocity){
		this.velocity=velocity;
	}

	addToScene(){
		//console.log("add the particle to the scene");
		this.active=true;
		scene.add(this.object);
	}

	setScale(x,y){
		this.size.x=x;
		this.size.y=y;
	}

	getLifeRemaining(){
		return this.lifespan/this.maxLifeSpan;
	}

}

//Asumming 60 frames a second.
function secondsToFrames(num){
	return num*60;
}

function colorNumToPercent(color){
	return new THREE.Vector3(color.x/256,color.y/256,color.z/256);
}