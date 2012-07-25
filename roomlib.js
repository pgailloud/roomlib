/**
 * @fileOverview Main file for roomlib
 * @author Pascal Gailloud <pgailloud@bluewin.ch>
 * @version 1.2 
 */

/**
 * Main function to create rooms
 * @param x 
 * @param y 
 * @param z
 * 
 * @param width
 * @param height
 * @param deepth
 * @returns Object Room object
 */

function room(x, y, z, width, height, deepth){
         
        /**
         * Wall Mesh creation
         * @param Meshes Array 
         * @param wall Object containing:<br/>
         *  .width <br/> 
         *  .height <br/>
         *  <i>Wall dimensions</i><br/>
         *  <br/>
         *  .mat <i>Wall Material</i><br/>
         *  <br/>  
         *  .position.x<br/>
         *  .position.y<br/>
         *  .position.z<br/>
         *  <i>Wall Position</i><br/>
         *  <br/>
         *  .rotation.x<br/>
         *  .rotation.y<br/>
         *  .rotation.z<br/>
         *  <i>Wall Rotation</i><
         */
        function CreateWallMesh(Meshes, wall){
            RoomDriver.createPlane(Meshes, {width : wall.width, height : wall.height}, wall.position, wall.rotation, wall.mat);
        }
        
        /**
         * Initialize informations for walls. 
         */
        thisroom = this;
        
        /**
         * Objects for storing room informations
         */
        this.scale = {
            width : width,
            height : height,
            deepth : deepth
        };
        
        this.position = {
            x: x,
            y: y,
            z: z
        };
        
        /*
         Planning:
         - Fusionner les differentes methode afin de de n'avoir qu'une seule méthode à modifier.
         - Faire un seul objet duplicable pour chaque mur.
        */
        
        function set_x (mat){

            var side_multiplier = ((this.side * 2) - 1); // to give -1 or 1 depending the side
            
            var side_rotation = {
                	x : (Math.PI / 2) * side_multiplier,
                    y : 0,
                    z : (Math.PI / 2) * side_multiplier
                };
            
            var side_x = thisroom.position.x + ((thisroom.scale.width / 2) * side_multiplier);
            
            //Solid Door Creations
            if (this.doors.array.length > 0) {
                for (var i=0; i<this.doors.array.length;i++){
                    
                    CreateWallMesh(this.doors.meshes, {
                        width: (this.doors.array[i].length * 2),
                        height: this.doors.array[i].height,
                        mat:  new THREE.MeshBasicMaterial({color: 0xDD0000}),
                        position : {
                            x : side_x,
                            y : thisroom.position.y + (this.doors.array[i].height / 2),
                            z : thisroom.position.z + this.doors.array[i].x
                        },
                        rotation : side_rotation
                    });
                }
            }
            
            //If there are doors
            if (this.doors.array.length > 0){
                
                //Check if the first door is directly tied to the left
                len = (thisroom.scale.deepth / 2) + (this.doors.array[0].x) - this.doors.array[0].length;
                if (len > 0){
                    //Yes, then create the left part of the wall
                    CreateWallMesh(this.meshes, {
                        width: len,
                        height: thisroom.scale.height,
                        mat:  mat,
                        position : {
                            x : side_x,
                            y : thisroom.position.y + (thisroom.scale.height / 2),
                            z : thisroom.position.z - (thisroom.scale.deepth / 2) + (len / 2)
                        },
                        rotation : side_rotation
                    });
                }
                
                for (var i=0; i<this.doors.array.length;i++){
                    
                    //Create wall parts on top of the door                    
                    CreateWallMesh(this.meshes, {
                        width: this.doors.array[i].length * 2,
                        height: thisroom.scale.height - this.doors.array[i].height,
                        mat:  mat,
                        position : {
                            x : side_x,
                            y : thisroom.position.y + (thisroom.scale.height) - (thisroom.scale.height - this.doors.array[i].height) / 2,
                            z : thisroom.position.z + this.doors.array[i].x
                        },
                        rotation : side_rotation
                    });
                    
                    var len = 0;
                    
                    //If it's not the last door
                    if (i+1<this.doors.array.length){
                        len = this.doors.array[i+1].x - (this.doors.array[i].x + (this.doors.array[i].length *2));
                        
                        len = (this.doors.array[i+1].x - this.doors.array[i+1].length) - (this.doors.array[i].x + this.doors.array[i].length);
                    } else {
                        //if the last door is not tied to the left wall
                        if ((this.doors.array[i].x) + (this.doors.array[i].length) < thisroom.scale.width){
                            len = (thisroom.scale.deepth / 2) - (this.doors.array[i].x + this.doors.array[i].length);
                        }
                    }
        
                    if (len > 0){
                        //Create the part on right of the door
                        CreateWallMesh(this.meshes, {
                            width: len,
                            height: thisroom.scale.height,
                            mat:  mat,
                            position : {
                                x : side_x,
                                y : thisroom.position.y + (thisroom.scale.height / 2),
                                z : thisroom.position.z + this.doors.array[i].x + (this.doors.array[i].length) + (len / 2)
                            },
                            rotation : side_rotation
                        });
                    }
                }
                
            } else {
                
                //Create simply the wall
                CreateWallMesh(this.meshes, {
                    width: thisroom.scale.deepth,
                    height: thisroom.scale.height,
                    mat:  mat,
                    position : {
                        x : side_x,
                        y : thisroom.position.y + (thisroom.scale.height / 2),
                        z : thisroom.position.z
                    },
                    rotation : side_rotation
                });
            }
        }
        
        function set_z(mat){
            var side_multiplier = ((this.side * 2) - 1); // to give -1 or 1 depending the side
            var side_rotation = {
                    x : (Math.PI / 2) * -side_multiplier,
                    y : Math.PI * this.side,
                    z : 0
                };
            var side_z = thisroom.position.z + ((thisroom.scale.deepth / 2) * side_multiplier);
            
            //for Debugging, Creating solid Doors
            if (this.doors.array.length > 0){
                for (var i=0; i<this.doors.array.length;i++){
                    
                    CreateWallMesh(this.doors.meshes, {
                        width: (this.doors.array[i].length * 2),
                        height: this.doors.array[i].height,
                        mat:  new THREE.MeshBasicMaterial({color: 0xDD0000}),
                        position : {
                            x : thisroom.position.x + this.doors.array[i].x,
                            y : thisroom.position.y + (this.doors.array[i].height / 2),
                            z : side_z
                        },
                        rotation : side_rotation
                    });
                }
            }
            
            
            //If there are doors
            if (this.doors.array.length > 0){
                //Check if the first door is directly tied to the left
                len = (thisroom.scale.width / 2) + (this.doors.array[0].x) - this.doors.array[0].length;
                if (len > 0){
                    //Yes, then create the left part of the wall
                    CreateWallMesh(this.meshes, {
                        width: len,
                        height: thisroom.scale.height,
                        mat:  mat,
                        position : {
                            x : thisroom.position.x - (thisroom.scale.width / 2) + (len / 2),
                            y : thisroom.position.y + (thisroom.scale.height / 2),
                            z : side_z
                        },
                        rotation : side_rotation
                    });
                }
                
                for (var i=0; i<this.doors.array.length;i++){
                    
                    //Create wall parts on top of the door                    
                    CreateWallMesh(this.meshes, {
                        width: this.doors.array[i].length * 2,
                        height: thisroom.scale.height - this.doors.array[i].height,
                        mat:  mat,
                        position : {
                            x : thisroom.position.x + this.doors.array[i].x,
                            y : thisroom.position.y + (thisroom.scale.height) - (thisroom.scale.height - this.doors.array[i].height) / 2,
                            z : side_z
                        },
                        rotation : side_rotation
                    });
                    
                    var len = 0;
                    
                    //If it's not the last door
                    if (i+1<this.doors.array.length){
                        len = this.doors.array[i+1].x - (this.doors.array[i].x + (this.doors.array[i].length *2));
                        
                        len = (this.doors.array[i+1].x - this.doors.array[i+1].length) - (this.doors.array[i].x + this.doors.array[i].length);
                    } else {
                        //if the last door is not tied to the left wall
                        if ((this.doors.array[i].x) + (this.doors.array[i].length) < thisroom.scale.width){
                            len = (thisroom.scale.width / 2) - (this.doors.array[i].x + this.doors.array[i].length);
                        }
                    }
            
                    if (len > 0){
                        //Create the part on right of the door
                        CreateWallMesh(this.meshes, {
                            width: len,
                            height: thisroom.scale.height,
                            mat:  mat,
                            position : {
                                x : thisroom.position.x + this.doors.array[i].x + (this.doors.array[i].length) + (len / 2), 
                                y : thisroom.position.y + (thisroom.scale.height / 2),
                                z : side_z 
                            },
                            rotation : side_rotation
                        });
                    }
                }
                
            } else {
                //Create simply the wall
                CreateWallMesh(this.meshes, {
                    width: thisroom.scale.width, 
                    height: thisroom.scale.height,
                    mat:  mat,
                    position : {
                        x : thisroom.position.x,
                        y : thisroom.position.y + (thisroom.scale.height / 2),
                        z : side_z
                    },
                    rotation : side_rotation
                });
            }
        }
        
        this.walls = {
        		back : {
        			name : "back",
        			warnNone: true,
        			doors : {
        				array : [],
        				meshes: [],
        				add : function (x, height, length){
        					heighttoadd = height;
        					if (height > thisroom.scale.height){
        						heighttoadd = thisroom.scale.height;
        					}
        					this.array.push({x: x, height: heighttoadd, length: length});
        				}
        			},
        			meshes: [],
        			side : 0,
        			Set : set_x
	        },
	        front : {
	            name : "front",
	            warnNone: true,
	            doors : {
	                array : [],
	                meshes: [],
	                add : function (x, height, length){
	                    heighttoadd = height;
	                    if (height > thisroom.scale.height){
	                        heighttoadd = thisroom.scale.height;
	                    }
	                    this.array.push({x: x, height: heighttoadd, length: length});
	                }
	            },
	            meshes: [],
	            side: 1,
	            Set : set_x
	        },
	        left : {
	            name : "left",
	            warnNone: true,
	            doors : {
	                array : [],
	                meshes: [],
	                add : function (x, height, length){
	                    heighttoadd = height;
	                    if (height > thisroom.scale.height){
	                        heighttoadd = thisroom.scale.height;
	                    }
	                    this.array.push({x: x, height: heighttoadd, length: length});
	                }
	            },
	            meshes: [],
	            side: 0,
	            Set : set_z
	        },
	        right : {
	            name : "right",
	            warnNone: true,
	            doors : {
	                array : [],
	                meshes: [],
	                add : function (x, height, length){
	                    heighttoadd = height;
	                    if (height > thisroom.scale.height){
	                        heighttoadd = thisroom.scale.height;
	                    }
	                    this.array.push({x: x, height: heighttoadd, length: length});
	                }
	            },
	            meshes: [],
	            side: 1,
	            Set : set_z
	        },
	        floor : {
	            name : "floor",
	            warnNone: true,
	            doors : {
	                array : [],
	                meshes: [],
	                add : function (x, height, length){
	                    console.warn("Doors Not implemented for floor");
	                    heighttoadd = height;
	                    if (height > thisroom.scale.height){
	                        heighttoadd = thisroom.scale.height;
	                    }
	                    this.array.push({x: x, height: heighttoadd, length: length});
	                }
	            },
	            meshes: [],
	            Set : function (mat){
	                //If there are doors
	                if (this.doors.array.length > 0){
	                    Console.log("Floor trap NYI");
	                    
	                } //else {
	                    //Create simply the wall
	                    CreateWallMesh(this.meshes, {
	                        width: thisroom.scale.width,
	                        height: thisroom.scale.deepth,
	                        mat:  mat,
	                        position : {
	                            x : thisroom.position.x,
	                            y : thisroom.position.y,
	                            z : thisroom.position.z
	                        },
	                        rotation : {
	                            x : 0, 
	                            y : 0,
	                            z : 0
	                        }
	                    });
	                //}
	            }
	        },
	        ceil : {
	        	name : "floor",
	            warnNone: true,
	            doors : {
	                array : [],
	                meshes: [],
	                add : function (x, height, length){
	                    console.warn("Doors Not implemented for ceil");
	                    heighttoadd = height;
	                    if (height > thisroom.scale.height){
	                        heighttoadd = thisroom.scale.height;
	                    }
	                    this.array.push({x: x, height: heighttoadd, length: length});
	                }
	            },
	            meshes: [],
	            Set : function (mat){
	                //If there are doors
	                if (this.doors.array.length > 0){
	                    Console.log("Ceil trap NYI");
	                    
	                } //else {
	                    //Create simply the wall
	                    CreateWallMesh(this.meshes, {
	                        width: thisroom.scale.width,
	                        height: thisroom.scale.deepth,
	                        mat:  mat,
	                        position : {
	                            x : thisroom.position.x,
	                            y : thisroom.position.y + thisroom.scale.height,
	                            z : thisroom.position.z
	                        },
	                        rotation : {
	                            x : Math.PI,
	                            y : 0,
	                            z : 0
	                        }
	                    });
	                //}
	            }
	        }
        };
        
        this.addscene = function(scene){
            
            if (this.walls.floor.meshes!=[]){
                for (var i=0;i<this.walls.floor.meshes.length;i++){
                    scene.add(this.walls.floor.meshes[i]);
                }
            } else if (this.walls.floor.warnNone){
                console.log("No Floor set");
            }
            
            if (this.walls.ceil.meshes!=[]){
                for (var i=0;i<this.walls.ceil.meshes.length;i++){
                    scene.add(this.walls.ceil.meshes[i]);
                }
            } else if (this.walls.ceil.warnNone){
                console.log("No Ceil set");
            }
            
            if (this.walls.front.meshes!=[]){
                for (var i=0;i<this.walls.front.meshes.length;i++){
                    scene.add(this.walls.front.meshes[i]);
                }
            } else if (this.walls.front.warnNone){
                console.log("No Front Wall set");
            }
            
            if (this.walls.back.meshes!=[]){
                for (var i=0;i<this.walls.back.meshes.length;i++){
                    scene.add(this.walls.back.meshes[i]);
                }
            } else if (this.walls.back.warnNone){
                console.log("No Back Wall set");
            }
            
            if (this.walls.left.meshes!=[]){
                for (var i=0;i<this.walls.left.meshes.length;i++){
                    scene.add(this.walls.left.meshes[i]);
                }
            } else if (this.walls.left.warnNone){
                console.log("No Left Wall set");
            }
            
            if (this.walls.right.meshes!=[]){
                for (var i=0;i<this.walls.right.meshes.length;i++){
                    scene.add(this.walls.right.meshes[i]);
                }
            } else if (this.walls.right.warnNone){
                console.log("No Right Wall set");
            }
        };    
    };