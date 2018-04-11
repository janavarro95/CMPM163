var objTex = new THREE.TextureLoader().load( 'water.jpg' ); 
//Applying this shader to an object will add a reflective property to it.
var ReflectionVertexShader= `

	uniform mat4 modelMatrix;
	uniform mat4 viewMatrix;
      	uniform mat4 projectionMatrix;

	uniform vec3 cameraPosition;
	
     	attribute vec3 position; 
     	attribute vec3 normal; 

	varying vec3 vI;
	varying vec3 vWorldNormal;

		attribute vec2 uv;

	varying vec2 vUV;

	void main() {
  		vec4 mvPosition = viewMatrix * modelMatrix * vec4( position, 1.0 );
  		vec4 worldPosition = modelMatrix * vec4( position, 1.0 );

  		vWorldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

		vUV = uv;

  		vI = worldPosition.xyz - cameraPosition;

  		gl_Position = projectionMatrix * mvPosition;
	}


`;

var ReflectionFragmentShader= `


		precision mediump float;

		uniform samplerCube envMap;

		uniform sampler2D tex;
		varying vec2 vUV;

		varying vec3 vI, vWorldNormal;

		void main() {
  			vec3 reflection = reflect( vI, vWorldNormal );
  			vec4 envColor = textureCube( envMap, vec3( -reflection.x, reflection.yz ) );
  			vec4 b =  vec4(envColor);
  			//vec4 ts = texture2D(tex, vUV);
  			//gl_FragColor = mix(b,c,0.5);
  			vec4 col=mix(b,vec4(0.0,0.0,0.5,1.0),0.5);
  			col=vec4(col.xyz,0.5);
  			gl_FragColor=col;
		}

`;

var ReflectionUniforms = {
        tCube: { type: "t", value: cubeMap },
        tex: { type: "t", value: objTex  }
	};


	var ReflectionMaterial = new THREE.RawShaderMaterial( {
		uniforms: ReflectionUniforms,
		vertexShader: ReflectionVertexShader,
		fragmentShader: ReflectionFragmentShader
	} );