//Kept for future reference

/*
TODO:
Make effect radius
Pass in texture resolution instead of hard coding it.
*/

class DrawModes{
	constructor(){
		this.effects=[];

		this.normal=0;
		this.customColor=1;
		this.sepia=2;
		this.blur=3;
		this.verticalStripes=4;
		this.dotMatrix=5;
		this.invert=6;
		this.horizontalScroll=7;
		this.verticalScroll=8;
		this.greyScale=9;
		this.hotDraw=10;
		this.warmDraw=11;
		this.coolDraw=12;


		this.currentEffect=0;
		this.effects.push(this.normal);
		this.effects.push(this.customColor);
		this.effects.push(this.sepia);
		this.effects.push(this.blur);
		this.effects.push(this.verticalStripes);
		this.effects.push(this.dotMatrix);
		this.effects.push(this.invert);
		this.effects.push(this.horizontalScroll);
		this.effects.push(this.verticalScroll);
		this.effects.push(this.greyScale);
		this.effects.push(this.hotDraw);
		this.effects.push(this.warmDraw);
		this.effects.push(this.coolDraw);
	}

	nextEffect(obj){
		if(this.currentEffect==this.effects.length-1){
			this.currentEffect=0;
			obj.material.uniforms.drawMode.value=this.currentEffect;
			console.log(this.currentEffect);
			return;
		}
		this.currentEffect++;
		obj.material.uniforms.drawMode.value=this.currentEffect;
		console.log(this.currentEffect);
	}

	previousEffect(obj){
		if(this.currentEffect==0){
			this.currentEffect=this.effects.length-1;
			obj.material.uniforms.drawMode.value=this.currentEffect;
			console.log(this.currentEffect);
			return;
		}
		this.currentEffect--;
		obj.material.uniforms.drawMode.value=this.currentEffect;
		console.log(this.currentEffect);
	}

	update(obj){
		if(this.currentEffect==this.horizontalScroll){
				obj.material.uniforms.horizontalScroll.value+=1;
				if(obj.material.uniforms.horizontalScroll.value>=1280) obj.material.uniforms.horizontalScroll.value=0;
		}
		if(this.currentEffect==this.verticalScroll){
				obj.material.uniforms.verticalScroll.value+=1;
				if(obj.material.uniforms.verticalScroll.value>=720) obj.material.uniforms.verticalScroll.value=0;
		}

		this.reset(obj);
	}

	reset(obj){
		if(this.currentEffect!=this.horizontalScroll)obj.material.uniforms.horizontalScroll.value=0;
		if(this.currentEffect!=this.verticalScroll)obj.material.uniforms.verticalScroll.value=0;
	}
}

var ColoredMovieVertexShader= `
precision mediump float;

varying mat4 VmodelMatrix;
varying mat4 VviewMatrix;
varying mat4 VprojectionMatrix;

varying vec4 Vposition;
varying vec3 Vnormal;

varying vec2 UV;

void main(){
	//To pass values from vertex shader to fragment shader use the varying keyword.
	
	vec4 pos=vec4(position.xyz,1.0);

	UV=uv;
	
	Vposition=pos;
	Vnormal=normal;
	VmodelMatrix=modelMatrix;
	VviewMatrix=viewMatrix;
	VprojectionMatrix=projectionMatrix;

	//Projects a 3D vector onto a 2D plane.
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0); 
}
`;

