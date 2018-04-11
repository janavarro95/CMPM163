//Add in the textures for the cube map.
	var cubeMap = new THREE.CubeTextureLoader()
		.setPath("./skybox/")
		.load( [
			'xpos.png',
			'xneg.png',
			'ypos.png',
			'yneg.png',
			'zpos.png',
			'zneg.png'
			] );

//This shader handles the skybox.
var SkyBoxVertexShader= `

	uniform mat4 modelMatrix;
	uniform mat4 viewMatrix;
      	uniform mat4 projectionMatrix;

     	attribute vec3 position; 

	varying vec3 vWorldPosition;
	
	void main() {

		vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
		vWorldPosition = worldPosition.xyz;

		vec4 p = viewMatrix * modelMatrix * vec4(position, 1.0);
		gl_Position = projectionMatrix * p;
		
     	 }

`;

var SkyBoxFragementShader = `

		precision mediump float;
		
		uniform samplerCube tCube;
		varying vec3 vWorldPosition;

		void main() {

			gl_FragColor = textureCube( tCube, vec3(  vWorldPosition ) );
		}


`;

var SkyBoxUniforms = { "tCube": { type: "t", value: cubeMap } };
			
var SkyBoxMaterial = new THREE.RawShaderMaterial( {
	uniforms: SkyBoxUniforms,
	vertexShader: SkyBoxVertexShader,
	fragmentShader: SkyBoxFragementShader
				} );


SkyBoxMaterial.depthWrite = false;
SkyBoxMaterial.side = THREE.BackSide;