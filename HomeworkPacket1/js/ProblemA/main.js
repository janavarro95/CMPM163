var scene;
var camera;
var renderer;



initializeScene();


//Make a bunch of different geometries using different shaders.
var geometry1 = new THREE.BoxGeometry( 1, 1, 1 );
var mesh1 = new THREE.Mesh( geometry1, PhongMaterial );
    mesh1.translateX(2.0);
    scene.add( mesh1 );


  var geometry3 = new THREE.BoxGeometry( 1, 1, 1 );
  var mesh3 = new THREE.Mesh( geometry3, DisplacementMaterial );
    mesh3.translateX(-2.0);
    scene.add( mesh3 );


//Three.js is way nicer to make lights than doing it ourselves.
 var light = new THREE.PointLight(0xbbf00f, 1.0);
  light.position.set(0.0, 0.0, 0.1);
  scene.add(light);

light.position.z=2;

  //Plane geometry allows us to make planes, have lighting on them, and have a texture for it!
  var plane=new THREE.PlaneGeometry(1.0, 1.0);
  textureLoader = new THREE.TextureLoader();

  var dogPic = textureLoader.load( 'doge.jpg');
  dogPic.magFilter = THREE.NearestFilter;

  ColoredTextureMaterial.uniforms.texture.value = dogPic;
 
  var obj = new THREE.Mesh(plane,ColoredTextureMaterial);

  //This doesn't work like I thought it would?
  obj.material.side = THREE.DoubleSide;

scene.add(obj);
//make it so that resizing the browser window also resizes the scene
window.addEventListener( 'resize', onWindowResize, false );


//This has to be declared before I use it?
var animate =function () {
requestAnimationFrame( animate );
render();
};


animate();


/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			Functions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
function initializeScene(){
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z=5;

console.log("SCENE HAS BEEN INITIALIZED!!!");
}


//My render function which draws stuff to the screen.
function render() {
mesh1.rotation.x+=0.01;
mesh1.rotation.y+=0.01;


var object1 = scene.children[ 1 ];


object1.rotation.x += 0.09;
object1.rotation.y += 0.05;
object1.material.uniforms.time.value = time += 0.005;

obj.rotation.y+=0.05;
renderer.render( scene, camera );
}


function onWindowResize( event ) {

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize( window.innerWidth, window.innerHeight );

}

