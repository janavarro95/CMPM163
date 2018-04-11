var texture1= new THREE.TextureLoader().load( 'doge.jpg' );

var ColoredTextureVertexShader= `


varying vec2 vUv;
varying vec3 vecPos;
varying vec3 vecNormal;

 
void main() {

  vUv = uv;
  vecPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
  vecNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz;
  gl_Position = projectionMatrix *
                vec4(vecPos, 1.0);
}

`

var ColoredTextureFragmentShader = `

precision highp float;
 
varying vec2 vUv;
varying vec3 vecPos;
varying vec3 vecNormal;
 
uniform float lightIntensity;
uniform sampler2D texture;

 
struct PointLight {
  vec3 color;
  vec3 position;
  float distance; 
};


uniform PointLight pointLights[NUM_POINT_LIGHTS];
 
void main(void) {
  // Pretty basic lambertian lighting...
  vec4 addedLights = vec4(0.0,
                          0.0,
                          0.0,
                          1.0);
  for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
      vec3 lightDirection = normalize(vecPos
                            - pointLights[l].position);
      addedLights.rgb += clamp(dot(-lightDirection,
                               vecNormal), 0.0, 1.0)
                         * pointLights[l].color
                         * lightIntensity;
  }

  gl_FragColor = texture2D(texture, vUv)* addedLights;
}

`
    var ColoredTextureMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            {
                lightIntensity: {type: 'f', value: 1.0},
                texture: {type: 't', value: null}
            }
        ]),
        vertexShader: ColoredTextureVertexShader,
        fragmentShader: ColoredTextureFragmentShader,
        transparent: true,
        lights: true
    });