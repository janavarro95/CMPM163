var texture1= new THREE.TextureLoader().load( 'doge.jpg' );

var PhongLightVertexShader= `

//Three.js gives us these automatically when a perspective camera is bound to the renderer
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

  
  //Since we are using BufferGeometry, we have defined the attributes that we need manually
    attribute vec3 position;
  attribute vec2 texCoords;

  //link variables between the vertex shader and the fragment shader
  varying vec2 UV;


  attribute vec3 normal;

    //We are explicitly passing these in
        uniform vec3 light1_pos;
        uniform vec3 light2_pos;

  varying vec3 N, L1, L2, V;


  void main() {

      //get the vertex position in CAMERA coordinates
        vec4 position = viewMatrix * modelMatrix * vec4(position, 1.0);
    //pass our interpolated texCoords to the fragment shader
      UV = texCoords; //Need this to get the texture position


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

var PhongLightFragmentShader=  `

precision mediump float;

  //special data type used to access texture stored on GPU
  uniform sampler2D t1;

  //this has to have the same name as in the vertex shader. Here, in the fragment shader, we interpolate across the textureCoordinates
  varying vec2 UV;


          varying vec3 V, N, L1, L2;
        float spec_intensity = 32.0; //How bright our specular is.

        uniform vec3 ambient;

        uniform vec3 light1_diffuse;
        uniform vec3 light2_diffuse;

        uniform vec3 light1_specular;
        uniform vec3 light2_specular;

    void main() {

          vec4 c1 = texture2D(t1, UV);
          vec4 outColor1 = vec4(0.0);
          vec4 outColor2 = vec4(0.0);
        
          //diffuse light depends on the angle between the light and the vertex normal
          float diff1 = max(0.0, dot(N, L1)); //just to make sure not negative
          vec3 color1 = diff1 * light1_diffuse;
        
          //specular highlights depend upon the position/orientation of the camera and the direction of the light reflecting off of this geometry
          vec3 R1 = normalize(reflect(-L1,N)); //Some reflectivity I found in a tutorial and scraped from some old notes
          float spec1 = pow( max(dot(R1, V), 0.0), spec_intensity); //Calculate the specular light influence
        
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

          vec4 firstColor=vec4(ambient,1) + outColor1 + outColor2; //add the two lights together, make sure final value is between 0.0 and 1.0


    gl_FragColor =mix(c1,firstColor,0.5); //Get the blended picture of that dog.
    //gl_FragColor = vec4(1.0,0.0,0.0,1.0);
  }

`
var PhongLightUniforms = {
  t1: { type: "t", value: texture1  },
  lights:true,
};

//links like ShaderThing: Javascript Variable???
var PhongLightMaterial = new THREE.RawShaderMaterial( {
    uniforms: PhongLightUniforms,
    vertexShader: PhongLightVertexShader,
    fragmentShader: PhongLightFragmentShader,  
} );