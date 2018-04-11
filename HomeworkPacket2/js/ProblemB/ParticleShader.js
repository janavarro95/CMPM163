var ParticleVertexShader= `


	varying vec2 vUV;
	
	void main() {
		vUV=uv;
		vec4 p = viewMatrix * modelMatrix * vec4(position, 1.0);
		gl_Position = projectionMatrix * p;		
    }

`;

var ParticleFragmentShader = `
	precision mediump float;
	uniform vec3 color;
	uniform sampler2D texture;
	varying vec2 vUV;
	uniform vec2 textureSize; //The width and height of our screen

	void main() {

		vec4 ts = texture2D(texture, vUV);
		if(ts.w>0.0){
			vec4 col=vec4(color.xyz,1.0);
			gl_FragColor=mix(ts,col,0.5);
		}
		else{
			gl_FragColor=ts;
		}
	}
`;

