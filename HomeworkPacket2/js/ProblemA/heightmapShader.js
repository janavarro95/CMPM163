var texture1 = new THREE.TextureLoader().load( 'terrainTextures/angus.jpg' );
var texture2 = new THREE.TextureLoader().load( 'terrainTextures/grass.png' );
var texture3 = new THREE.TextureLoader().load( 'terrainTextures/snow.jpg' );
var texture4 = new THREE.TextureLoader().load( 'terrainTextures/hill.jpg' );

var HeightMapVertexShader= 	`

	uniform mat4 modelMatrix;
	uniform mat4 viewMatrix;
      	uniform mat4 projectionMatrix;
	uniform sampler2D tPic;

     	attribute vec3 position;
	attribute vec2 uv;
	attribute vec3 normal;

	uniform float displaceAmt; //controls the amount of vertex displacement...
	
    varying float vDisplace; 
	varying vec2 vUv;



    precision mediump float;


	void main() {
       
    	vUv = uv;
		
		vec4 clr = texture2D(tPic, uv);
		vDisplace = clr.r * displaceAmt; //displacement;
        vec3 newPosition = (position.xyz + normal.xyz * vDisplace).xyz;
      
       	gl_Position = projectionMatrix  * viewMatrix * modelMatrix  * vec4( newPosition, 1.0 );
    }

`;

var HeightMapFragmentShader = `

    precision mediump float;

    uniform sampler2D tGrass, tSnow, tHill;


    varying vec2 vUv;
    varying float vDisplace; 


    void main() {

	vec4 grass = texture2D(tGrass, vUv);
	vec4 snow = texture2D(tSnow, vUv);
	vec4 hill = texture2D(tHill, vUv);

	float zOffset = vDisplace;

	vec4 mix1 = mix(grass, hill, min(1.0,zOffset*8.0));
	vec4 mix2 = max(vec4(1.0), mix(hill, snow, zOffset) * 1.5);
	vec4 mix3 = mix(mix1, mix2, zOffset);


	gl_FragColor = vec4( mix3.rgb, 1.0 );    

}
`;

var HeightMapUniforms =  {
	displaceAmt: { type: "f", value: 0.0 },
	tPic: { type: "t", value: texture1  },
	tGrass: { type: "t", value: texture2  },
	tSnow: { type: "t", value: texture3  },
	tHill: { type: "t", value: texture4  },
};

var HeightMapMaterial = new THREE.RawShaderMaterial( {

	uniforms: HeightMapUniforms,
	vertexShader: HeightMapVertexShader,
	fragmentShader: HeightMapFragmentShader,

} );