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


	createSkyBox();
	createTerrain();
	addWater();
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
	document.addEventListener( 'keypress', onKeyPress, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	gui=new dat.GUI( { width: 350 } ),
	options = {
		waterHeight: 0.06,
		displacement: 1.00
	};
	gui.add( options, "waterHeight", 0, 1.00 );
	gui.add( options, "displacement", 0, 1 );
}


function createSkyBox(){
	var skyBoxGeometry = new THREE.BoxGeometry( 2000, 2000, 2000 );
	skyMesh = new THREE.Mesh( skyBoxGeometry, SkyBoxMaterial );
	scene.add( skyMesh );
}

function addWater(){
	var gBox = new THREE.PlaneGeometry( 5, 5, 300, 300 );
	box = new THREE.Mesh(gBox, ReflectionMaterial);
	box.position.z=0.06;
	box.name="Water";
	box.material.side = THREE.DoubleSide;
	scene.add (box);
}

function createTerrain(){
	var TerrainGeometry = new THREE.PlaneGeometry( 5, 5, 300, 300 );

	var TerrainMesh = new THREE.Mesh( TerrainGeometry, HeightMapMaterial );
	TerrainMesh.material.side = THREE.DoubleSide;
	//TerrainMesh.rotateX(-Math.PI/3);
	TerrainMesh.name="Terrain";
	scene.add( TerrainMesh );
}

function onWindowResize( event ) {

	renderer.setSize( window.innerWidth, window.innerHeight );

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}


function animate() {

	requestAnimationFrame( animate );
	render();
}

var mouseX = 0.5;
var mouseY = 0.5;
var prevMouseX = 0.5;
var prevMouseY = 0.5;

function render() {

	modifyTerrain();
	//particleSystem.spawnParticle( particleOptions );
	renderer.render( scene, camera );
}


function modifyTerrain(){
	var object = scene.getObjectByName( "Terrain" );
	object.material.uniforms.displaceAmt.value = options.displacement;
	var water=scene.getObjectByName( "Water" );
	water.position.z=options.waterHeight;
}


function onDocumentMouseWheel(event){
	var fovMAX = 160;
    var fovMIN = 1;
	camera.position.z-=event.wheelDeltaY * 0.0005;
	//camera.fov -= event.wheelDeltaY * 0.05;
    //camera.fov = Math.max( Math.min( camera.fov, fovMAX ), fovMIN );
    //camera.projectionMatrix = new THREE.Matrix4().makePerspective(camera.fov, window.innerWidth / window.innerHeight, camera.near, camera.far);
}

//used for camera controls.
function onKeyPress(event){

	var key=String.fromCharCode(event.keyCode);
	key=key.toLowerCase();
	cameraControls(key);

}

//Use this to rotate terrain????
function onKeyDown(event){
	var terrain = scene.getObjectByName( "Terrain" );
	var water= scene.getObjectByName( "Water" );

	var xAmount=0.01;
	var yAmount=0.01;

	if (event.keyCode == '38') {
		//up arrow key
        //console.log("FIRE")
        terrain.rotation.x-=xAmount;
        water.rotation.x-=xAmount;
    }
    else if (event.keyCode == '40') {
        // down arrow
        terrain.rotation.x+=xAmount;
        water.rotation.x+=xAmount;
    }
    else if (event.keyCode == '37') {
       // left arrow
       terrain.rotation.y-=yAmount;
       water.rotation.y-=yAmount;
    }
    else if (event.keyCode == '39') {
       // right arrow
       terrain.rotation.y+=yAmount;
       water.rotation.y+=yAmount;
    }
}

function cameraControls(key){
	var xAmount=0.01;
	var yAmount=0.01;
	if(key=="w"){
		camera.position.y+=yAmount;
	}
	if(key=="a"){
		camera.position.x-=xAmount;
	}
	if(key=="s"){
		camera.position.y-=yAmount;
	}
	if(key=="d"){
		camera.position.x+=xAmount;
	}
}