
var texture1 = new THREE.TextureLoader().load( 'PIC.jpg' );
var BlurVertexShader= `

  //Three.js gives us these automatically when a perspective camera is bound to the renderer
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  
  //Since we are using BufferGeometry, we have defined the attributes that we need manually
    attribute vec3 position;
  attribute vec2 texCoords;

  //link variables between the vertex shader and the fragment shader
  varying vec2 UV;

  void main() {

    //pass our interpolated texCoords to the fragment shader
      UV = texCoords;

          //of course, we always have to output our vertices in clip coords by multiplying through a projection matrix.
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
    
       }
`

var BlurFragmentShader=  `

precision mediump float;

  //special data type used to access texture stored on GPU
  uniform sampler2D t1;
  
  //need to know the resolution of texture so that we can grab neighbors of current pixel
  uniform float rx;
  uniform float ry;

  uniform float mixVal;

  //this has to have the same name as in the vertex shader. Here, in the fragment shader, we interpolate across the textureCoordinates
  varying vec2 UV;

        void main() {

    //see https://en.wikipedia.org/wiki/Sobel_operator
    
    vec2 texel = vec2( 1.0 / rx, 1.0 / ry );

    // fetch the 3x3 neighborhood of a fragment
    float tx0y0 = texture2D( t1, UV + texel * vec2( -1, -1 ) ).r;
    float tx0y1 = texture2D( t1, UV + texel * vec2( -1,  0 ) ).r;
    float tx0y2 = texture2D( t1, UV + texel * vec2( -1,  1 ) ).r;

    float tx1y0 = texture2D( t1, UV + texel * vec2(  0, -1 ) ).r;
    float tx1y1 = texture2D( t1, UV + texel * vec2(  0,  0 ) ).r;
    float tx1y2 = texture2D( t1, UV + texel * vec2(  0,  1 ) ).r;

    float tx2y0 = texture2D( t1, UV + texel * vec2(  1, -1 ) ).r;
    float tx2y1 = texture2D( t1, UV + texel * vec2(  1,  0 ) ).r;
    float tx2y2 = texture2D( t1, UV + texel * vec2(  1,  1 ) ).r;


    // Blur Calculations
    float bottom=tx0y0+tx1y0+tx2y0;
    float middle=tx0y1+tx1y1+tx2y1;
    float top=tx0y2+tx1y2+tx2y2;

    float combo=(bottom+middle+top);

    float ok=combo*.11; //Because apparently shaders don't like division? Or maybe they only like division by floats?.

    //vec4 edgePix = vec4( vec3( G ), 1.0);
    vec4 texPix = texture2D(t1, UV);

    //vec4 mixer=(combo,combo,combo,1.0);
    //gl_FragColor = vec4( vec3(1.0) - vec3( G ), 1 );
    //Mix the original photo with my blur to get a blur with some sort of sepia/greying effect.
    gl_FragColor = mix(texPix, vec4(vec3(ok),1.0), mixVal); 

  }
`
    var BlurUniforms = {
      t1: { type: "t", value: texture1  },
      rx: {type: "f", value: 1024/2},
      ry: {type: "f", value: 1024/2},
      mixVal: {type: "f", value: 0.5},
    };

//links like ShaderThing: Javascript Variable???
      var  BlurMaterial = new THREE.RawShaderMaterial( {
      uniforms: BlurUniforms,
                vertexShader: BlurVertexShader,
                fragmentShader: BlurFragmentShader, 
    } );