var ColoredMovieFragmentShader= 	`

precision mediump float;

	//this is my texture!
	uniform sampler2D t1;

	//this has to have the same name as in the vertex shader
	varying vec2 UV;

	varying mat4 VmodelMatrix;
	varying mat4 VviewMatrix;
	varying mat4 VprojectionMatrix;

	varying vec4 Vposition;
	varying vec3 Vnormal;

	uniform vec3 modColor;

	uniform int drawMode;

	uniform float horizontalScroll;
	uniform float verticalScroll;

	uniform vec2 screenResolution;
	uniform float effectRadius;



	uniform int byp; //should we apply the glitch ?
		
	uniform sampler2D tDiffuse;
	uniform sampler2D tDisp;
		
	uniform float amount;
	uniform float angle;
	uniform float seed;
	uniform float seed_x;
	uniform float seed_y;
	uniform float distortion_x;
	uniform float distortion_y;
	uniform float col_s;
			
		

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//				Color Modifiers				//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

	//Default DrawMode==0;
	vec4 normal(vec4 c1){
		return c1;
	}

	//DrawMode==1;
	vec4 customColor(vec4 c1){
		vec4 col=vec4(c1.r*modColor.r,c1.g*modColor.g,c1.b*modColor.b,1.0);
		return col;
	}

	//DrawMode==2;
	vec4 sepia(vec4 c1){
		float inputRed= c1.x;
		float inputGreen=c1.y;
		float inputBlue=c1.z;

		float outputRed = (inputRed * .393) + (inputGreen *.769) + (inputBlue * .189);
		float outputGreen  = (inputRed * .349) + (inputGreen *.686) + (inputBlue * .168);
		float outputBlue = (inputRed * .272) + (inputGreen *.534) + (inputBlue * .131);
		return vec4(outputRed,outputGreen,outputBlue,1.0);
	}


	//DrawMode==3;
	vec4 blur(vec4 c1){

		float radius=effectRadius;

		vec2 pt=gl_FragCoord.xy;

		vec4 blurColor=vec4(0.0,0.0,0.0,0.0);



	  vec2 textureSize=screenResolution;

	  float cx = pt.x/textureSize.x;
	  float cy = pt.y/textureSize.y;

      float left = cx - (1.0/textureSize.x)*radius;
      if (left < 0.0) { left = 1.0; }
      float right = cx + (1.0/textureSize.x)*radius;
      if (left > 1.0) { left = 0.0; }


     
      
      float down = cy - (1.0/textureSize.y)*radius;
      if (down < 0.0) { down = 1.0; }
      float up = cy + (1.0/textureSize.y)*radius;
      if (up > 1.0) { up = 0.0; }


      vec4 arr[8];

      //Gte the 8 neighboring pixles from this pixel
      arr[0] = texture2D( t1, vec2( cx   , up ));   //N
      arr[1] = texture2D( t1, vec2( right, up ));   //NE
      arr[2] = texture2D( t1, vec2( right, cy ));   //E
      arr[3] = texture2D( t1, vec2( right, down )); //SE
      arr[4] = texture2D( t1, vec2( cx   , down )); //S
      arr[5] = texture2D( t1, vec2( left , down )); //SW
      arr[6] = texture2D( t1, vec2( left , cy ));   //W
      arr[7] = texture2D( t1, vec2( left , up ));   //NW

      for(int i=0;i<8;i++){
        blurColor+=arr[i];
      }

		float x=blurColor.x/9.0;
		float y=blurColor.y/9.0;
		float z=blurColor.z/9.0;
		float w=1.0;

		return vec4(x,y,z,w);
	}

	//DrawMode=4;
	vec4 verticalStripes(vec4 c1){

		float radius=effectRadius;

		vec2 pt=gl_FragCoord.xy;     
     	//mod means every x lines different color happens.
     	vec2 newPos=pt.xy *1.0;
     	vec4 pixCol=vec4(0.0,0.0,0.0,1.0);
     	if(mod(newPos.x,10.0)>=5.0) pixCol=c1;	//pixCol=vec4(0.0,0.0,1.0,1.0);
     	else pixCol=customColor(c1);			//pixCol=vec4(1.0,0.0,0.0,1.0);

     	return pixCol;
		
	}

	//DrawMode=5;
	vec4 dotMatrix(vec4 c1){
		float radius=effectRadius;
		vec2 pt=gl_FragCoord.xy;   
     	//mod means every x lines different color happens.
     	vec2 newPos=pt.xy *1.0;
     	vec4 pixCol=vec4(0.0,0.0,0.0,1.0);
     	if(mod(newPos.x,effectRadius)>=effectRadius/2.0 && mod(newPos.y,effectRadius)>=effectRadius/2.0) pixCol=c1; 
     	else pixCol=vec4(0.0,0.0,0.0,1.0);

     	return pixCol;
	}

	//DrawMode=6;
	vec4 invert(vec4 c1){
		float red=1.0-c1.r;
		float green=1.0-c1.g;
		float blue=1.0-c1.b;
		if(red<0.0) red=red*-1.0;
		if(green<0.0) green=green*-1.0;
		if(blue<0.0) blue=blue*-1.0;
		return vec4(red,green,blue,1.0);
	}

	//DrawMode=7;
	vec4 sidewaysScroll(vec4 c1){

		float grabPos=gl_FragCoord.x+horizontalScroll;
		if(grabPos>screenResolution.x) grabPos=grabPos - screenResolution.x;

		vec2 pt=gl_FragCoord.xy;

		float cx = grabPos/screenResolution.x;
		float cy = pt.y/screenResolution.y;

		vec4 col = texture2D( t1, vec2( cx, cy ));
		return col;

	}

	//DrawMode=8;
	vec4 upDownScroll(vec4 c1){

		float grabPos=gl_FragCoord.y+verticalScroll;
		if(grabPos>screenResolution.y) grabPos=grabPos - screenResolution.y;

		vec2 pt=gl_FragCoord.xy;

		float cx = pt.x/screenResolution.x;
		float cy = grabPos/screenResolution.y;

		vec4 col = texture2D( t1, vec2( cx, cy ));
		return col;

	}

	//DrawMode=9;
	vec4 greyScale(vec4 c1){
		float Red=c1.r;
		float Green=c1.g;
		float Blue=c1.b;
		float Gray = (Red * 0.3 + Green * 0.59 + Blue * 0.11);
		return vec4(Gray,Gray,Gray,1.0);
	}

	//DrawMode=10;
	vec4 hotDraw(vec4 c1){
		if(c1.r>=0.5) return c1;
		else return vec4(0.0,0.0,0.0,1.0);
	}

	//DrawMode=11;
	vec4 warmDraw(vec4 c1){
		if(c1.g>=0.5) return c1;
		else return vec4(0.0,0.0,0.0,1.0);
	}

	//DrawMode=12;
	vec4 coolDraw(vec4 c1){
		if(c1.b>=0.5) return c1;
		else return vec4(0.0,0.0,0.0,1.0);
	}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//					Utilities				//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

	vec4 getDrawMode(vec4 c1){
		if(drawMode==0) return normal(c1);
		if(drawMode==1) return customColor(c1);
		if(drawMode==2) return sepia(c1);
		if(drawMode==3) return blur(c1);
		if(drawMode==4) return verticalStripes(c1);
	    if(drawMode==5) return dotMatrix(c1);
	    if(drawMode==6) return invert(c1);
	    if(drawMode==7) return sidewaysScroll(c1);
	    if(drawMode==8) return upDownScroll(c1);
	    if(drawMode==9) return greyScale(c1);
	    if(drawMode==10) return hotDraw(c1);
	    if(drawMode==11) return warmDraw(c1);
	    if(drawMode==12) return coolDraw(c1);
	    return vec4(c1.rgb,1.0); //Because nothing else has been defined
	}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//					Main					//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

    void main() {
		vec4 c1 = texture2D(t1, UV);
    	gl_FragColor = getDrawMode(c1);
	}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//				End of Shader				//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
`;


