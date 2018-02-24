/*
 * ---------------------------------------------------------------------------------------
 * proceduralCity
 * ---------------------------------------------------------------------------------------
 */



const proceduralCity = function() {
    const T = THREE;

    let     webglContainer, width, height,
            renderer,
            camera,
            scene,
            clock,
            firstPersonCtrls
    ;


    function init() {
        webglContainer = document.getElementById("webglContainer");
        width = webglContainer.offsetWidth;
        height = webglContainer.offsetHeight;

        // init renderer
        renderer = new T.WebGLRenderer({alpha: true, antialias: true});
        renderer.setSize(width, height);
        webglContainer.appendChild(renderer.domElement);

        // inti camera
        camera = new T.PerspectiveCamera(45, width / height, 0.1, 4000);
        camera.position.set(0, 150, 0);
        camera.lookAt(0, 0, 0);

        // init scene
        scene = new T.Scene();
        scene.fog = new T.FogExp2( 0xd0e0f0, 0.0007 );

        // axes helper
        let axesHelper = new T.AxesHelper(20);
        // scene.add(axesHelper);

        // light
        let light = new T.HemisphereLight( 0xfffff0, 0x101020, 1.25 );
        light.position.set( 0.75, 1, 0.25 );
        scene.add( light );

        // controls
        firstPersonCtrls = new T.FirstPersonControls( camera );
        firstPersonCtrls.movementSpeed = 80;
        firstPersonCtrls.lookSpeed = 0.08;
        firstPersonCtrls.lookVertical = true;

        // clock
        clock = new T.Clock();


        generateSkyBox();
        generateCity(8500);
        window.addEventListener("resize", onWindowResize, false);
        render();
    }


    function generateCity(n) {

        let plane = new T.Mesh( new T.PlaneGeometry( 2000, 2000 ), new T.MeshBasicMaterial( { color: 0x101018 } ) );
        plane.rotation.x = - 90 * Math.PI / 180;
        scene.add( plane );

        let cityGeometry = new T.Geometry();

        let geometry = new T.BoxGeometry( 1, 1, 1 );
        // change pivot from center to bottom of the cube
        geometry.applyMatrix(new T.Matrix4().makeTranslation( 0, 0.5, 0 ));

        // remove bottom side, because we will look from up to bottom
        geometry.faces.splice( 6, 2 );
        geometry.faceVertexUvs[0].splice( 6, 2 );

        // uv mapping modified for top side
        geometry.faceVertexUvs[0][4][0].set(0, 0);
        geometry.faceVertexUvs[0][4][1].set(0, 0);
        geometry.faceVertexUvs[0][4][2].set(0, 0);
        geometry.faceVertexUvs[0][5][0].set(0, 0);
        geometry.faceVertexUvs[0][5][1].set(0, 0);
        geometry.faceVertexUvs[0][5][2].set(0, 0);

        // building top/bottom colors
        let light = new T.Color( 0x1050ff );
        let shadow  = new T.Color( 0x303050 );
        let value = 1 - Math.random() * Math.random();
        let baseColor = new T.Color().setRGB( value + Math.random() * 0.1, value, value + Math.random() * 0.1 );
        let topColor  = baseColor.clone().multiply( light );
        let bottomColor = baseColor.clone().multiply( shadow );


        for (let i = 0; i < n; i++) {
            cityGeometry.mergeMesh(generateBuilding(geometry.clone(), topColor, bottomColor));
        }

        let texture   = new T.Texture( generateTexture() );
        texture.anisotropy  = renderer.capabilities.getMaxAnisotropy();
        texture.needsUpdate = true;

        let cityMesh = new T.Mesh(cityGeometry, new T.MeshBasicMaterial({vertexColors: T.VertexColors, map: texture}));
        scene.add(cityMesh);
    }


    function generateBuilding(geometry, topColor, bottomColor) {

        let sign = Math.round(Math.random()) * 2 - 1;
        let rndV = sign * Math.random() * Math.random() * Math.random() * Math.random() * 0.05;
        topColor.r = clamp(topColor.r + rndV);
        bottomColor.r = clamp(bottomColor.r + rndV * 0.1);

        geometry.faces[0].vertexColors =
            geometry.faces[2].vertexColors =
                geometry.faces[6].vertexColors =
                    geometry.faces[8].vertexColors = [topColor, bottomColor, topColor];

        geometry.faces[1].vertexColors =
            geometry.faces[3].vertexColors =
                geometry.faces[7].vertexColors =
                    geometry.faces[9].vertexColors = [bottomColor, bottomColor, topColor];

        geometry.faces[4].vertexColors =
            geometry.faces[5].vertexColors = [topColor, topColor, topColor];


        let mesh = new T.Mesh(geometry);

        mesh.position.x = Math.floor( Math.random() * 200 - 100 ) * 10;
        mesh.position.z = Math.floor( Math.random() * 200 - 100 ) * 10;
        mesh.rotation.y = Math.random()*Math.PI*2;
        mesh.scale.x  = Math.random()*Math.random()*Math.random()*Math.random() * 50 + 10;
        mesh.scale.z  = mesh.scale.x;
        mesh.scale.y  = (Math.random() * Math.random() * Math.random() * mesh.scale.x) * 8 + 8;

        return mesh;
    }


    function clamp(v) {
        if (v < 0) return 0;
        else if (v > 1) return 1;
        else return v;
    }


    function generateTexture() {

        let canvas = document.createElement( 'canvas' );
        canvas.width = 32;
        canvas.height = 64;

        let context = canvas.getContext( '2d' );
        context.fillStyle = '#ffffff';
        context.fillRect( 0, 0, 32, 64 );

        for ( let y = 2; y < 64; y += 2 ) {
            for ( let x = 0; x < 32; x += 2 ) {
                let value = Math.floor( Math.random() * 64 );
                context.fillStyle = 'rgb(' + [ value, value, value ].join( ',' )  + ')';
                context.fillRect( x, y, 2, 1 );
            }
        }

        let canvas2 = document.createElement( 'canvas' );
        canvas2.width = 512;
        canvas2.height = 1024;

        context = canvas2.getContext( '2d' );
        context.imageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.drawImage( canvas, 0, 0, canvas2.width, canvas2.height );

        return canvas2;
    }


    function generateSkyBox() {
        let loader = new T.CubeTextureLoader();

        let textures = [
            'app/assets/textures/nebula/left.jpg',
            'app/assets/textures/nebula/right.jpg',
            'app/assets/textures/nebula/top.jpg',
            'app/assets/textures/nebula/bottom.jpg',
            'app/assets/textures/nebula/front.jpg',
            'app/assets/textures/nebula/back.jpg'
        ];

        let textureCube = loader.load( textures );
        let shader = T.ShaderLib[ "cube" ];
        shader.uniforms[ "tCube" ].value = textureCube;
        let skyMaterial = new T.ShaderMaterial( {
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: T.BackSide
        } );
        skyMaterial.needsUpdate = true;

        let skyGeometry = new T.BoxGeometry( 3000, 3000, 3000, 1,1,1 );
        let skyBox = new T.Mesh( skyGeometry, skyMaterial );
        scene.add( skyBox );
    }


    function onWindowResize( event ) {
        width = webglContainer.offsetWidth;
        height = webglContainer.offsetHeight;
        renderer.setSize( width, height );
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }


    function render() {

        firstPersonCtrls.update(clock.getDelta());
        renderer.render(scene, camera);
        requestAnimationFrame(render);

    }


    // start scene
    init();
};


export { proceduralCity };