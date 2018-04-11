
var resX = 300;
var resY = 300;

var dataTexture=createDataTexture();

var GOLVertexShader= `

  uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

  attribute vec3 position;
  
      void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`

var GOLFragmentShader=  `

precision mediump float;

    uniform vec2 textureSize; //The width and height of our screen
    uniform sampler2D bufferTexture; //Our input texture
    
    void main() {

      vec2 pt = gl_FragCoord.xy; //for simple scenes, can also use gl_FragCoord instead of uv info, divide by texture size to get a value between 0.0 and 1.0
      vec4 C = texture2D( bufferTexture, vec2( pt.x/textureSize.x, pt.y/textureSize.y ) );

      float cx = pt.x/textureSize.x;

      float left = cx - 1.0/textureSize.x;
      if (left < 0.0) { left = 1.0; }
      float right = cx + 1.0/textureSize.x;
      if (left > 1.0) { left = 0.0; }


      float cy = pt.y/textureSize.y;
      
      float down = cy - 1.0/textureSize.y;
      if (down < 0.0) { down = 1.0; }
      float up = cy + 1.0/textureSize.y;
      if (up > 1.0) { up = 0.0; }


      vec4 arr[8];

      //Gte the 8 neighboring pixles from this pixel
      arr[0] = texture2D( bufferTexture, vec2( cx   , up ));   //N
      arr[1] = texture2D( bufferTexture, vec2( right, up ));   //NE
      arr[2] = texture2D( bufferTexture, vec2( right, cy ));   //E
      arr[3] = texture2D( bufferTexture, vec2( right, down )); //SE
      arr[4] = texture2D( bufferTexture, vec2( cx   , down )); //S
      arr[5] = texture2D( bufferTexture, vec2( left , down )); //SW
      arr[6] = texture2D( bufferTexture, vec2( left , cy ));   //W
      arr[7] = texture2D( bufferTexture, vec2( left , up ));   //NW


      int cold = 0;
      int warm = 0;
      int hot = 0;

      //Calculate nearby adjacent cells.
      for(int i=0;i<8;i++){
        if (arr[i].r >= 0.5) {
          hot++;
        }
        if (arr[i].g >= 0.5) {
          warm++;
        }
        if (arr[i].b >= 0.5) {
          cold++;
        }
      }
        
      //Cell is Hot        
      if(C.r>=0.5){
        if(cold>=2 && cold<5) gl_FragColor=vec4(0.0,0.5,0.0,1.0); //If the cell is hot and some of it's neighbors are cold. Cool it off and make it warm.
        else if(cold>=5) gl_FragColor=vec4(0.0,0.0,0.5,1.0); //If most of the neighbors are cold make this cell cold.
        else if(warm>=5) gl_FragColor=vec4(0.0,0.5,0.0,1.0); //If enough of the cells are cooler by one amount. Cool this one one tier.
        else gl_FragColor=vec4(0.5,0.0,0.0,0.0); //If the cells aren't cold or cooler they must be hot. This stays red.
      }

      //Cell is warm
      if(C.g>=0.5){
        int diffusion=hot-cold;
        if(diffusion>=2) gl_FragColor=vec4(0.5,0.0,0.0,1.0); //If there are more hot than cold neigboring cells, make this cell hot.
        else if(diffusion<=-2){
          gl_FragColor=vec4(0.0,0.0,0.5,1.0); 
        } //If there are more cold than hot neighboring cells, make this cell cold.
        else if(diffusion>-2 && diffusion<2){
          gl_FragColor=vec4(0.0,0.5,0.0,1.0);
        } //If the temperature is fairly balanced keep this cell cozy warm.
      }

      //Cell is cold
        if(C.b>=0.5){
        if(hot>=2 && hot<5) gl_FragColor=vec4(0.0,0.5,0.0,1.0); //If the cell is cold and some of it's neighbors are hot. Make it warm.
        else if(hot>=5) gl_FragColor=vec4(0.5,0.0,0.0,1.0); //If most of the neighbors are hot make this cell hot.
        else if(warm>=5) gl_FragColor=vec4(0.0,0.5,0.0,1.0); //If enough of the cells are warmer by one amount. Warm this one one tier.
        else gl_FragColor=vec4(0.0,0.0,0.5,0.0); //If the cells aren't cold or cooler they must be hot. This stays red.
      }
       

     }
`

//links like ShaderThing: Javascript Variable???
 var GOLBufferMaterial = new THREE.RawShaderMaterial( {
    uniforms: {
      bufferTexture: { type: "t", value: dataTexture },
      textureSize : {type: "v2", value: new THREE.Vector2( resX, resY )}  //shader doesn't have access to these global variables, so pass in the resolution
    },
    vertexShader: GOLVertexShader,
    fragmentShader: GOLFragmentShader
  } );

 function createDataTexture() {

  // create a buffer with color data

  var size = resX * resY;
  var data = new Uint8Array( 4 * size );

  //Pixel Color Noise Generator RGB
  //Only set 2 colors to make a sort of paint splash effect.
  for ( var i = 0; i < size; i++ ) {

    var stride = i * 4;

    if (Math.random() < 0.5) { //Cold
      data[ stride ] = 0;
      data[ stride + 1 ] = 0;
      data[ stride + 2 ] = 128;
      data[ stride + 3 ] = 255;
    }
    else  { //Hot
      data[ stride ] = 128;
      data[ stride + 1 ] = 0;
      data[ stride + 2 ] = 0;
      data[ stride + 3 ] = 255;
    }
  }

  // used the buffer to create a DataTexture

  //console.log(data);
  var texture = new THREE.DataTexture( data, resX, resY, THREE.RGBAFormat );
  
  texture.needsUpdate = true; // just a weird thing that Three.js wants you to do after you set the data for the texture

  return texture;

}