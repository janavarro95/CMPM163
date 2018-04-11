var container;
var camera, scene, renderer;
var mesh;
var material;

var screenResolution;

var plane;

var time;
var idk;
var timeTick=3.0;
var timearr;

var fpsConst=60; //IDK MAYBE THIS CAN HELP/
var currentFrameCount;

init();
animate();


var light1_pos;
var light1_diffuse;
var light1_specular;
var ambient;

function init() {
	time=0;
	idk=0.0;
	currentFrameCount=0;

	light1_pos=new THREE.Vector3(-1.0,1.0,0.0);
	light1_diffuse=new THREE.Vector3(1.0,0.0,0.0);
	light1_specular=new THREE.Vector3(1.0,1.0,0.0);
	ambient=new THREE.Vector3(0.0,0.0,0.7,1.0);

	container = document.getElementById( 'container' );

	timearr=[0,0,0,0,0,0,0,0];
	camera = new THREE.PerspectiveCamera( 60.0, window.innerWidth / window.innerHeight, 0.1, 50 );
	screenResolution=new THREE.Vector2(window.innerWidth,window.innerHeight);
	camera.position.x=0.0;
	camera.position.y=0.0;
	camera.position.z=-2.0;


	var Uniforms={
 		time: {type: "f", value: time}, //To change this value use mesh.materials.uniforms.time.value+=0.01; on the appropriate mesh object.
 		resolution:{type: "v2", value: screenResolution},
 		cameraPos:{type: "v3", value: camera.position},
 		ambient: { type: "v3", value: ambient },
		light1_pos: { type: "v3", value: light1_pos },
		light1_diffuse: { type: "v3", value: light1_diffuse },
		light1_specular:  { type: "v3", value: light1_specular },
	}

	//left side is shader variable, right side is js variable name
	var Material = new THREE.ShaderMaterial({

 		uniforms: Uniforms,
 		vertexShader: VertexShader,
 		fragmentShader: FragmentShader
 	});

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0x000000 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	var geometry=new THREE.PlaneGeometry(window.innerWidth,window.innerHeight,1,1);
	plane=new THREE.Mesh(geometry,Material);
	scene.add(plane);
	plane.position.z=-10;

	//make it so that resizing the browser window also resizes the scene
    window.addEventListener( 'resize', onWindowResize, false );
		
	}

	function animate() {
		this.light1_pos.x=Math.sin(currentFrameCount/60);
		this.light1_pos.y=Math.sin(currentFrameCount/60);
		requestAnimationFrame( animate );
		render();
	}

	function render() {
		
		currentFrameCount+=1;
		if(currentFrameCount%fpsConst==0) {
			 idk+=timeTick; //one second has passed
			 if(idk==10) idk=0;
		}
		//console.log(idk);
		weirdLERP();
		time=parseTimeArrToTime();
		time/=100000000;
		plane.material.uniforms.time.value=time;
		//console.log(time);

		renderer.render( scene, camera );
	}

	function onWindowResize( event ) {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );

	}


	function weirdLERP(){
		if(timearr[7]==9) return;
		var index=0;
		for (var i = timearr.length - 1; i >= 0; i--) {
			if(timearr[i]==9) index++;
		}
		timearr[index]=idk;
		if(idk==9) idk=0;
	}

	function parseTimeArrToTime(){
		var wtf=Math.pow(10,timearr.length-1);
		var value=0;
		for (var i = 0; i < timearr.length; i++) {
			value+=wtf*timearr[i];
			wtf/=10;
		}
		return value;
	}