var textureLoader = new THREE.TextureLoader();

var mapA = textureLoader.load( "textures/sprite0.png");
var mapB = textureLoader.load( "textures/sprite1.png" );
var mapC = textureLoader.load( "textures/sprite2.png" );
			
var camera, scene, renderer;
var cameraOrtho, sceneOrtho;

var spriteTL, spriteTR, spriteBL, spriteBR, spriteC;

var mapC;

var group;

var particleSystem=new ParticleSystem();

var gui;
var options;

var particleSystem2, uniforms, geometry;
var particles = 100000;


initScene();
initializeContainers();
populateNightSky();
			//init();
			
//var p=new StarParticle(new THREE.Vector2(10,10),getRandomPosition(0,width,0,height),new THREE.Vector3(1,1,1),iridium,0);
//p.addToScene();


animate();

			function initScene(){
			

				camera = new THREE.PerspectiveCamera( 60, width / height, 1, 2100 );
				camera.position.z = 1500;

				cameraOrtho = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 1, 10 );
				cameraOrtho.position.z = 10;

				scene = new THREE.Scene();
				scene.fog = new THREE.Fog( 0x000000, 1500, 2100 );

				sceneOrtho = new THREE.Scene();

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.autoClear = false; // To allow render overlay on top of sprited sphere

				document.body.appendChild( renderer.domElement );

				//

				window.addEventListener( 'resize', onWindowResize, false );

								// create an AudioListener and add it to the camera
				var listener = new THREE.AudioListener();
				camera.add( listener );

				// create a global audio source
				var sound = new THREE.Audio( listener );

				// load a sound and set it as the Audio object's buffer
				var audioLoader = new THREE.AudioLoader();
				audioLoader.load( 'Audio/Music/shootingStars.mp3', function( buffer ) {
					sound.setBuffer( buffer );
					sound.setLoop( true );
					sound.setVolume( 0.5 );
					sound.play();
				});

				gui=new dat.GUI( { width: 350 } ),
				options = {
					xVelocMin: 10,
					xVelocMax: 50,
					yVelocMin: 10,
					yVelocMax: 50,
					trailSpawnDampener: 10
				};
					gui.add( options, "xVelocMin", 0, 100 );
					gui.add( options, "xVelocMax", 0, 100 );
					gui.add( options, "yVelocMin", 0, 100 );
					gui.add( options, "yVelocMax", 0, 100 );
					gui.add( options, "trailSpawnDampener", 1, 60 );	





			var uniforms = {
				texture:   { value: new THREE.TextureLoader().load( "particles/iridium.png" ) }
			};
			var shaderMaterial = new THREE.ShaderMaterial( {
				uniforms:       uniforms,
				vertexShader:   backgroundVertexShader,
				fragmentShader: backgroundFragmentShader,
				blending:       THREE.AdditiveBlending,
				depthTest:      false,
				transparent:    true,
				vertexColors:   true
			});
			var radius = 1000;
			geometry = new THREE.BufferGeometry();
			var positions = [];
			var colors = [];
			var sizes = [];
			var color = new THREE.Color();
			for ( var i = 0; i < particles; i ++ ) {
				positions.push( ( Math.random() * 2 - 1 ) * radius );
				positions.push( ( Math.random() * 2 - 1 ) * radius );
				positions.push( ( Math.random() * 2 - 1 ) * radius );
				color.setHSL( i / particles, 1.0, 0.5 );
				colors.push( color.r, color.g, color.b );
				sizes.push( 20 );
			}
			geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
			geometry.addAttribute( 'customColor', new THREE.Float32BufferAttribute( colors, 3 ) );
			geometry.addAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setDynamic( true ) );
			particleSystem2 = new THREE.Points( geometry, shaderMaterial );
			scene.add( particleSystem2 );

			}

			function onWindowResize() {

				var width = window.innerWidth;
				var height = window.innerHeight;

				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				cameraOrtho.left = - width / 2;
				cameraOrtho.right = width / 2;
				cameraOrtho.top = height / 2;
				cameraOrtho.bottom = - height / 2;
				cameraOrtho.updateProjectionMatrix();

				//updateHUDSprites();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				requestAnimationFrame( animate );
				render();

			}

			function render() {

				var time = Date.now() / 1000;

				var time = Date.now() * 0.005;
				particleSystem2.rotation.z = 0.01 * time;
				var sizes = geometry.attributes.size.array;
				for ( var i = 0; i < particles; i++ ) {
					sizes[ i ] = 10 * ( 1 + Math.sin( 0.1 * i + time ) );
				}
				geometry.attributes.size.needsUpdate = true;
				renderer.clear();
				renderer.render( scene, camera );
				renderer.clearDepth();
				renderer.render( sceneOrtho, cameraOrtho );

				particleSystem.update();
				if(particleSystem.getParticleContainer("star").getActiveParticleAmount()==0) populateNightSky();
				//p.update();



				
			}
			

function initializeContainers(){
	var starParticleContainer=new StarParticleContainer("star",100);
	starParticleContainer.initializeParticles();
	particleSystem.addParticleContainer(starParticleContainer);

	var starParticleTrailContainer=new StarParticleTrailContainer("starTrail",10000);
	starParticleTrailContainer.initializeParticles();
	particleSystem.addParticleContainer(starParticleTrailContainer);


}