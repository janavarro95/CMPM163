var backgroundVertexShader= `
	uniform float amplitude;
	attribute float size;
	attribute vec3 customColor;
	varying vec3 vColor;
	void main() {
		vColor = customColor;
		vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
		gl_PointSize = size * ( 300.0 / -mvPosition.z );
		gl_Position = projectionMatrix * mvPosition;
	}

`;

var backgroundFragmentShader =	`

	uniform sampler2D texture;
	varying vec3 vColor;
	void main() {
		gl_FragColor = vec4( vColor, 1.0 );
		gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
	}

`;