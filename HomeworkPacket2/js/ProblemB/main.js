var container;
var camera, scene, renderer;

var skyMesh, box;


var options;
var gui;

var particleSystem;



init();
animate();

function init() {

	//set up the scene
	container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 0, 0, 5 );

	scene = new THREE.Scene();
	particleList=[];
	//console.log("width"+window.innerWidth);
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	particleSystem=new ParticleSystem();
	console.log("initializing containers");
	initializeContainers();	
	console.log("Populating night sky");
	populateNightSky();
	document.addEventListener("mousemove", mouseMove, false);

}

function mouseMove(event){
	//console.log("yay");
	//screenToWorld(event.x,event.y,window.innerWidth,window.innerHeight);
}

function onWindowResize( event ) {

	renderer.setSize( window.innerWidth, window.innerHeight );

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}


function animate() {

	requestAnimationFrame( animate );
	render();
	particleSystem.update();
	if(particleSystem.getParticleContainer("star").getActiveParticleAmount()==0) populateNightSky();
}

var mouseX = 0.5;
var mouseY = 0.5;
var prevMouseX = 0.5;
var prevMouseY = 0.5;

function render() {

	//particleSystem.spawnParticle( particleOptions );
	renderer.render( scene, camera );
}

function initializeContainers(){
	var starParticleContainer=new StarParticleContainer("star",100);
	starParticleContainer.initializeParticles();
	particleSystem.addParticleContainer(starParticleContainer);

	var starParticleTrailContainer=new StarParticleTrailContainer("starTrail",1000);
	starParticleTrailContainer.initializeParticles();
	particleSystem.addParticleContainer(starParticleTrailContainer);


}




