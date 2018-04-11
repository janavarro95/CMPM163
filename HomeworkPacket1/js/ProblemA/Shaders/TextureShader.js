//Kept for future reference

var TextureVertexShader= `

//Three.js gives us these automatically when a perspective camera is bound to the renderer
	uniform mat4 modelMatrix;
	uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

	
	//Use some plane geometry. Way easier to do lighting with this.
    attribute vec3 position;
	attribute vec2 texCoords;


	//We are explicitly passing these in
      	uniform vec3 light1_pos;
      	uniform vec3 light2_pos;

	//link variables between the vertex shader and the fragment shader
	varying vec2 UV;

	void main() {

    	//get the vertex position in CAMERA coordinates
       	vec4 position = viewMatrix * modelMatrix * vec4(position, 1.0);

		//pass our interpolated texCoords to the fragment shader
	   	UV = texCoords;

	   	        	//use xyz vals to calculate vectors between vertex, light, and camera
        	vec3 P = position.xyz;
    
        	//get the normalized vertex normal in CAMERA coordinates
        	N = vec3(normalize(viewMatrix * modelMatrix * vec4(normal.xyz, 0.0)  ).xyz) ;
    
        	//the lights positions are defined in WORLD coordinates, we want to put them in CAMERA coordinates too
        	vec4 L1_cam = viewMatrix * vec4(light1_pos, 1.0);
        	vec4 L2_cam = viewMatrix * vec4(light2_pos, 1.0);
    
        	//get the normalized vectors from each light position to the vertex positions
        	L1 = vec3(normalize(L1_cam - position).xyz);
        	L2 = vec3(normalize(L2_cam - position).xyz);
    
    
        	//reverse direction of position vector to get view vector from vertex to camera
        	V = normalize(-P);



        //of course, we always have to output our vertices in clip coords by multiplying through a projection matrix.
        gl_Position = projectionMatrix * position; 
		
     	 }

`

var TextureFragmentShader= 	`

precision mediump float;

	//this is my texture!
	uniform sampler2D t1;

	//this has to have the same name as in the vertex shader
	varying vec2 UV;

    void main() {

	vec4 c1 = texture2D(t1, UV);

    //pixel color is my image color
    gl_FragColor = c1;
    //gl_FragColor = vec4(1.0,0.0,0.0,1.0);
	}

`
var TextureUniforms = {
	t1: { type: "t", value: texture1  },
};

//links like ShaderThing: Javascript Variable???
var TextureMaterial = new THREE.RawShaderMaterial( {
    uniforms: TextureUniforms,
    vertexShader: TextureVertexShader,
    fragmentShader: TextureFragmentShader,	
} );