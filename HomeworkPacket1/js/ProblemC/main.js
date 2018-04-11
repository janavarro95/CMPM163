var scene;
var camera;
var renderer;




var bufferScene;
var bufferMaterial;
var bufferObject;
var FBO_A, FBO_B;
var plane;
var fullScreenQuad;


console.log("OK");

scene_setup(); //initialize the Three.js scene

function scene_setup(){
	//This is the basic scene setup
	scene = new THREE.Scene();
	var width = window.innerWidth;
	var height = window.innerHeight;

	//orthographic camera can be used for 2D
	camera = new THREE.OrthographicCamera( width / -2, width / 2, height / 2, height / -2, 0.1, 1000 );
	camera.position.z = 0.2;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
}


FBO_setup();

function FBO_setup(){
	//Create off-screen buffer scene
	bufferScene = new THREE.Scene();
	
	//Create 2 buffer textures
	//FBO_A = new THREE.WebGLRenderTarget( resX, resY );
	//FBO_B = new THREE.WebGLRenderTarget( resX, resY ); 
	FBO_A = new THREE.WebGLRenderTarget( resX, resY, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
	FBO_B = new THREE.WebGLRenderTarget( resX, resY, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter} );


	
	//Begin by passing an initial "seed" texture to shader, containing randomly placed cells




	//we can use a Three.js Plane Geometry along with the orthographic camera to create a "full screen quad"
	plane = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight )

	bufferObject = new THREE.Mesh( plane, GOLBufferMaterial );
	bufferScene.add(bufferObject);

	//Draw textureB to screen 
	fullScreenQuad = new THREE.Mesh( plane, new THREE.MeshBasicMaterial() );
	scene.add(fullScreenQuad);
}



render();

function render() {

	requestAnimationFrame( render );

	
	//Draw to the active offscreen buffer (whatever is stored in FBO_B), that is the output of this rendering pass will be stored in the texture associated with FBO_B
	renderer.render(bufferScene, camera, FBO_B);
	
	//grab that texture and map it to the full screen quad
	fullScreenQuad.material.map = FBO_B.texture;

	//Then draw the full sceen quad to the on screen buffer, ie, the display
	renderer.render( scene, camera );


	//Now prepare for the next cycle by swapping FBO_A and FBO_B, so that the previous frame's *output* becomes the next frame's *input*
	var t = FBO_A;
	FBO_A = FBO_B;
	FBO_B = t;
	GOLBufferMaterial.uniforms.bufferTexture.value = FBO_A.texture;
}




