
//If we are using RawShaderMaterial we have to define EVERYTHING for us.
//If we use ShaderMaterial we are giving some things to us. such as position, model view matrix, etc.


// uniforms- are variables that have the same value for all vertices
// Attributes only exist in the vertex shader. -are variables associated with each vertex
// Varying- Must be named the same in the vertex and fragment shader. Allows data to be passed from vertex to fragment shaders.

//Deals with each individual vetex.
var VertexShader= `
precision mediump float;

varying mat4 VmodelMatrix;
varying mat4 VviewMatrix;
varying mat4 VprojectionMatrix;

varying vec4 Vposition;
varying vec3 Vnormal;


void main(){
	//To pass values from vertex shader to fragment shader use the varying keyword.
	
	vec4 pos=vec4(position.xyz,1.0);
	
	Vposition=pos;
	Vnormal=normal;
	VmodelMatrix=modelMatrix;
	VviewMatrix=viewMatrix;
	VprojectionMatrix=projectionMatrix;

	//Projects a 3D vector onto a 2D plane.
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0); 
}
`;


//Deals with each individual pixel.
var FragmentShader = `

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//					Variables				 //
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
precision mediump float;

uniform vec2 resolution;

uniform vec3 cameraPos;

uniform float time;


varying mat4 VmodelMatrix;
varying mat4 VviewMatrix;
varying mat4 VprojectionMatrix;

varying vec4 Vposition;
varying vec3 Vnormal;

uniform vec3 light1_pos;
uniform vec3 light1_diffuse;
uniform vec3 light1_specular;
uniform vec3 ambient;

//the signed distance field function
//used in the ray march loop


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//					SDF SHAPES				 //
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//


//	SUMMARY
//	Creates a sphere at a given location using a SDF.
//	<PARAMS>
//	<vec3 pos> A vector3 that states where the camera is in the scene.
//	<vec3 center> A vector3 that is the scene position offset for the sphere. vec3(0.0,0.0,0.0) is the center of the scene.
//	<float radius> The radius of the sphere. The bigger the more space it takes up.
float sdSphere( vec3 pos, vec3 center, float radius )
{
    return length( pos - center ) - radius;
}


float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float sdCappedCylinder( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//					SDF Creation			 //
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//



//P is cameraPos;
float sdfSphere(vec3 p,vec3 center, float radius) {
	return sdSphere(p,center,radius);
}

//P is camera pos, h is w/h
float sdfCappedCylinder(vec3 p, vec2 h){
	return sdCappedCylinder(p,h);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//					Float Creation			 //
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

float intersect( float a, float b )
{
	return max(a, b);
}

float subtract( float a, float b ){ 
	return max(-a, b);
}

 
float box( vec3 pos, vec3 center, vec3 size, float corner )
{
    return length( max( abs( pos-center )-size, 0.0 ) )-corner;
}

float sdf(vec3 p) {
 
    //we build a sphere
    float s = sdfSphere( p, vec3( 0. ), 1.25 );
 
    //we build a box
    float c=sdfCappedCylinder(p,vec2(1.0,1.0));

    //float b = box( p, vec3( 0. ), vec3( 1. ), .0 );
 
    //we return the combination of both:
    // subtracting the sphere from the box
    return subtract( s,c  );
}

vec3 createIntersection(vec3 pos, vec3 dir){
//3 : ray march loop
    //ip will store where the ray hits the surface
	vec3 ip;
 
	//variable step size
	float t = 0.0;

	const int quality=32; //The higher this value the better the picture turns out due to zooming.
	for( int i = 0; i < quality; i++) {
 
        //update position along path
        ip = pos + dir * t;
 
        //gets the shortest distance to the scene
		float temp = sdf(ip);
 
        //break the loop if the distance was too small
        //this means that we are close enough to the surface
		if( temp < 0.01 ) break;
 
		//increment the step along the ray path
		t += temp;
 
	}
	return ip;
}



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//					Object Creation			 //
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

vec3 sphereCreate(vec3 pos, vec3 dir){
//3 : ray march loop
    //ip will store where the ray hits the surface
	vec3 ip;
 
	//variable step size
	float t = 0.0;

	const int quality=32; //The higher this value the better the picture turns out due to zooming.
	for( int i = 0; i < quality; i++) {
 
        //update position along path
        ip = pos + dir * t;
 
        //gets the shortest distance to the scene
		float temp = sdfSphere( ip,vec3(0.0,0.0,0.0),1.0 ); //creates a shape
 
        //break the loop if the distance was too small
        //this means that we are close enough to the surface
		if( temp < 0.01 ) break;
 
		//increment the step along the ray path
		t += temp;
 
	}
	return ip;
}

vec3 cylinderCreate(vec3 pos, vec3 dir){
//3 : ray march loop
    //ip will store where the ray hits the surface
	vec3 ip;
 
	//variable step size
	float t = 0.0;

	const int quality=32; //The higher this value the better the picture turns out due to zooming.
	for( int i = 0; i < quality; i++) {
 
        //update position along path
        ip = pos + dir * t;
 
        //gets the shortest distance to the scene
		float temp = sdfCappedCylinder( ip,vec2(1.0,1.0) ); //creates a shape
 
        //break the loop if the distance was too small
        //this means that we are close enough to the surface
		if( temp < 0.01 ) break;
 
		//increment the step along the ray path
		t += temp;
 
	}
	return ip;
}





//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//				Light Calculations			 //
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

vec4 calculateLight(){


	//TYPICAL VSHADER STUFF
	////////////////////////////////////////////
	vec3 P = Vposition.xyz;

	vec3 N = vec3(normalize(VviewMatrix * VmodelMatrix * vec4(Vnormal.xyz, 0.0)  ).xyz) ;

	//the lights positions are defined in WORLD coordinates, we want to put them in CAMERA coordinates too
    vec4 L1_cam = VviewMatrix * vec4(light1_pos, 1.0);
    
    //get the normalized vectors from each light position to the vertex positions
    vec3 L1 = vec3(normalize(L1_cam - Vposition).xyz);

    vec3 V=normalize(-P);
    ////////////////////////////////////////////


    float spec_intensity = 2.0; //higher value indicates more rapid falloff

    //Calculate the color
    vec4 outColor1 = vec4(0.0);
        	vec4 outColor2 = vec4(0.0);
        
        	//diffuse light depends on the angle between the light and the vertex normal
        	float diff1 = max(0.0, dot(N, L1)); //just to make sure not negative
        	vec3 color1 = diff1 * light1_diffuse;
        
        	//specular highlights depend upon the position/orientation of the camera and the direction of the light reflecting off of this geometry
        	vec3 R1 = normalize(reflect(L1,-N)); //get light vector reflected across the plane defined by the normal of this geometry
        	float spec1 = pow( max(dot(R1, V), 0.0), spec_intensity); //raising the value to a particular intensity value shrinks the size of the specular highlight so that only a reflection vector (R1) that is very close to the view vector (V) will be applied to this fragment.
        	
        	if(spec1<0.0){
        		spec1=spec1*(-1.0);
        	}
        	color1 += spec1 * light1_specular;
        	if (spec1 > 1.0) {
          		outColor1 = vec4(light1_specular,1.0);
        	} else {
          		outColor1 = clamp(vec4(color1,1.0), 0.0,1.0);
        	}
        
        //The diffuse and specular highlights are actually switched.
        vec4 retColor=clamp(vec4(ambient, 1.0) + outColor1, 0.0, 1.0);
        return retColor;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//					Main function			 //
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
 
void main( void ) {



vec4 col=calculateLight();




//1 : retrieve the fragment's coordinates
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	//preserve aspect ratio
	uv.x *= resolution.x / resolution.y;
 
 
//2 : camera position and ray direction
	vec3 pos=cameraPos;
	vec3 dir = normalize( vec3( uv, 1. ) );

	vec3 ip1=sphereCreate(pos,dir);
	vec3 ip2=cylinderCreate(pos,dir);
 

//4 : apply color to this fragment
    //we use the result position as the color

	if(time<1.0){

	vec4 shapy=mix(vec4(ip1,1.0),vec4(ip2,1.0),min(time,1.0));
	//gl_FragColor=shapy;
	gl_FragColor=mix(shapy,col,0.9);

	}
	else{
		vec3 ip3=ip1;
		vec3 ip4=ip2;
		
		float x=ip2.x-ip1.x;
		float y=ip2.y-ip1.y;
		float z=ip2.z-ip1.z;

		//
		//vec3 com=vec3(x,y,z);
		//vec4 shapy=vec4(com,1.0);
		//gl_FragColor=mix(shapy,col,0.9);
		vec4 finalShapy=vec4(createIntersection(pos,dir),1.0);
		gl_FragColor=mix(finalShapy,col,0.9);
	}


	//gl_FragColor = mix(vec4(ip1,1.0),vec4(ip2,1.0),0.99999999);

	//COLOR IS JUST THE POS where .xyz corresponds to RGB. Z just happens to be the same value always because we are on a plane.
 
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//					END OF FRAG				 //
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

`;

