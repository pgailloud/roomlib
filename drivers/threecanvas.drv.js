var RoomDriver = {
    name : "Three.js Canvas",
    version : THREE.REVISION,
    createPlane : function(Meshes, dimension, position, rotation, material){

        Meshes.push(new THREE.Mesh( new THREE.PlaneGeometry(dimension.width, dimension.height,4,4), material));

        console.log(arguments);
            
        Meshes[Meshes.length-1].position.x = position.x;
        Meshes[Meshes.length-1].position.y = position.y;
        Meshes[Meshes.length-1].position.z = position.z;
            
        Meshes[Meshes.length-1].rotation.x = rotation.x;
        Meshes[Meshes.length-1].rotation.y = rotation.y;
        Meshes[Meshes.length-1].rotation.z = rotation.z;
            
        Meshes[Meshes.length-1].doubleSided = true;
    },
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
    screen : {
        renderer : new Object(),
        camera : new Object(),
        scene : new Object(),
        initialize : function(view, container){
            
            this.camera = new THREE.PerspectiveCamera(35, view.width / view.height, 1, 10000);
            
            this.camera.position.set(-2.6, 1.6, 0);
            
            //this.camera.position.set(-1.84,1.6,7.98);
            //this.camera.rotation.x = 8.87;
            //this.camera.rotation.y = 0.79;
            //this.camera.rotation.z = 6.32;
            
            this.scene = new THREE.Scene();
            this.scene.add(this.camera);
            
            this.renderer = new THREE.CanvasRenderer();
            
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