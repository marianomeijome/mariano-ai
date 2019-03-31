$(document).ready(function(){
    
    var effectComposer, ssaoPass;

    //create scene
    var scene = new THREE.Scene();


    //create camera
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.z = 50;



    //create renderer
    var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor( 0x000000, 0 ); // the default



    //get div for scene, named #turntable
    var container = document.getElementById('turntable');
    container.appendChild( renderer.domElement );

    //controls
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = .085;
    controls.enableZoom = false;
    controls.rotateSpeed = .05;
    controls.enablePan = false;

    //limit orbit Y controls
    controls.minPolarAngle = 1;
    controls.maxPolarAngle = 1;

    //lighting
    scene.add( new THREE.HemisphereLight( 0xffffff, 0x221113 ) );
    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.intensity =.5;
    light.position.set( 2, 2, 1 );
    light.castShadow = true;
    //bg
    //scene.background = new THREE.Color("rgb(200, 155, 200)");

    group = new THREE.Group();
    group.add(light);


    // GROUND
    var fakeShadow = new THREE.TextureLoader().load("/static/softShadow.png");
    var groundGeo = new THREE.PlaneBufferGeometry( 51, 44 );
    var groundMat = new THREE.MeshLambertMaterial( { map: fakeShadow, transparent: true } );
    var ground = new THREE.Mesh( groundGeo, groundMat );
    ground.position.set(0,0,-1.4)
    ground.rotation.x = -Math.PI/2;
    group.add( ground );
    ground.receiveShadow = "true";




    var diffuse = new THREE.TextureLoader().load( "/static/mac_diffuse.jpg" );

    var newMat = new THREE.MeshLambertMaterial({ 
        map: diffuse
    });

    var objLoader = new THREE.OBJLoader();
    objLoader.setPath('/static/obj/');
    objLoader.load('mac_01.obj', function (object) {
        object.uv2 = object.uv;
        object.traverse(function(child) {
           if(child instanceof THREE.Mesh)
           {
               child.material = newMat;
           }
        });
        group.add(object);
    });
    scene.add( group );
    camera.lookAt(scene.position);


    $(window).scroll(function(){
            if ($(this).scrollTop() >= 200 && $(this).scrollTop() <= 800){
                group.rotation.y += .01;
    //            camera.zoom += .1;
    //            camera.position.z += 2;
                camera.updateProjectionMatrix();
            }
    });


    // remember these initial values
    var tanFOV = Math.tan( ( ( Math.PI / 180 ) * camera.fov / 2 ) );
    var windowHeight = window.innerHeight;

    //lisen for window resize
    window.addEventListener( 'resize', onWindowResize, false );


    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        // adjust the FOV
        camera.fov = ( 360 / Math.PI ) * Math.atan( tanFOV * ( window.innerHeight / windowHeight ) );
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight);
    }


    var animate = function () {
        requestAnimationFrame( animate );
        //update
        group.rotation.y += 0.001;
        controls.update();

        renderer.render(scene, camera);
    };

    animate();
});
