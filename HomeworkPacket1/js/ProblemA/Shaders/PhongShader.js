// lights
var ambient = new THREE.Vector3(0.2,0.0,0.1);

var light1_pos = new THREE.Vector3(0.0,10.0,0.0); //from above
var light1_diffuse = new THREE.Vector3(0.0,1.0,0.2);
var light1_specular = new THREE.Vector3(1.0,0.0,0.0);
        
var light2_pos = new THREE.Vector3(-10.0,0.0,0.0); //from the left
var light2_diffuse = new THREE.Vector3(0.2,0.4,0.8);
var light2_specular = new THREE.Vector3(0.6,0.2,1.0);



var PhongVertexShader= `

	//Three.js gives us these automatically when a perspective camera is bound to the renderer
	uniform mat4 modelMatrix;
	uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;

	//Three.js geometry creates these for us (and also texture coords, which we aren't using here)
     	attribute vec3 position;
	attribute vec3 normal;

	//We are explicitly passing these in
      	uniform vec3 light1_pos;
      	uniform vec3 light2_pos;

	varying vec3 N, L1, L2, V;

	void main() {

        	//get the vertex position in CAMERA coordinates
        	vec4 position = viewMatrix * modelMatrix * vec4(position, 1.0);

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

`;


var PhongFragmentShader= `

precision mediump float;
	
      	varying vec3 V, N, L1, L2;
      	float spec_intensity = 32.0; //higher value indicates more rapid falloff

      	uniform vec3 ambient; //general ambient light in the scene applied to all objects

      	uniform vec3 light1_diffuse;
      	uniform vec3 light2_diffuse;

      	uniform vec3 light1_specular;
      	uniform vec3 light2_specular;


      	void main() {

        	vec4 outColor1 = vec4(0.0);
        	vec4 outColor2 = vec4(0.0);
        
        	//diffuse light depends on the angle between the light and the vertex normal
        	float diff1 = max(0.0, dot(N, L1)); //just to make sure not negative
        	vec3 color1 = diff1 * light1_diffuse;
        
        	//specular highlights depend upon the position/orientation of the camera and the direction of the light reflecting off of this geometry
        	vec3 R1 = normalize(reflect(-L1,N)); //get light vector reflected across the plane defined by the normal of this geometry
        	float spec1 = pow( max(dot(R1, V), 0.0), spec_intensity); //raising the value to a particular intensity value shrinks the size of the specular highlight so that only a reflection vector (R1) that is very close to the view vector (V) will be applied to this fragment.
        
        	color1 += spec1 * light1_specular;
        	if (spec1 > 1.0) {
          		outColor1 = vec4(light1_specular,1.0);
        	} else {
          		outColor1 = clamp(vec4(color1,1.0), 0.0,1.0);
        	}
        

        	//diffuse
        	float diff2 = max(0.0, dot(N, L2));
        	vec3 color2 = diff2 * light2_diffuse;
        
        
        	//specular
        	vec3 R2 = normalize(reflect(-L2,N));
        
        	float spec2 = pow( max(dot(R2, V), 0.0), spec_intensity);
        	color2 += spec2 * light2_specular;
        	if (spec2 > 1.0) {
          		outColor2 = vec4(light2_specular,1.0);
        	} else {
          		outColor2 = clamp(vec4(color2,1.0), 0.0,1.0);
        	}
        
        	gl_FragColor = clamp(vec4(ambient, 1.0) + outColor1 + outColor2, 0.0, 1.0); //add the two lights together, make sure final value is between 0.0 and 1.0

}
`;

//Links Shader thing: JavaScript Object???
var PhongUniforms =  {
	ambient: { type: "v3", value: ambient },
	light1_pos: { type: "v3", value: light1_pos },
	light1_diffuse: { type: "v3", value: light1_diffuse },
	light1_specular:  { type: "v3", value: light1_specular },
	light2_pos: { type: "v3", value: light2_pos },
	light2_diffuse: { type: "v3", value: light2_diffuse },
	light2_specular:  { type: "v3", value: light2_specular },
};

//links like ShaderThing: Javascript Variable???
var PhongMaterial = new THREE.RawShaderMaterial( {
    uniforms: PhongUniforms,
    vertexShader: PhongVertexShader,
    fragmentShader: PhongFragmentShader,	
} );