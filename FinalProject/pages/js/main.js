// standard global variables
var container, scene, camera, renderer, controls, stats;

// custom global variables
var video, videoImage, videoImageContext, videoTexture;

var draw=new DrawModes();

init();
animate();

// FUNCTIONS 		
function init() 
{
	document.addEventListener( 'keydown', onKeyDown, false );
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,150,400);
	camera.lookAt(scene.position);	


	renderer = new THREE.WebGLRenderer( {antialias:true} );
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	
	// CONTROLS
	// EVENTS

	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,0,0);
	scene.add(light);
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	// scene.add(skyBox);
	scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
	
	

	
	//This is a comment!!!
	///////////
	// VIDEO //
	///////////
	
	// create the video element
	video = document.createElement( 'video' );
	video.id = 'video';
	video.type="video/mp4";
	video.type = ' video/mp4; codecs="theora, vorbis" ';
	video.src = "videos/jojoOpening.mp4";
	video.load(); // must call after setting/changing source
	video.play();
	
	// alternative method -- 
	// create DIV in HTML:
	// <video id="myVideo" autoplay style="display:none">
	//		<source src="videos/sintel.ogv" type='video/ogg; codecs="theora, vorbis"'>
	// </video>
	// and set JS variable:
	// video = document.getElementById( 'myVideo' );
	
	videoImage = document.createElement( 'canvas' );
	videoImage.width = 1280;
	videoImage.height = 720;

	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	


	//Fix this to be my own texture things.
	//var movieMaterial = new THREE.MeshBasicMaterial( {color:0xff0000, map: videoTexture, side:THREE.DoubleSide } );

	var texture = new THREE.TextureLoader().load( 'angus.jpg' );
	var customColor=new THREE.Vector3(0.0,1.0,1.0);
	var textureDimentions = 1024;

	var movieMaterial = createColoredMaterial(videoTexture,new THREE.Vector2(videoImage.width,videoImage.height),customColor,draw.currentEffect,10.0);


	// the geometry on which the movie will be displayed;
	// 		movie image will be scaled to fit these dimensions.
	var movieGeometry = new THREE.PlaneGeometry( 320, 180, 4, 4 );
	var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
	movieScreen.position.set(0,0,0);
	movieScreen.name="MovieScreen";
	scene.add(movieScreen);
	
	camera.position.set(0,0,300);
	camera.lookAt(movieScreen.position);
				
				
	
}

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
	var obj = scene.getObjectByName( "MovieScreen" );
	draw.update(obj);
}

function render() 
{	
	
	if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
	{
		videoImageContext.drawImage( video, 0, 0 );
		if ( videoTexture ) 
			videoTexture.needsUpdate = true;
	}
	
	renderer.render( scene, camera );
}

//Use this to rotate terrain????
function onKeyDown(event){
	var obj = scene.getObjectByName( "MovieScreen" );
	if (event.keyCode == '38') {
		//up arrow key
    }
    else if (event.keyCode == '40') {
        // down arrow
    }
    else if (event.keyCode == '37') {
       // left arrow
       draw.previousEffect(obj);
    }
    else if (event.keyCode == '39') {
       // right arrow
       draw.nextEffect(obj);
    }
}