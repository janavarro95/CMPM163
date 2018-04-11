var time=5.0;
var mousePosition=new THREE.Vector3();
var mult=2;



var DisplacementVertexShader= `


precision mediump float;
			precision mediump int;

			uniform mat4 modelViewMatrix;
      			uniform mat4 projectionMatrix;

			attribute vec3 position;
			
			uniform vec4 my_color;
      			uniform float time;

			varying vec3 vPosition;
			varying vec4 vColor;

			void main()	
			{

				
				vec3 pos = position;

       	 			//uncomment for basic vertex displacement
       				 pos.x += sin(pos.x * 10.0 + time) * 0.1;
       				 pos.y += cos(pos.y * 10.0 + time) * 0.2;
       				 pos.z += sin(pos.z * 20.0 + time) * 0.3;

        			vPosition = pos;
				vColor = my_color;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
			
      			}

`

var DisplacementFragmentShader= `

			precision mediump float;
			precision mediump int;

			uniform float time;

			varying vec3 vPosition;
			varying vec4 vColor;

			void main()	
			{
				vec4 color;
				color = vec4( vColor );
				color.r += sin( vPosition.x * 10.0 + time ) * 0.5;
       				color.b += cos( vPosition.x * 5.0 + time  ) * 1.0;
				gl_FragColor = color;
			}
`

//Links Shader thing: JavaScript Object???
var DisplacementUniforms =  {
	time: { type: "f", value: 1.0 },
    my_color: { type: "v4", value: new THREE.Vector4(0.2,0.2,0.3,1.0) }
};

//links like ShaderThing: Javascript Variable???
var DisplacementMaterial = new THREE.RawShaderMaterial( {
    uniforms: DisplacementUniforms,
    vertexShader: DisplacementVertexShader,
    fragmentShader: DisplacementFragmentShader,	
} );