var date=new Date();
var time=date.getTime();
var secondRandom=time%100;
var randomSeed; //MAKE this available to the options gui.

var amountOfStars;


//Make these available to options. Range 0-100
var amountRed;
var amountGreen;
var amountBlue;

var xPositionRandomness;
var yPositionRandomness;

var xVelocityRandomness;
var yVelocityRandomness;

var zRotationRandomness;

//some rng fun.
function updateRandom(){
	time=date.getTime();
	secondRandom=time%100;
}

//spawns particle to the screen and adds them to the particle system.
function populateNightSky(){
	updateRandom();
	//console.log("scond math"+secondRandom);
	amountOfStars=Math.random(0,secondRandom*100);
	amountOfStars*=100;
	//console.log("star count"+amountOfStars);
	//console.log("done???");
	var starContainer=particleSystem.getParticleContainer("star");
	for (var i = 0; i <= amountOfStars; i++) {
		starContainer.initializeInactiveParticles();
	}
}
//s
function getRandomColor(){
	/*
	var red=Math.random(0,amountRed+1);
	var green=Math.random(amountGreen+1);
	var blue=Math.random(amountBlue+1);
	*/
	var red=Math.random();
	var green=Math.random();
	var blue=Math.random();
	return new THREE.Color(red,green,blue);
}

function vec3ToColor(vector){

	var color=new THREE.Color( vector.x, vector.y, vector.z );
	//console.log(vector);
	return color;
}

function getRandomPosition(xMin,xMax,yMin,yMax){
	/*
	var x=Math.random(0,xPositionRandomness+1);
	var y=Math.random(0,yPositionRandomness+1);
	var z=0;
	*/
	var x=getRandomInt(xMin,xMax);
	var y=getRandomInt(yMin,yMax);
	var z=0;
	var negOrPosX=Math.random();
	var negOrPosY=Math.random();
	if(negOrPosX<=0.5) x*=-1;
	else x*=1;
	if(negOrPosY<=0.5) y*=-1;
	else y*=1;

	var vec=new THREE.Vector3(x,y,z);
	
	return vec;
}

function getRandomVelocityNoVars(){
	/*
	var x=Math.random(0,xVelocityRandomness+1);
	var y=Math.random(0,yVelocityRandomness+1);
	var z=0;
	*/
	var x=Math.random();
	var y=Math.random();
	var z=0;
	var negOrPosX=Math.random();
	var negOrPosY=Math.random();
	if(negOrPosX<=0.5) x*=-1;
	else x*=1;
	if(negOrPosY<=0.5) y*=-1;
	else y*=1;
	var vec=new THREE.Vector3(x/60,y/60,z);
	//console.log(vec);
	return vec;
}

function getRandomVelocityAnyDirection(xMin,xMax,yMin,yMax,xDivide,yDivide){
	/*
	var x=Math.random(0,xVelocityRandomness+1);
	var y=Math.random(0,yVelocityRandomness+1);
	var z=0;
	*/
	var x=getRandomInt(xMin,xMax)/xDivide;
	var y=getRandomInt(yMin,yMax)/yDivide;
	var z=0;
	var negOrPosX=Math.random();
	var negOrPosY=Math.random();
	if(negOrPosX<=0.5) x*=-1;
	else x*=1;
	if(negOrPosY<=0.5) y*=-1;
	else y*=1;
	return new THREE.Vector3(x,y,z);
}

function getRandomVelocityFullControl(xMin,xMax,yMin,yMax,xNeg,yNeg,xDivide,yDivide){
	/*
	var x=Math.random(0,xVelocityRandomness+1);
	var y=Math.random(0,yVelocityRandomness+1);
	var z=0;
	*/
	var x=getRandomInt(xMin,xMax)/xDivide;
	var y=getRandomInt(yMin,yMax)/yDivide;
	var z=0;
	if(xNeg==true) x*=-1;
	else x*=1;
	if(yNeg==true) y*=-1;
	else y*=1;
	var vec=new THREE.Vector3(x,y,z);
	//console.log(vec);
	return vec;
}

function getRandomRotation(){
	/*
	var x=0;
	var y=0;
	var z=Math.random(0,zRotationRandomness);
	*/
	var x=0;
	var y=0;
	var z=Math.random();
	var negOrPosZ=Math.random();
	if(negOrPosZ<=0.5) z*=-1;
	return new THREE.Vector3(x,y,z);
}

function getRandomRotationAmount(min,max){
	/*
	var x=0;
	var y=0;
	var z=Math.random(0,zRotationRandomness);
	*/
	var x=0;
	var y=0;
	var z=getRandomInt(min,max);
	var negOrPosZ=Math.random();
	if(negOrPosZ<=0.5) z*=-1;
	return new THREE.Vector3(x,y,z);
}

//Gets a random time for how long particles live. Both parameters are ints and are modified by the secondsToFrames function in Particle.js.
function getRandomLifeSpan(min,max){
	 return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRandomInt(min,max){
	 return Math.floor(Math.random() * (max - min + 1) ) + min;
}




