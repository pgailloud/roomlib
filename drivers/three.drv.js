/**
 * @fileOverview Three.JS WebGL Wrapper for Roomlib
 * @author Pascal Gailloud <pgailloud@bluewin.ch>
 * @version 1.1
 */

var onelog = 0;

/**
 * Main object wrapper for roomlib
 */
var RoomDriver = {
    name : "Three.js WebGL",
    version : 49,
    createPlane : function(Meshes, dimension, position, rotation, material){
    	
        Meshes.push(new THREE.Mesh( new THREE.PlaneGeometry(dimension.width, dimension.height,4,4), material));
            
        Meshes[Meshes.length-1].position.x = position.x;
        Meshes[Meshes.length-1].position.y = position.y;
        Meshes[Meshes.length-1].position.z = position.z;
            
        Meshes[Meshes.length-1].rotation.x = rotation.x;
        Meshes[Meshes.length-1].rotation.y = rotation.y;
        Meshes[Meshes.length-1].rotation.z = rotation.z;
            
        //Meshes[Meshes.length-1].doubleSided = true;
    },
    /*
     * @class Interaction with the scene
     */
    control : {
        object : new Object(),
        initialize : function (camera){
            this.object = new THREE.FirstPersonControls(camera);
            this.object.movementSpeed = 10;
            this.object.lookSpeed = 0.1;
            this.object.lookVertical = false;
            this.object.activeLook = false;
            this.object.dragToLook = true;
        }
    },
    /*
     * @class viewing of the scene
     */
    screen : {
        //renderer : new Object(),
        //camera : new Object(),
        //scene : new Object(),
        initialize : function(view, container){
        	/*
        	 * @lends screen
        	 * initialisation of the screen, creating objects
        	 */
            this.camera = new THREE.PerspectiveCamera(35, view.width / view.height, 1, 10000);
            
            this.camera.position.set(-2.6, 1.6, 0);
            
            this.scene = new THREE.Scene();
            this.scene.add(this.camera);
            
            this.renderer = new THREE.WebGLRenderer({
                antialias		        : true,	// to get smoother output
                preserveDrawingBuffer	: true	// to allow screenshot
            });
            
            
            this.renderer.setClearColorHex(0xBBBBBB, 1);
            
            //Creating visual rendering
            if (container == -1){
                container = document.createElement('div');
                document.body.appendChild(container);
            }
            
            this.renderer.setSize(view.width, view.height);
            container.appendChild(this.renderer.domElement);

            THREEx.WindowResize.bind(this.renderer, this.camera);
        },
        render : function (){
        	if (onelog<2){
        		console.log(this.scene);
        		onelog = onelog+1;
        	}
            this.renderer.render(this.scene, this.camera);
        }


    },
    utils : {
        getTextureFromFile : function (filename, tiles){
            var texture = THREE.ImageUtils.loadTexture(filename);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.x = texture.repeat.y = tiles;
            return new THREE.MeshBasicMaterial({map:  texture});
        },
        
        getTextureFromColor : function (mycolor){
            return new THREE.MeshBasicMaterial({color: mycolor});
        }
    }
    
};