function createColoredMaterial(videoTexture,screenResolution,color,drawMode,effectRadius){

var TextureUniforms = {
	t1: { type: "t", value: videoTexture},
	screenResolution: {type:"v2",value: screenResolution},
	modColor:{ type: "v3",value:color},
	drawMode:{type: "i",value:drawMode},
	effectRadius:{type: "f",value:effectRadius},
	horizontalScroll:{type: "f",value:0.0},
	verticalScroll:{type: "f",value:0.0},


	tDiffuse:	  	{type: "t", value: null },//diffuse texture
	tDisp:		  	{type: "t", value: null },//displacement texture for digital glitch squares
	byp:		  	{type: "i", value: 0 },//apply the glitch ?
	amount:		  	{type: "f", value: 0.08 },
	angle:		  	{type: "f", value: 0.02 },
	seed:		  	{type: "f", value: 0.02 },
	seed_x:		  	{type: "f", value: 0.02 },//-1,1
	seed_y:		  	{type: "f", value: 0.02 },//-1,1
	distortion_x: 	{type: "f", value: 0.5 },
	distortion_y: 	{type: "f", value: 0.6 },
	col_s:		 	{type: "f", value: 0.05 }
};

//links like ShaderThing: Javascript Variable???
var TextureMaterial = new THREE.ShaderMaterial( {
    uniforms: TextureUniforms,
    vertexShader: ColoredMovieVertexShader,
    fragmentShader: ColoredMovieFragmentShader,	
} );
return TextureMaterial;
}