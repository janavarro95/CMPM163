class SceneManager{
	
	constructor(pCamera,oCamera){

		this.container = document.getElementById( 'container' );
		this.screenResolution=new THREE.Vector2(window.innerWidth,window.innerHeight);

		this.scene = new THREE.Scene();
		this.cameras=[];
		this.activePerspectiveCamera=pCamera;
		this.activeOrthogonalCamera=oCamera;

		this.cameras.push(pCamera);
		this.cameras.push(oCamera);
		
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setClearColor( 0x000000 );
		this.renderer.setSize( window.innerWidth, window.innerHeight );

		this.container.appendChild( this.renderer.domElement );

		this.activePerspectiveCamera.addToScene(this.scene);
		this.activeOrthogonalCamera.addToScene(this.scene);
	}


	render(){
		if(this.activePerspectiveCamera.camera!=null){
			this.renderer.render( this.scene, this.activePerspectiveCamera.camera );
			
		}
		
		/*
		if(this.activeOrthogonalCamera.camera!=null){
			//this.renderer.render( this.scene, this.activeOrthogonalCamera.camera );
		}
		*/
	}

	addObjectToScene(obj){
		this.scene.add(obj);
	}

	removeObjectFromScene(obj){
		this.scene.remove(obj);
	}


}