function ghostingTool(maxillary_file, mandibular_file) {
  var error_material;
  var gizmoManager;
  var spheres = []
  var upper_grp = []
  var lower_grp = []
  var my_pick_point = []
  var camera;
  var selected_obj = null;
  var tube = null;
  var saveStates = [];	
			
  let divFps = document.getElementById("fps");
  var clicks = []
  var pointClick = 0;
  var pink=1;
  var sphere_counter = 0;
  var measurement1;
	
  var upload = BABYLON.GUI.Button.CreateSimpleButton("upload button","Process");
  var clear = BABYLON.GUI.Button.CreateSimpleButton("clear_button","Inspector");
  let assetsDirectory = "https://neural-hive-3d-modules.s3.ap-south-1.amazonaws.com/demo/common/Assets/";
  let baseDirectory = "https://neural-hive-3d-modules.s3.ap-south-1.amazonaws.com/demo/ghostingTool/"

  function manage() {
    //alert('hi am working');
    console.log("test working ")
    //var bt = document.getElementById('btn');
    if (counter > 4) {
      //bt.disabled = false;
      //alert('test')
      upload.isVisible = true;
    }
    else {
      //bt.disabled = true;
      upload.isVisible = false;
    }
  }
  var canvas = document.getElementById("renderCanvas");

  var engine = null;
  var scene = null;
  var sceneToRender = null;
  var counter = 1;
  var rabbit;
  var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
       
	   var delayCreateScene = function () {
            
    var createGizmoScene = function(mainScene, mainCamera) {
      var scene2 = new BABYLON.Scene(engine);
      scene2.autoClear = false;

      var camera2 = new BABYLON.ArcRotateCamera("camera1",  5 * Math.PI / 8, 5 * Math.PI / 8, 30, new BABYLON.Vector3(0, 2, 0), scene2);

      // Where to display
      //camera2.viewport = new BABYLON.Viewport(0.8, 0.8, 0.2, 0.2);
      camera2.viewport = new BABYLON.Viewport(0.7, 0.7, 0.35, 0.35);

      // Dupplicate scene info
      mainScene.afterRender = () => {
        scene2.render();
        camera2.alpha = mainCamera.alpha;
        camera2.beta = mainCamera.beta;
        camera2.radius = 13;
      };

      //var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
      //var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(-1, -0.5, 0), scene2);
	 //light2.intensity = 8;
	 var redmaterial = new BABYLON.StandardMaterial("redmaterial", scene2);
      redmaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);
	
      var bluematerial = new BABYLON.StandardMaterial("bluematerial", scene2);
      bluematerial.emissiveColor = new BABYLON.Color3(0, 0, 1);
	
      var greenmaterial = new BABYLON.StandardMaterial("greenmaterial", scene2);
      greenmaterial.emissiveColor = new BABYLON.Color3(0, 1, 0);
    
      /*********************Create Box***************/
      var faceColors = [];
      faceColors[0] = BABYLON.Color3.Blue();
      faceColors[1] = BABYLON.Color3.White()
      faceColors[2] = BABYLON.Color3.Red();
      faceColors[3] = BABYLON.Color3.Black();
      faceColors[4] = BABYLON.Color3.Green();
      faceColors[5] = BABYLON.Color3.Yellow();
 
      var box = BABYLON.MeshBuilder.CreateBox("Box", {faceColors:faceColors, size:1}, scene2, true);
      box.material = new BABYLON.StandardMaterial("", scene2);
      var plane = BABYLON.MeshBuilder.CreatePlane("plane", {height:1, width: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene2)
      plane.position = new BABYLON.Vector3(0.55,0,0);
      var axis = new BABYLON.Vector3(0, 1, 0);
      plane.rotate(axis, 1.5708, BABYLON.Space.WORLD)
      plane.material = redmaterial;
	
      var plane = BABYLON.MeshBuilder.CreatePlane("plane", {height:1, width: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene2)
      plane.position = new BABYLON.Vector3(-0.55,0,0);
      var axis = new BABYLON.Vector3(0, 1, 0);
      plane.rotate(axis, 1.5708, BABYLON.Space.WORLD)
      plane.material = redmaterial;
	
      var plane = BABYLON.MeshBuilder.CreatePlane("plane", {height:1, width: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene2)
      plane.position = new BABYLON.Vector3(0,0,0.55);
      //var axis = new BABYLON.Vector3(0, 1, 0);
      //plane.rotate(axis, 1.5708, BABYLON.Space.WORLD)
      plane.material = bluematerial;
	
      var plane = BABYLON.MeshBuilder.CreatePlane("plane", {height:1, width: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene2)
      plane.position = new BABYLON.Vector3(0,0,-0.55);
      //var axis = new BABYLON.Vector3(0, 1, 0);
      //plane.rotate(axis, 1.5708, BABYLON.Space.WORLD)
      plane.material = bluematerial;
	
      var plane = BABYLON.MeshBuilder.CreatePlane("plane", {height:1, width: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene2)
      plane.position = new BABYLON.Vector3(0,0.55,0);
      var axis = new BABYLON.Vector3(1, 0, 0);
      plane.rotate(axis, 1.5708, BABYLON.Space.WORLD)
      plane.material = greenmaterial;
	
      var plane = BABYLON.MeshBuilder.CreatePlane("plane", {height:1, width: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene2)
      plane.position = new BABYLON.Vector3(0,-0.55,0);
      var axis = new BABYLON.Vector3(1, 0, 0);
      plane.rotate(axis, -1.5708, BABYLON.Space.WORLD)
      plane.material = greenmaterial;
    
      /***********Create and Draw Axes**************************************/
      var showAxis = function(size) {
        var makeTextPlane = function(text, color, size) {
          var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene2, true);
          dynamicTexture.hasAlpha = true;
          dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
          var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene2, true);
          plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene2);
          plane.material.backFaceCulling = false;
          plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
          plane.material.diffuseTexture = dynamicTexture;
          return plane;
        };
  
        var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
          new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
          new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
        ], scene2);
        axisX.color = new BABYLON.Color3(1, 0, 0);
        var xChar = makeTextPlane("X", "red", size / 5);
        xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
        var axisY = BABYLON.Mesh.CreateLines("axisY", [
          new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
          new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
        ], scene2);
        axisY.color = new BABYLON.Color3(0, 1, 0);
        var yChar = makeTextPlane("Y", "green", size / 5);
        yChar.position = new BABYLON.Vector3(1, 0.9 * size, -0.05 * size);
        var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
          new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
          new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
        ], scene2);
        axisZ.color = new BABYLON.Color3(0, 0, 1);
        var zChar = makeTextPlane("Z", "blue", size / 5);
        zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
      };
  
      showAxis(4);
    }
			
    var scene = new BABYLON.Scene(engine); 
    var gizmoManager = new BABYLON.GizmoManager(scene)
			
    // L  I  G  H  T  S  			
	
    //Adding Hemi - Left light
    var light3 = new BABYLON.HemisphericLight("Hemi_Left", new BABYLON.Vector3(0, 1, 1), scene);
    light3.intensity = 0.15;
	
    //Adding Hemi - Center light
    var light4 = new BABYLON.HemisphericLight("Hemi_Mid", new BABYLON.Vector3(-1, 0, 0), scene);
    light4.intensity = 0.4;
	
    //Adding Hemi - Right light
    var light5 = new BABYLON.HemisphericLight("Hemi_Right", new BABYLON.Vector3(1, 1, -1), scene);
    light5.intensity = 0.15;
        
    //Adding an Arc Rotate Camera
    camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    var faceColors = [];
    camera.setPosition(new BABYLON.Vector3(0, 5, 100));
    camera.attachControl(canvas, true);
    //bottom
    var boxa = BABYLON.Mesh.CreateBox("BoxA", 1.0, scene);
    boxa.position = new BABYLON.Vector3(10,-130,0);
    //top
    var boxb = BABYLON.Mesh.CreateBox("BoxB", 1.0, scene);
    boxb.position = new BABYLON.Vector3(-40,90,0);
    //right
    var boxc = BABYLON.Mesh.CreateBox("BoxC", 1.0, scene);
    boxc.position = new BABYLON.Vector3(0,0,-130);
    //left
    var boxd = BABYLON.Mesh.CreateBox("BoxD", 1.0, scene);
    boxd.position = new BABYLON.Vector3(0,0,130);
    //back
    var boxe = BABYLON.Mesh.CreateBox("BoxE", 1.0, scene);
    boxe.position = new BABYLON.Vector3(130,0,0);
    boxa.setEnabled(false)
    boxb.setEnabled(false)
    boxc.setEnabled(false)
    boxd.setEnabled(false)
    boxe.setEnabled(false)
			
    /*var groundMaterial = new BABYLON.GridMaterial("groundMaterial", scene);
			groundMaterial.majorUnitFrequency = 1;
			groundMaterial.minorUnitVisibility = 0.1;
			groundMaterial.gridRatio = 2;
			groundMaterial.backFaceCulling = false;
			groundMaterial.mainColor = new BABYLON.Color3(0.3, 0.3, 0.3);
			groundMaterial.lineColor = new BABYLON.Color3(0.3, 0.3, 0.3);
			groundMaterial.opacity = 0.2;
	
			var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, scene);
			ground.material = groundMaterial;
			
			var material = new BABYLON.GridMaterial("knotMaterial", scene);    
			material.majorUnitFrequency = 1;
			material.minorUnitVisibility = 0.35;
			material.gridRatio = 1;
			//material.mainColor = new BABYLON.Color3(0, 0, 0);
			material.opacity = 0.2;
			material.lineColor = new BABYLON.Color3(0.0, 1.0, 0.0);*/
			
    /*function showWorldAxis(size) {
    var makeTextPlane = function(text, color, size) {
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
        var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
        plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        plane.material.backFaceCulling = false;
        plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        plane.material.diffuseTexture = dynamicTexture;
    return plane;
     };
    var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
      BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
      new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
        ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
        ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};
			
	        showWorldAxis(5)*/
    const man = new VerticesManipulator(scene);
			 man.radius =1;
			 
			 var options = {
        	    //width: 20,
      // height: 20,
      //depth: 20,
      faceColors: faceColors
    };
        
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");

    //var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
		
		    error_material = new BABYLON.PBRMetallicRoughnessMaterial("error_material", scene);
    //sphere.material = pbr;
    //sphere.material = pbr;
        
    //pbr.baseColor = new BABYLON.Color3(0.99, 0.98, 0.93, 0.86);
    error_material.baseColor = new BABYLON.Color3(0.99, 0.98, 0.93, 0.86);
    //pbr.baseColor = new BABYLON.Color3(0.5, 1, 1, 0.86);
    error_material.metallic = 1.0;
    error_material.roughness = 0.4;
			
    //Load Environment SkyBox 
    //scene.createDefaultEnvironment({environmentTexture: "./textures/environment.dds"});
    var hdrTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData(baseDirectory+"textures/environment.env", scene);
    scene.environmentTexture = hdrTexture;
            
    //return scene;
    //___________________________________________________________________________________________________________________________________________
		
    // Gums Shader Test

    var pbr2 = new BABYLON.PBRMaterial("Gums", scene);
			
    pbr2.albedoColor = new BABYLON.Color3(1, 0.8, 0.8);
    pbr2.metallic = 0.26; // set to 1 to only use it from the metallicRoughnessTexture
    pbr2.roughness = 0.26; // set to 1 to only use it from the metallicRoughnessTexture
    //pbr2.metallicRoughnessTexture = new BABYLON.Texture("./textures/Teeth_Roughness.png", scene);
    pbr2.albedoTexture = new BABYLON.Texture(baseDirectory+"textures/Gums_06.jpg", scene);
    pbr2.metallicTexture = new BABYLON.Texture(baseDirectory+"textures/Teeth_Roughness.png", scene);
    //pbr2.reflectionTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("./textures/environment.dds", scene);
    //pbr2.bumpTexture = new BABYLON.Texture("./textures/Gums-veins.png", scene);
    //pbr2.microSurface = new BABYLON.Texture("./textures/Teeth_Roughness.png", scene);
    //pbr2.useMicroSurfaceFromReflectivityMapAlpha = false;
    pbr2.subSurface.isRefractionEnabled = true;
    pbr2.subSurface.refractionIntensity = 0.08;
    pbr2.subSurface.indexOfRefraction = 1.15;
    //pbr2.subSurface.thicknessTexture = new BABYLON.Texture(sphere + "./textures/Teeth_Roughness.png", scene, false, false);
    pbr2.subSurface.minimumThickness = 0.2;
    pbr2.subSurface.maximumThickness = 2;
    //pbr2.subSurface.isTranslucencyEnabled = true;
    //pbr2.subSurface.TranslucencyIntensity = 0.5;
    pbr2.subSurface.isScatteringEnabled = true;
    pbr2.subSurface.tintColor = new BABYLON.Color3(0.73, 0.73, 0.73);
    //pbr2.subSurface.tintColor = BABYLON.Color3.Teal();
		
    // Teeth Shader Test

    var pbr1 = new BABYLON.PBRMaterial("Teeth", scene);
			
    pbr1.albedoColor = new BABYLON.Color3(1, 0.98, 0.96);
    pbr1.metallic = 0; // set to 1 to only use it from the metallicRoughnessTexture
    pbr1.roughness = 0.14; // set to 1 to only use it from the metallicRoughnessTexture
    //pbr1.metallicRoughnessTexture = new BABYLON.Texture("./textures/Teeth_Roughness.png", scene);
    //pbr1.albedoTexture = new BABYLON.Texture("./textures/Tooth_Shade.jpg", scene);
    //pbr1.metallicTexture = new BABYLON.Texture("./textures/fluffyWool.jpg", scene);
    //pbr1.reflectionTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("./textures/environment.dds", scene);
    //pbr1.bumpTexture = new BABYLON.Texture("./textures/Teeth_Normal.png", scene);			
    //pbr1.microSurface = new BABYLON.Texture("./textures/Teeth_Roughness.png", scene);
    //pbr1.useMicroSurfaceFromReflectivityMapAlpha = false;
    pbr1.subSurface.isRefractionEnabled = true;
    pbr1.subSurface.refractionIntensity = 0.02;
    pbr1.subSurface.indexOfRefraction = 1.5;
    //pbr1.subSurface.thicknessTexture = new BABYLON.Texture(sphere + "./textures/Teeth_Roughness.png", scene, false, false);
    pbr1.subSurface.minimumThickness = 0.2;
    pbr1.subSurface.maximumThickness = 1.6;
    pbr1.subSurface.isTranslucencyEnabled = true;
    pbr1.subSurface.isScatteringEnabled = true;
    pbr1.subSurface.tintColor = new BABYLON.Color3(0.75, 0.73, 0.7);
    //pbr1.subSurface.tintColor = BABYLON.Color3.Teal();
		
    pbr1.backFaceCulling = false;
    pbr2.backFaceCulling = false;
		
    //___________________________________________________________________________________________________________________________________________
		
    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "220px";
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(panel);
						
    var set = BABYLON.GUI.Button.CreateSimpleButton("set");
    var image = new BABYLON.GUI.Image("set", assetsDirectory+"Frame 445 2.png");
    image.top = "-40%";
    image.left = "15%";
    image.width = "70px";
    image.height = "70px";
    advancedTexture.addControl(image); 
    set.top = "-40%";
    set.left = "15%";
    set.width = "50px";
    set.height = "50px";
    //rotate.color = "Red";
    set.fontSize = 15;
    set.background = "transparent";
    set.fontSize = "18px";
    set.cornerRadius = -15;
    set.onPointerUpObservable.add(function() {
      console.log('set');
			
      for(let i=0;i<2;i++){
			
        scene.meshes.forEach((m) => {
          scene.removeMesh(m);
          m.dispose();
            
        });
      }
		
      BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/3d/","Maxillary_gum.glb",scene,function (meshes){
        meshes[1].material = pbr2;
        meshes[1].forceSharedVertices()
      });
      BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/3d/","upper_tooth.glb",scene,function (meshes){
        for(let j=0; j<meshes.length; j++){
          meshes[j].material = pbr1;
          meshes[j].forceSharedVertices()
        }
      });
      BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/3d/","Mandibular_gum.glb",scene,function (meshes){
        meshes[1].material = pbr2;
        meshes[1].forceSharedVertices()
      });
      BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/3d/","lower_tooth.glb",scene,function (meshes){
        for(let j=0; j<meshes.length; j++){
          meshes[j].material = pbr1;
          meshes[j].forceSharedVertices()
        }
      });
			
      BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/3d/","Maxillary.glb",scene,function (meshes){
        meshes[1].material = pbr5;
        meshes[1].forceSharedVertices()
      });
			
      BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/3d/","Mandibular.glb",scene,function (meshes){
        meshes[1].material = pbr5;
        meshes[1].forceSharedVertices()
      });
			
      camera.position(v);
    });
    gui.addControl(set);
    advancedTexture.addControl(set);
			
    var Mand = BABYLON.GUI.Button.CreateSimpleButton("Mand");
    var image = new BABYLON.GUI.Image("Mand", assetsDirectory+"Mand-1 1.png");
    image.top = "-40%";
    image.left = "5%";
    image.width = "70px";
    image.height = "70px";
    advancedTexture.addControl(image); 
    Mand.top = "-40%";
    Mand.left = "5%";
    Mand.width = "50px";
    Mand.height = "50px";
    //Mand.color = "Red";
    Mand.fontSize = 15;
    Mand.background = "transparent";
    Mand.fontSize = "18px";
    Mand.cornerRadius = 10;
    Mand.onPointerUpObservable.add(function() {
      console.log('Mand');
      /*if(sphere == null){
			BABYLON.SceneLoader.ImportMesh("","Assets/","Mandibular.stl",scene,function (meshe){
			sphere=meshe[0];
			sphere.parent = box;
			camera.setTarget(sphere);
			if(cube != null){
			console.log("cube not null");
			scene.removeMesh(cube);
			cube=null;
			}
			//sphere.setEnabled(true)
			//cube.setEnabled(false)
			//sphere.setEnabled = true;
			//if(file==1);
			//{
			//sphere.setEnabled = true;
			//}
			});
			}*/
			
      for(let i=0;i<2;i++){
			
        scene.meshes.forEach((m) => {
          scene.removeMesh(m);
          m.dispose();
            
        });
      }
		
      BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/3d/","Mandibular_gum.glb",scene,function (meshes){
        meshes[1].material = pbr2;
        meshes[1].forceSharedVertices();
      });
      BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/3d/","lower_tooth.glb",scene,function (meshes){
        for(let j=0; j<meshes.length; j++){
          meshes[j].material = pbr1;
          meshes[j].forceSharedVertices();
        }
      });
			
      BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/3d/","Mandibular.glb",scene,function (meshes){
        meshes[1].material = pbr5;
        meshes[1].forceSharedVertices();
      });

    });
    gui.addControl(Mand);
    advancedTexture.addControl(Mand);
			
    var Max = BABYLON.GUI.Button.CreateSimpleButton("Max");
    var image = new BABYLON.GUI.Image("Max", assetsDirectory+"Max-1 1.png");
    image.top = "-40%";
    image.left = "-5%";
    image.width = "70px";
    image.height = "70px";
    advancedTexture.addControl(image); 
    Max.top = "-40%";
    Max.left = "-5%";
    Max.width = "50px";
    Max.height = "50px";
    //Max.color = "Red";
    Max.fontSize = 15;
    Max.background = "transparent";
    Max.fontSize = "18px";
    Max.cornerRadius = 10;
    Max.onPointerUpObservable.add(function() {
      console.log('Max');
      /*if(cube == null){
			BABYLON.SceneLoader.ImportMesh("","Assets/","Maxillary.stl",scene,function (meshes){
			cube=meshes[0];
			camera.setTarget(cube);
			
			//var center_of_origin = cube.getBoundingInfo().boundingBox.center;
			var center_of_origin = cube.getAbsolutePivotPoint()
			console.log("maxillary boundingBox center", center_of_origin)
			//var origin = BABYLON.Mesh.CreateSphere("origin", 3, 3, scene);
			//origin.position = center_of_origin
			//console.log("orign  pos", origin.position);
			
			var dummy = new BABYLON.Mesh("parent_maxillary", scene);
			dummy.position = center_of_origin
			
			cube.parent = dummy;
			
			//cube.parent = box;
			dummy.parent = box;
			//cube.material = matte;
			if(sphere != null){
			console.log("this is not null");
			scene.removeMesh(sphere);
			sphere = null;
			}
			//sphere.setEnabled(false)
			//cube.setEnabled(true)
			});
			}*/
			
      for(let i=0;i<2;i++){
			
        scene.meshes.forEach((m) => {
          scene.removeMesh(m);
          m.dispose();
            
        });
      }
		
      BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/3d/","Maxillary_gum.glb",scene,function (meshes){
        meshes[1].material = pbr2;
        meshes[1].forceSharedVertices();
      });
      BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/3d/","upper_tooth.glb",scene,function (meshes){
        for(let j=0; j<meshes.length; j++){
          meshes[j].material = pbr1;
          meshes[j].forceSharedVertices();
        }
      });
			
      BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/3d/","Maxillary.glb",scene,function (meshes){
        meshes[1].material = pbr5;
        meshes[1].forceSharedVertices();
      });

    });
    gui.addControl(Max);
    advancedTexture.addControl(Max);
			
    var back = BABYLON.GUI.Button.CreateSimpleButton("back");
    var image = new BABYLON.GUI.Image("back", assetsDirectory+"Back 2.png");
    image.top = "-18%";
    image.left = "45%";
    image.width = "48px";
    image.height = "48px";
    advancedTexture.addControl(image); 
    back.top = "-18%";
    back.left = "45%";
    back.width = "48px";
    back.height = "48px";
    //back.color = "Red";
    back.fontSize = 15;
    back.background = "transparent";
    back.fontSize = "18px";
    back.cornerRadius = "20px";
			
    /*var tooltipStack = new BABYLON.GUI.StackPanel();
             tooltipStack.top = '-20%';
             tooltipStack.left = "38%";

            scene.executeWhenReady(function(){
            var relativePositionX = buttonStack._measureForChildren.left;
            var relativePositionY = buttonStack._measureForChildren.top;
            console.log(relativePositionX);
            console.log(relativePositionY);
            // tooltipStack.left = relativePositionX;
            // tooltipStack.top = relativePositionY;
            tooltipStack.left = 50;
            tooltipStack.top = 50;

            console.log(tooltipStack.left);
            console.log(tooltipStack.top);
            });

            tooltipStack.background = "transparent";
            advancedTexture.addControl(tooltipStack);

            // console.log(tooltipStack);

            var label1 = new BABYLON.GUI.TextBlock();
            label1.text = 'back';
            label1.resizeToFit = true;
            label1.color = 'black';
            tooltipStack.addControl(label1);

            tooltipStack.width = "0%";*/

    /* var label2 = new BABYLON.GUI.TextBlock();
            label2.text = 'Attack 10 Defense 15';
            label2.resizeToFit = true;
            label2.color = 'white';
            tooltipStack.addControl(label2);*/

    /*back.onPointerEnterObservable.add(
                    (info) => {
                    tooltipStack.width = "10%"
                    // label1.resizeToFit = false;
                    // label1.width = 0;
                    // console.log(info);
                    }
            );
            back.onPointerOutObservable.add(
                    (info) => {
                    tooltipStack.width = "0%"
                    // label1.resizeToFit = true;
                    // console.log(info);
                    }
            );*/
			
    back.onPointerUpObservable.add(function() {
      console.log('back');
      camera.position=boxe.position;
      /*if(pink==1){
			var image = new BABYLON.GUI.Image("back", "Assets/Back 2.png");
			image.top = "-18%";
			image.left = "45%";
			image.width = "70px";
			image.height = "60px";
			advancedTexture.addControl(image); 
			pink=2;
			}
			//if(pink!=5 && pink!=2 && pink!=3 && pink!=4){
			if(pink!=5){
			var image = new BABYLON.GUI.Image("Top", "Assets/Top.png");
			image.top = "30%";
			image.left = "45%";
			image.width = "70px";
			image.height = "60px";
			advancedTexture.addControl(image);
			}*/
    });
    gui.addControl(back);
    advancedTexture.addControl(back);
			
    var Bottoom = BABYLON.GUI.Button.CreateSimpleButton("Bottoom");
    var image = new BABYLON.GUI.Image("Bottoom", assetsDirectory+"Bottoom 2.png");
    image.top = "-6%";
    image.left = "45%";
    image.width = "48px";
    image.height = "48px";
    advancedTexture.addControl(image); 
    Bottoom.top = "-6%";
    Bottoom.left = "45%";
    Bottoom.width = "48px";
    Bottoom.height = "48px";
    //Bottoom.color = "Red";
    Bottoom.fontSize = 15;
    Bottoom.background = "transparent";
    Bottoom.fontSize = "18px";
    Bottoom.cornerRadius = "20px";
    /*var tooltipStack1 = new BABYLON.GUI.StackPanel();
             tooltipStack1.top = '-10%';
             tooltipStack1.left = "38%";

            scene.executeWhenReady(function(){
            var relativePositionX = buttonStack._measureForChildren.left;
            var relativePositionY = buttonStack._measureForChildren.top;
            console.log(relativePositionX);
            console.log(relativePositionY);
            // tooltipStack.left = relativePositionX;
            // tooltipStack.top = relativePositionY;
            tooltipStack1.left = 50;
            tooltipStack1.top = 50;

            console.log(tooltipStack1.left);
            console.log(tooltipStack1.top);
            });

            tooltipStack1.background = "transparent";
            advancedTexture.addControl(tooltipStack1);

            // console.log(tooltipStack1);

            var label1 = new BABYLON.GUI.TextBlock();
            label1.text = 'Bottoom';
            label1.resizeToFit = true;
            label1.color = 'black';
            tooltipStack1.addControl(label1);

            tooltipStack1.width = "0%";*/

    /* var label2 = new BABYLON.GUI.TextBlock();
            label2.text = 'Attack 10 Defense 15';
            label2.resizeToFit = true;
            label2.color = 'white';
            tooltipStack1.addControl(label2);*/

    /*Bottoom.onPointerEnterObservable.add(
                    (info) => {
                    tooltipStack1.width = "10%"
                    // label1.resizeToFit = false;
                    // label1.width = 0;
                    // console.log(info);
                    }
            );
            Bottoom.onPointerOutObservable.add(
                    (info) => {
                    tooltipStack1.width = "0%"
                    // label1.resizeToFit = true;
                    // console.log(info);
                    }
            );*/

    Bottoom.onPointerUpObservable.add(function() {
      console.log('Bottoom');
      camera.position=boxa.position;
      camera.alpha=-9.40;
      /*if(pink==2){
			var image = new BABYLON.GUI.Image("Bottoom", "Assets/Bottoom 2.png");
			image.top = "-6%";
			image.left = "45%";
			image.width = "70px";
			image.height = "60px";
			advancedTexture.addControl(image);
			pink=3;
			}
			//if(pink!=1 && pink!=3 && pink!=4 && pink!=5){
			if(pink!=1){
			var image = new BABYLON.GUI.Image("back", "Assets/Back 1.png");
			image.top = "-18%";
			image.left = "45%";
			image.width = "70px";
			image.height = "60px";
			advancedTexture.addControl(image); 
			}*/
    });
    gui.addControl(Bottoom);
    advancedTexture.addControl(Bottoom);
			
    var Left = BABYLON.GUI.Button.CreateSimpleButton("Left");
    var image = new BABYLON.GUI.Image("Left", assetsDirectory+"Left 2.png");
    image.top = "6%";
    image.left = "45%";
    image.width = "48px";
    image.height = "48px";
    advancedTexture.addControl(image); 
    Left.top = "6%";
    Left.left = "45%";
    Left.width = "48px";
    Left.height = "48px";
    //Left.color = "Red";
    Left.fontSize = 15;
    Left.background = "transparent";
    Left.fontSize = "18px";
    Left.cornerRadius = "20px";
			
    /*var tooltipStack2 = new BABYLON.GUI.StackPanel();
             tooltipStack2.top = '10%';
             tooltipStack2.left = "38%";

            scene.executeWhenReady(function(){
            var relativePositionX = buttonStack._measureForChildren.left;
            var relativePositionY = buttonStack._measureForChildren.top;
            console.log(relativePositionX);
            console.log(relativePositionY);
            // tooltipStack.left = relativePositionX;
            // tooltipStack.top = relativePositionY;
            tooltipStack2.left = 50;
            tooltipStack2.top = 50;

            console.log(tooltipStack2.left);
            console.log(tooltipStack2.top);
            });

            tooltipStack2.background = "transparent";
            advancedTexture.addControl(tooltipStack2);

            // console.log(tooltipStack);

            var label1 = new BABYLON.GUI.TextBlock();
            label1.text = 'Left';
            label1.resizeToFit = true;
            label1.color = 'black';
            tooltipStack2.addControl(label1);

            tooltipStack2.width = "0%";*/

    /* var label2 = new BABYLON.GUI.TextBlock();
            label2.text = 'Attack 10 Defense 15';
            label2.resizeToFit = true;
            label2.color = 'white';
            tooltipStack.addControl(label2);*/

    /*Left.onPointerEnterObservable.add(
                    (info) => {
                    tooltipStack2.width = "10%"
                    // label1.resizeToFit = false;
                    // label1.width = 0;
                    // console.log(info);
                    }
            );
            Left.onPointerOutObservable.add(
                    (info) => {
                    tooltipStack2.width = "0%"
                    // label1.resizeToFit = true;
                    // console.log(info);
                    }
            );*/
			
    Left.onPointerUpObservable.add(function() {
      console.log('Left');
      camera.position=boxd.position;
      /*if(pink==3){
			var image = new BABYLON.GUI.Image("Left", "Assets/Left 2.png");
			image.top = "6%";
			image.left = "45%";
			image.width = "70px";
			image.height = "60px";
			advancedTexture.addControl(image);
			pink=4;
			}
			//if(pink!=2 && pink!=1 && pink!=4 && pink!=5){
			if(pink!=2){
			var image = new BABYLON.GUI.Image("Bottoom", "Assets/Bottoom 1.png");
			image.top = "-6%";
			image.left = "45%";
			image.width = "70px";
			image.height = "60px";
			advancedTexture.addControl(image); 
			}*/
    });
    gui.addControl(Left);
    advancedTexture.addControl(Left);
			
    var Right = BABYLON.GUI.Button.CreateSimpleButton("Right");
    var image = new BABYLON.GUI.Image("Right", assetsDirectory+"Right 2.png");
    image.top = "18%";
    image.left = "45%";
    image.width = "48px";
    image.height = "48px";
    advancedTexture.addControl(image); 
    Right.top = "18%";
    Right.left = "45%";
    Right.width = "48px";
    Right.height = "48px";
    //Right.color = "Red";
    Right.fontSize = 15;
    Right.background = "transparent";
    Right.fontSize = "18px";
    Right.cornerRadius = "20px";
			
    /*var tooltipStack4 = new BABYLON.GUI.StackPanel();
             tooltipStack4.top = '20%';
             tooltipStack4.left = "38%";

            scene.executeWhenReady(function(){
            var relativePositionX = buttonStack._measureForChildren.left;
            var relativePositionY = buttonStack._measureForChildren.top;
            console.log(relativePositionX);
            console.log(relativePositionY);
            // tooltipStack.left = relativePositionX;
            // tooltipStack.top = relativePositionY;
            tooltipStack4.left = 50;
            tooltipStack4.top = 50;

            console.log(tooltipStack4.left);
            console.log(tooltipStack4.top);
            });

            tooltipStack4.background = "transparent";
            advancedTexture.addControl(tooltipStack4);

            // console.log(tooltipStack);

            var label1 = new BABYLON.GUI.TextBlock();
            label1.text = 'Right';
            label1.resizeToFit = true;
            label1.color = 'black';
            tooltipStack4.addControl(label1);

            tooltipStack4.width = "0%";*/

    /* var label2 = new BABYLON.GUI.TextBlock();
            label2.text = 'Attack 10 Defense 15';
            label2.resizeToFit = true;
            label2.color = 'white';
            tooltipStack.addControl(label2);*/

    /*Right.onPointerEnterObservable.add(
                    (info) => {
                    tooltipStack4.width = "10%"
                    // label1.resizeToFit = false;
                    // label1.width = 0;
                    // console.log(info);
                    }
            );
            Right.onPointerOutObservable.add(
                    (info) => {
                    tooltipStack4.width = "0%"
                    // label1.resizeToFit = true;
                    // console.log(info);
                    }
            );*/
			
    Right.onPointerUpObservable.add(function() {
      console.log('Right');
      camera.position=boxc.position;
      /*if(pink==4){
			var image = new BABYLON.GUI.Image("Right", "Assets/Right 2.png");
			image.top = "18%";
			image.left = "45%";
			image.width = "70px";
			image.height = "60px";
			advancedTexture.addControl(image);
			pink=5;
			}
			//if(pink!=3 && pink!=1 && pink!=2 && pink!=5){
			if(pink!=3){
			var image = new BABYLON.GUI.Image("Left", "Assets/Left 1.png");
			image.top = "6%";
			image.left = "45%";
			image.width = "70px";
			image.height = "60px";
			advancedTexture.addControl(image); 
			}*/
    });
    gui.addControl(Right);
    advancedTexture.addControl(Right);
			
    var Top = BABYLON.GUI.Button.CreateSimpleButton("Top");
    var image = new BABYLON.GUI.Image("Top", assetsDirectory+"Top 2.png");
    image.top = "30%";
    image.left = "45%";
    image.width = "48px";
    image.height = "48px";
    advancedTexture.addControl(image); 
    Top.top = "30%";
    Top.left = "45%";
    Top.width = "48px";
    Top.height = "48px";
    //Top.color = "Red";
    Top.fontSize = 15;
    Top.background = "transparent";
    Top.fontSize = "18px";
    Top.cornerRadius = "20px";
			
    /*var tooltipStack5 = new BABYLON.GUI.StackPanel();
             tooltipStack5.top = '30%';
             tooltipStack5.left = "38%";

            scene.executeWhenReady(function(){
            var relativePositionX = buttonStack._measureForChildren.left;
            var relativePositionY = buttonStack._measureForChildren.top;
            console.log(relativePositionX);
            console.log(relativePositionY);
            // tooltipStack.left = relativePositionX;
            // tooltipStack.top = relativePositionY;
            tooltipStack5.left = 50;
            tooltipStack5.top = 50;

            console.log(tooltipStack5.left);
            console.log(tooltipStack5.top);
            });

            tooltipStack5.background = "transparent";
            advancedTexture.addControl(tooltipStack5);

            // console.log(tooltipStack);

            var label1 = new BABYLON.GUI.TextBlock();
            label1.text = 'Top';
            label1.resizeToFit = true;
            label1.color = 'black';
            tooltipStack5.addControl(label1);

            tooltipStack5.width = "0%";*/

    /* var label2 = new BABYLON.GUI.TextBlock();
            label2.text = 'Attack 10 Defense 15';
            label2.resizeToFit = true;
            label2.color = 'white';
            tooltipStack.addControl(label2);*/

    /*Top.onPointerEnterObservable.add(
                    (info) => {
                    tooltipStack5.width = "10%"
                    // label1.resizeToFit = false;
                    // label1.width = 0;
                    // console.log(info);
                    }
            );
            Top.onPointerOutObservable.add(
                    (info) => {
                    tooltipStack5.width = "0%"
                    // label1.resizeToFit = true;
                    // console.log(info);
                    }
            );*/
			
    Top.onPointerUpObservable.add(function() {
      console.log('Top');
      camera.position=boxb.position;
      /*if(pink==5){
			var image = new BABYLON.GUI.Image("Top", "Assets/Top 2.png");
			image.top = "30%";
			image.left = "45%";
			image.width = "70px";
			image.height = "60px";
			image.cornerRadius = 10;
			advancedTexture.addControl(image);
			//pink=6;
			}
			if(pink!=4){
			var image = new BABYLON.GUI.Image("Right", "Assets/Right 1.png");
			image.top = "18%";
			image.left = "45%";
			image.width = "70px";
			image.height = "60px";
			image.cornerRadius = 10;
			advancedTexture.addControl(image); 
			}*/
    });
    gui.addControl(Top);
    advancedTexture.addControl(Top);
			
    var hl1 = new BABYLON.HighlightLayer("hl1", scene);
			
    var hl2 = new BABYLON.HighlightLayer("hl2", scene);
			
    var rotate = BABYLON.GUI.Button.CreateSimpleButton("rotated");
    var image = new BABYLON.GUI.Image("rotated", baseDirectory+"textures/rotate1.png");
    image.top = "-30%";
    image.left = "-47%";
    image.width = "60px";
    image.height = "60px";
    advancedTexture.addControl(image); 
			
    rotate.top = "-30%";
    rotate.left = "-47%";
    rotate.width = "60px";
    rotate.height = "60px";
    rotate.color = "white";
    rotate.fontSize = 15;
    rotate.background = "transparent";
    rotate.fontSize = "18px";
    rotate.cornerRadius = "20px";
    rotate.onPointerUpObservable.add(function() {
      console.log('rotate');
      /*//gizmo.updateGizmoRotationToMatchAttachedMesh = true;
				//gizmo.updateGizmoPositionToMatchAttachedMesh = false;
				
				var utilLayer = new BABYLON.UtilityLayerRenderer(scene);

    // Create the gizmo and attach to the sphere
    //var gizmo = new BABYLON.PositionGizmo(utilLayer);
	var gizmo = new BABYLON.RotationGizmo(utilLayer);
    gizmo.attachedMesh = rabbit;
	gizmo.attachedMesh = Tooth_1;*/
	
      gizmoManager.positionGizmoEnabled = false;
      gizmoManager.rotationGizmoEnabled = true;
      var checker;	
      gizmoManager.gizmos.rotationGizmo.xGizmo.dragBehavior.onDragEndObservable.add((e) => {	
        console.log(selected_obj, "selected obj")				
        saveStates.push({"nameMesh": selected_obj.name, "position": selected_obj.position});
       
        gizmo.updateGizmoRotationToMatchAttachedMesh = true;

      });
    });
    //gui.addControl(rotate);
    advancedTexture.addControl(rotate);
			
    var images = new BABYLON.GUI.Image("translate", baseDirectory+"textures/translate.png");
    images.top = "-17%";
    images.left = "-47%";
    images.width = "60px";
    images.height = "60px";
    advancedTexture.addControl(images);
    var translate = BABYLON.GUI.Button.CreateSimpleButton("Translate");
    translate.top = "-20%";
    translate.left = "-47%";
    translate.width = "50px";
    translate.height = "50px";
    translate.color = "white";
    translate.fontSize = 15;
    translate.background = "transparent";
    translate.fontSize = "18px";
    translate.cornerRadius = "20px";
			
    function regenerate_curve(){
	
      if(tube != null){
        tube.dispose();
      }
      var points1 = [];
      for(var j=0;j<clicks.length;j++){
        //points1.push(clicks[j].position);
        points1.push(my_pick_point[j].getAbsolutePivotPoint());
        //my_pick_point[j].setEnabled(false);
      }
			
      var catmullRom = BABYLON.Curve3.CreateCatmullRomSpline(points1, 16, true); // for selected vertex
      //var catmullRom = BABYLON.Curve3.CreateQuadraticBezier(points[0], points[1], points[2], 3);
      console.log("curve points", catmullRom.getPoints());
      var new_near_points = [];
	
      nearestpoint = BABYLON.Vector3.Zero();
			
      var all_points = catmullRom.getPoints();
      for(let n = 0; n<all_points.length; n++){
        var worldPos = all_points[n];
        nearestpoint = all_points[n];
        //	lower_grp[4]
	
        var index = lower_grp[4].getClosestFacetAtCoordinates(all_points[n].x, all_points[n].y, all_points[n].z);  // If i change the second parameter to 115 I get a facet index. 
        console.log("lower_grp", lower_grp[4]);
        if (index != null) {
          worldPos = lower_grp[4].getFacetPosition(index);
          console.log("this is worldpos of nearestpoint-",n, worldPos);
		
        }
        new_near_points.push(worldPos);
	
      }
      var catmullRomSpline = BABYLON.Mesh.CreateLines("catmullRom", catmullRom.getPoints(), scene);
      //var catmullRomSpline = BABYLON.Mesh.CreateLines("catmullRom", new_near_points, scene);
      catmullRomSpline.color = new BABYLON.Color3(0.9, 0.07, 0.07);
      catmullRomSpline.checkCollisions = true;
      var mySinus = [];
      var radius = 10;
      var path1 = catmullRom.getPoints();
      for (var i = -Math.PI; i <= Math.PI; i+=Math.PI/360) {
        mySinus.push( new BABYLON.Vector3(radius*Math.cos(i),0, radius*Math.sin(i)) );
      }

      const options = {
        path: path1, //vec3 array,
        //path: new_near_points, //vec3 array,
        updatable: true,
        radius: 0.3
      }

      tube = BABYLON.MeshBuilder.CreateTube("tube", options, scene);
      tube.checkcollisions = true;
      tube.ellipsoid = new BABYLON.Vector3(55, 1, 10);

      var bluematerial = new BABYLON.StandardMaterial("bluematerial", scene);
      bluematerial.emissiveColor = new BABYLON.Color3(0, 0, 1);
	
      tube.material = bluematerial;
    }
	
    translate.onPointerUpObservable.add(function() {
      console.log('translate')
			
      gizmoManager.positionGizmoEnabled = true;
      gizmoManager.rotationGizmoEnabled = false;
      var checker;	
      gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.onDragEndObservable.add((e) => {	
        console.log(selected_obj, "selected obj")				
        saveStates.push({"nameMesh": selected_obj.name, "position": selected_obj.position});

        console.log(saveStates);

        checker = 0;
			
        gizmo.updateGizmoRotationToMatchAttachedMesh = true;
        regenerate_curve();
				
      });
	
      gizmoManager.gizmos.positionGizmo.yGizmo.dragBehavior.onDragEndObservable.add((e) => {	
	
        console.log("y drag");
        regenerate_curve();
      });
      gizmoManager.gizmos.positionGizmo.zGizmo.dragBehavior.onDragEndObservable.add((e) => {	
        console.log("z drag");
        regenerate_curve();
      });
    });
				
    //gui.addControl(translate);
    advancedTexture.addControl(translate);
        
    /*var header = new BABYLON.GUI.TextBlock();
            header.text = "Radius";
            header.height = "30px";
            header.color = "white";
            panel.addControl(header);*/
			
    /*var slider = new BABYLON.GUI.Slider();
            slider.minimum = 0;
            slider.maximum = 20;
            slider.value = 5;
            slider.height = "20px";
            slider.width = "200px";*/
			
    clear.top = "30%";
    clear.left = "35%";
    clear.width = "90px";
    clear.height = "40px";
    clear.color = "white";
    clear.background = "transparent";
    clear.cornerRadius = 5;
    clear.onPointerClickObservable.add(function () {
      console.log("clearall")
      scene.debugLayer.show();
      /*for(let i=0;i< lower_grp.length; i++){
			lower_grp[i].renderOutline = true;
            lower_grp[i].outlineWidth = 20.2;
            lower_grp[i].outlineColor = BABYLON.Color3.Black();
			}*/
      nearestpoint = BABYLON.Vector3.Zero();
      console.log("my click points", clicks[0].position.x);
      var index = rabbit.getClosestFacetAtCoordinates(clicks[0].position.x, clicks[0].position.y, clicks[0].position.z, nearestpoint);  // If i change the second parameter to 115 I get a facet index. 
      console.log("my index", index);
      if (index != null) {
        worldPos = rabbit.getFacetPosition(index);
        console.log("this is worldpos of nearestpoint", worldPos);
        //var origin = BABYLON.Mesh.CreateSphere("origin", 4, 0.3, scene);
        //origin.position = worldPos;
      }
	
      //localStorage.clear();
		    //counter = 1;
      //upload.isVisible = false;
    });
			
    upload.top = "40%";
    upload.left = "35%";
    upload.width = "90px";
    upload.height = "40px";
    upload.color = "white";
    upload.background = "transparent";
    upload.cornerRadius = 5;
    upload.isVisible = false;
    upload.onPointerClickObservable.add(function () {
      //alert("mytest")
      console.log("start");
      var xhr;
      if (window.XMLHttpRequest) xhr = new XMLHttpRequest(); // all browsers 
      else xhr = new ActiveXObject("Microsoft.XMLHTTP"); 	// for IE
 
      var url = 'http://127.0.0.1:5000/alignProcess?first_point='+localStorage.getItem("first")+'&second_point='+localStorage.getItem("second")+'&third_point='+localStorage.getItem("third")+'&fourth_point='+localStorage.getItem("fourth")+'&timestamp='+sessionStorage.getItem('timestamp');
      xhr.open('GET', url, false);
      xhr.onreadystatechange = function () {
        if (xhr.readyState===4 && xhr.status===200) {
          //var div = document.getElementById('update');
          //document.getElementById("trip_li").value = xhr.responseText;
          //=JSON.parse(xhr.responseText);
          console.log("response", xhr.responseText);
          alert("Process Complete Successfully ")
          location.href='index1.html';
        }
			    }
      xhr.send();
      console.log("end");
    });
			
    //button.thickness = 4;
    //button.children[0].color = "#DFF9FB";
    //button.children[0].fontSize = 24;
    //button.color = "#FF7979";
    //button.background = "#EB4D4B";

    /*slider.onValueChangedObservable.add(function(value) {
                man.radius = value;
                if(man.selectedHit){
                    man.selectVertices(man.selectedHit);
                }
				
				var xhr;
			if (window.XMLHttpRequest) xhr = new XMLHttpRequest(); // all browsers 
			else xhr = new ActiveXObject("Microsoft.XMLHTTP"); 	// for IE
 
			var url = 'http://127.0.0.1:5000/alignProcess?first_point='+localStorage.getItem("first")+'&second_point='+localStorage.getItem("second")+'&third_point='+localStorage.getItem("third")+'&fourth_point='+localStorage.getItem("fourth");
			xhr.open('GET', url, false);
			xhr.onreadystatechange = function () {
				if (xhr.readyState===4 && xhr.status===200) {
					//var div = document.getElementById('update');
                                        //document.getElementById("trip_li").value = xhr.responseText;
                                        //=JSON.parse(xhr.responseText);
										console.log("response", xhr.responseText);
                        }
			    }
			xhr.send();
				
            });*/
    //gui.addControl(clear);  
    gui.addControl(upload);    
    //gui.addControl(calculate_collision);			
    var Tooth_1;
			
    //var grp_mesh1 = '';
			
    BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/3d/", "tooth.glb", scene, function (meshes) { 
      Tooth_1 = meshes[1];
      selected_obj = meshes[1];
			 
      console.log("this is overall meshes", meshes[1].name)
      var mesh_name = meshes[1].name;
      mesh_name = mesh_name.split(" ");
      console.log(mesh_name[0],"dif", mesh_name[1]);
			
      console.log("meshcount", meshes.length);
      for(let i=1; i<meshes.length;i++){
        meshes[i].forceSharedVertices();
        meshes[i].checkcollisions = true;
        //hl1.addMesh(meshes[i], BABYLON.Color3.White());
        //meshes[i].bakeCurrentTransformIntoVertices();
        var mesh_name = meshes[i].name;
			
        mesh_name = mesh_name.split(" ");
        if(parseInt(mesh_name[1]) < 16){
          upper_grp.push(meshes[i])
        }
        else{
          lower_grp.push(meshes[i])
        }
        meshes[i].material = pbr1;
        //pbr1.wireframe = true;
        spheres.push(meshes[i])
      }
      //grp_mesh1 = BABYLON.Mesh.MergeMeshes([meshes[1], meshes[2]]);
    })
    console.log("upper grp", upper_grp)
    console.log("lower grp", lower_grp)
    console.log("lower grp1", lower_grp)
			
    var displayWorldAxis = function () {
        		var origin = new BABYLON.Vector3(0, 0, 0);
      var xNormal = new BABYLON.Vector3(100, 0, 0);
      var yNormal = new BABYLON.Vector3(0, 100, 0);
      var zNormal = new BABYLON.Vector3(0, 0, 100);
        		return null;
        	};
        	
        	var displayMeshAxis = function (mesh) {
        		
        		mesh.computeWorldMatrix();
      var matrix = mesh.getWorldMatrix();
        		var origin = mesh.position;
                    	
        		// find existing axis for this box and dispose
              	var xAxis = scene.getMeshByName("xAxis"+mesh.name);
      var yAxis = scene.getMeshByName("yAxis"+mesh.name);
      var zAxis = scene.getMeshByName("zAxis"+mesh.name);
      if (xAxis!=null){ xAxis.dispose();}
      if (yAxis!=null){ yAxis.dispose();}
      if (zAxis!=null){ zAxis.dispose();}
        
        		// calculate new normals for this mesh in world coordinate system
        		var xNormal=BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(100,0,0),matrix);
      var yNormal=BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0,100,0),matrix);
      var zNormal=BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0,0,100),matrix);
        		// create axis lines
      xAxis = BABYLON.Mesh.CreateDashedLines("xAxis"+mesh.name, [origin, xNormal],3,10,200, scene, false);
      xAxis.color = BABYLON.Color3.Red();
      yAxis = BABYLON.Mesh.CreateDashedLines("yAxis"+mesh.name, [origin, yNormal],3,10,200, scene, false);
      yAxis.color = BABYLON.Color3.Green();
      zAxis = BABYLON.Mesh.CreateDashedLines("zAxis"+mesh.name, [origin, zNormal],3,10,200, scene, false);
      zAxis.color = BABYLON.Color3.Blue();
        		
        		scene.render();
        		//return null;
        	};
			
		    //var grp_mesh1 = BABYLON.Mesh.MergeMeshes(upper_grp, false, true, undefined, true, true);
    //var grp_mesh2 = BABYLON.Mesh.MergeMeshes(lower_grp);
        
    var utilLayer = new BABYLON.UtilityLayerRenderer(scene);

    // Create the gizmo and attach to the sphere
    var gizmo = new BABYLON.PositionGizmo(utilLayer);
    gizmo.attachedMesh = Tooth_1;
    var pbr5 = new BABYLON.PBRMaterial("Ghosting", scene);
			
    pbr5.albedoColor = new BABYLON.Color3(0.141, 0.282, 0.804);
    pbr5.metallic = 0.08;
    pbr5.roughness = 0.3;
    pbr5.alpha = 1;
    pbr5.alphaMode = BABYLON.Engine.ALPHA_ADD
    pbr5.indexOfRefraction = 1.3;
			
    BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/ghosting/", "Maxillary.glb", scene, function (meshes) {  
      meshes[1].material = pbr5;
      meshes[1].forceSharedVertices();
    })			
			
    BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/ghosting/", "Mandibular.glb", scene, function (meshes) {
      meshes[1].material = pbr5;
      meshes[1].forceSharedVertices();			
    })			
    BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/3d/", "gums.glb", scene, function (meshes) {          
                
      meshes[1].forceSharedVertices();
      meshes[2].forceSharedVertices();
      //meshes[1].bakeCurrentTransformIntoVertices();
      //meshes[2].bakeCurrentTransformIntoVertices();
      //camera.setTarget(meshes[2].position);
      //meshes[2].minimizeVertices();
      rabbit = meshes[1];
      camera.setTarget(rabbit);
      //camera.setTarget(selected_obj);
      meshes[2].material = pbr2;
      rabbit.material = pbr2;
      //meshes[2].enableEdgesRendering();
	
      meshes[2].edgesWidth = 3.0;
      //rabbit.enableEdgesRendering();
	
      rabbit.edgesWidth = 3.0;
				
      //hl2.addMesh(meshes[2], BABYLON.Color3.Red());
      //hl2.addMesh(rabbit, BABYLON.Color3.Red());
      console.log("jaws", meshes[1].name, meshes[2].name)
      console.log("before parent", upper_grp[1])
      for(let j =0; j<lower_grp.length;j++){
        console.log("working")
        //lower_grp[j].parent = meshes[1]; 
      }
      for(let j =0; j<upper_grp.length;j++){
        //upper_grp[j].parent = meshes[2]; 
      }
      spheres.push(meshes[1])
      spheres.push(meshes[2])
      console.log("after parent", upper_grp)
      var utilLayer = new BABYLON.UtilityLayerRenderer(scene);
        
      // Create the gizmo and attach to the sphere
			
      /*var gizmoManager = new BABYLON.GizmoManager(scene)
			if(button1 == gizmoManager){
			gizmoManager.positionGizmoEnabled = true;
			}else{
			gizmoManager.rotationGizmoEnabled = false;
			}*/
      //gizmoManager.scaleGizmoEnabled = false;
			
      //gizmoManager.usePointerToAttachGizmos = true;
      for(let j =0; j<my_pick_point.length; j++){
        spheres.push(my_pick_point[j]);
      }
      gizmoManager.attachableMeshes = spheres
      //gizmoManager.attachableMeshes = grp_mesh1
	
      /*var gizmo = new BABYLON.PositionGizmo(utilLayer);
            gizmo.attachedMesh = meshes[2];
			//gizmo.attachableMeshes = meshes;
			
			// Keep the gizmo fixed to world rotation
            gizmo.updateGizmoRotationToMatchAttachedMesh = false;
            gizmo.updateGizmoPositionToMatchAttachedMesh = true;*/
      /*rabbit.isPickable = true;
				//console.log("my pivot", rabbit.getAbsolutePivotPoint());
				//rabbit.translate(new BABYLON.Vector3(-1.90875756, -37.82214768, -4.03686849), 3, BABYLON.Space.LOCAL);
                const testMeshes = [rabbit,Tooth_1];
                console.log(rabbit.name)
        
                const positions = rabbit.getVerticesData(BABYLON.VertexBuffer.PositionKind);
                rabbit.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions, true);
                const normals = rabbit.getVerticesData(BABYLON.VertexBuffer.NormalKind);
                rabbit.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals, true);
        
                scene.onPointerObservable.add((evt) => {
                    switch (evt.type) {
                        case BABYLON.PointerEventTypes.POINTERDOWN:
                            if (evt.event.button === 2) {
                                var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
								console.log("this is pick")
                                var hit = scene.pickWithRay(ray);
                                if (hit.pickedMesh) {
                                    man.selectVertices(hit);
                                }
                            }
                            break;
        
                    }
                });*/
        
    });
    displayWorldAxis();
			
    //scene.clearColor = new BABYLON.Color3(0.80, 0.80, 0.80);
    scene.clearColor = new BABYLON.Color3(0.235, 0.235, 0.235);
    class Measurement {
        	constructor(pick1) {
			    sphere_counter = sphere_counter +1;
        this.sphere1 = BABYLON.Mesh.CreateSphere("measure_sphere"+sphere_counter,8,.1,scene);
        this.sphere1.scaling = new BABYLON.Vector3(1,1,1);
        this.sphere1.position = pick1.pickedPoint; 
        		this.buttonpress = false;
        	}
        
        	createSimpleButton(name,width,height,visible=true,color="black") {
        		var button1 = new BABYLON.GUI.Button.CreateSimpleButton("simplebutton_"+name, name);
        		button1.width = width;
        		button1.height = height;
        		button1.color = "white";
        		button1.cornerRadius = 20;
        		button1.alpha = .75;
        		button1.fontSize = 20;
        		button1.thickness = 1;
        		button1.background = color;
        		button1.isVisible = visible;
        		return button1;
      }
        
      createMeasure(pick2) {
        this.sphere2 = BABYLON.Mesh.CreateSphere("measure_sphere2",8,.1,scene);
        this.sphere2.position = pick2.pickedPoint;
        this.sphere2.checkcollisions = true;
        this.sphere2.ellipsoid = new BABYLON.Vector3(55, 1, 10); 
        this.distance = BABYLON.Vector3.Distance(this.sphere1.position,this.sphere2.position);
        		var distx = Math.abs(this.sphere1.position.x - this.sphere2.position.x);
        		var disty = Math.abs(this.sphere1.position.y - this.sphere2.position.y);
        		var distz = Math.abs(this.sphere1.position.z - this.sphere2.position.z);
        		var distxz = Math.sqrt(distx**2+distz**2);
        		this.distances = [this.distance.toFixed(2),distx.toFixed(2),disty.toFixed(2),distz.toFixed(2),distxz.toFixed(2)]
        this.tube = new BABYLON.MeshBuilder.CreateTube("tube",{path: [this.sphere1.position,this.sphere2.position],radius: .01},scene);
        		this.tube.isVisible = false;
        this.container = new BABYLON.GUI.Container("dimension");
        		this.container.width = "300px";
        		this.container.adaptHeightToChildren = true;
        this.container.isPointerBlocker = true;
        this.dimensionbutton = this.createSimpleButton(this.distance.toFixed(2),"250px","50px",);
        this.dimensionbutton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.deletebutton = this.createSimpleButton("X","50px","50px",);
        		this.deletebutton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.container.addControl(this.dimensionbutton);
        		this.container.addControl(this.deletebutton);
        this.line1 = new BABYLON.GUI.Line();
        		this.line1.alpha = 0.5;
        		this.line1.lineWidth = 5;
        		this.line1.dash = [5, 10];
        		advancedTexture.addControl(this.line1); 
        		this.line1.linkWithMesh(this.sphere1);
        		this.line1.connectedControl = this.container;
        		this.line2 = new BABYLON.GUI.Line();
        		this.line2.alpha = 0.5;
        		this.line2.lineWidth = 5;
        		this.line2.dash = [5, 10];
        		advancedTexture.addControl(this.line2); 
        		this.line2.linkWithMesh(this.sphere2);
        		this.line2.connectedControl = this.container;
        		advancedTexture.addControl(this.container); 
        		this.container.linkWithMesh(this.tube);
        		this.container.isPointerBlocker = true;
      }
        
        	disposeMeasurement() {
        		this.buttonpress = true;
        		this.container.dispose();
        		this.sphere1.dispose();
        		this.sphere2.dispose();
        		this.tube.dispose();
        		this.line1.dispose();
        		this.line2.dispose();
        	}	
        	expandMeasurement() {
        		if (this.dimensionbutton.height == "50px") {
        			this.dimensionbutton.height = "150px";
        			this.dimensionbutton.children[0].text = "Distance: "+this.distances[0]+"\nX(Lat): "+this.distances[1]
        			+"\nY(Long): "+this.distances[3]
        			+"\nZ(Vertical): "+this.distances[2]
        			+"\nXY(Horizontal): "+this.distances[4];
        			//this.dimensionbutton.text = "test";
        		}
        		else {
        			this.dimensionbutton.height = "50px";
        			this.dimensionbutton.children[0].text = this.distance.toFixed(2);
        		}
        	}
    }
    var polygon ;
		
    scene.onPointerObservable.add((pointerInfo) => {
      if(pointClick == 0){
        selected_obj = pointerInfo.pickInfo.hit.pickedMesh
        //console.log("now selected object", selected_obj.name);
      }
      if(pointClick == 1){
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
          if (pointerInfo.pickInfo.hit) {
            var box = BABYLON.MeshBuilder.CreateSphere("box", {radius: 0.01}, scene);
            //var box = BABYLON.MeshBuilder.CreateSphere("box", {diameter:1});
            //box.scaling = new BABYLON.Vector3(20, 20, 20);
            box.renderingGroupId = 1
            box.position = pointerInfo.pickInfo.pickedPoint;
            box.checkcollisions = true;
            box.ellipsoid = new BABYLON.Vector3(5, 1, 10);
            my_pick_point.push(box);
				
            pickprevious = pointerInfo.pickInfo;
            measurement1 = new Measurement(pickprevious);
				   
            clicks.push(box)
          }
         
          let angle = 0;
          console.log(clicks.length);
          if (clicks.length > 5) {
            clicks.forEach(b => {
              //angle = Math.acos(b.position.x / Math.sqrt(b.position.x * b.position.x + b.position.z * b.position.z));
              //if (b.position.z < 0) {
              //  angle = 2 * Math.PI - angle;
              //}
              //b.angle = angle;
            });
            //clicks.sort((a, b) => {
            //  return a.angle - b.angle;
            // })          

            const shape = clicks.map(b => {
              //return new BABYLON.Vector3(b.position.x, 0, b.position.z)
              return new BABYLON.Vector3(b.position.x, b.position.y, b.position.z)
            })

            console.log("all shape values", shape);
			
		    //box1.setPivotPoint(new BABYLON.Vector3(-1, -1, -1));
            //polygon.setPivotPoint(new BABYLON.Vector3(clicks[0].position.x, clicks[0].position.y, clicks[0].position.z)); //working pivot
            /*let centreAt = new BABYLON.Vector3(0,0,0);
			let pivotAt = new BABYLON.Vector3(clicks[0].position.x, clicks[0].position.y, clicks[0].position.z);
			polygon.position = pivotAt;
			pivotTranslate = centreAt.substract(pivotAt);  //centreAt retained from previous pivot setting
			polygon.setPivotMatrix(BABYLON.Matrix.Translation(pivotTranslate.x, pivotTranslate.y, pivotTranslate.z));*/
			
            //const sphereLocalOrigin = BABYLON.MeshBuilder.CreateSphere("sphereLO", {diameter:.5}, scene);
        	//sphereLocalOrigin.material = new BABYLON.StandardMaterial("origin", scene);
        	//sphereLocalOrigin.material.diffuseColor = new BABYLON.Color3(1, 1, 0);
            //spherePivot.position = new BABYLON.Vector3(clicks[0].position.x, clicks[0].position.y, clicks[0].position.z);
            box1= polygon;
            //scene.render()
            //my_mesh.parent = box1
            var center_poly_tri = new BABYLON.Vector3(40,0,15);
            if (!!polygon){
              dummy = new BABYLON.Mesh("dummy", scene);
              console.log("all shape list", shape);
              //dummy.position = new BABYLON.Vector3(shape[0].x,shape[0].y,shape[0].z)
              polygon.parent = dummy;
              x = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(dummy)
              box_cube.parent = dummy;
              //var pivot11 = new BABYLON.TransformNode("root");
              //pivot11.position = new BABYLON.Vector3(shape[0].x,shape[0].y,shape[0].z); 
              //polygon.parent = pivot11;
              //pivot11.setParent(polygon); 
            }else{
			
            }
			
            //polygon.position = new BABYLON.Vector3(0,0,0);
            //console.log("obj pivot points", polygon.getPivotPoint(), polygon.getAbsolutePivotPoint())
            //console.log("obj position", polygon.position, polygon.getAbsolutePosition())
            //polygon.setPivotMatrix(BABYLON.Matrix.Translation(clicks[0].position.x, clicks[0].position.y, clicks[0].position.z),false);
            //polygon.setPivotPoint(BABYLON.Vector3(clicks[0].position.x, clicks[0].position.y, clicks[0].position.z), false);
            //console.log("my clickes of 0",clicks[0])
            //box1.setPositionWithLocalVector(new BABYLON.Vector3(clicks[0].position.x, clicks[0].position.y, clicks[0].position.z));

            //polygon.isPickable = false
            pointClick = 0;
        
          }
        }
        //
      }
    });
    scene.collisionsEnabled = true;
    camera.checkCollisions = true;

    /*var onPointerDown = function (evt) {
        		if (evt.button !== 0) {
        			return;
        		}
				console.log("hi am clicked");
				
                 var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity());	

            var hit = scene.pickWithRay(ray);
            console.log("click points", hit)
            if (hit.pickedMesh){
                
				//hit.pickedMesh.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
				if(hit.pickedMesh.name.includes("Tooth")){
				selected_obj = hit.pickedMesh
				
				console.log("now selected object", selected_obj.name);
				var selected_obj1 = scene.getNodeByName("parent_"+selected_obj.name);
				console.log("after selected object", selected_obj1.name);
				
				}
				
            }
        		
        		// the specified faces should now be pointing in same direction but will be skewed/rotated around the normal
        		// to those faces.  So we call the function again to align 2 faces that are perpendicular to the specified faces
        		
        		//alignFaces(box1, 4, box2, 4, false);
        		//scene.render();
        	}	
			canvas.addEventListener("pointerdown", onPointerDown, false);*/
			
    createGizmoScene(scene, camera);
    //divFps.innerHTML = engine.getFps().toFixed() + " fps";
    return scene;
  };
        
  var onPointerDown = function (evt) {
        		if (evt.button !== 0) {
        			return;
        		}
    console.log("hi am clicked");
				
    var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity());	

    var hit = scene.pickWithRay(ray);
    console.log("click points", hit)
    if (hit.pickedMesh){
			    
      for(let j =0; j<my_pick_point.length; j++){
        spheres.push(my_pick_point[j]);
      }
      gizmoManager.attachableMeshes = spheres
			
      //hit.pickedMesh.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
      //if(hit.pickedMesh.name.includes("Tooth")){
      selected_obj = hit.pickedMesh
      console.log("now selected object", selected_obj.name);
      gizmoManager.attachToMesh(selected_obj)
				
      /*if(selected_obj.name == 'Tooth 8'){
				console.log("inside the if condi");
				selected_obj.setPivotPoint(new BABYLON.Vector3(-12.556503295898438, 2.229644298553467, -3.59116792678833))
				console.log("now selected object", selected_obj.getAbsolutePivotPoint());
				}*/
      //camera.setTarget(selected_obj);
      //}
      /*for(let i=0;i<upper_grp.length;upper_grp++){
				console.log("working");
				if (hit.pickedMesh.intersectsMesh(upper_grp[i], false)) {
					hit.pickedMesh.material = error_material;
                    hit.pickedMesh.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
                } else {
                    //balloon1.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
                }
				}*/
				
    }
        		
        		// the specified faces should now be pointing in same direction but will be skewed/rotated around the normal
        		// to those faces.  So we call the function again to align 2 faces that are perpendicular to the specified faces
        		
        		//alignFaces(box1, 4, box2, 4, false);
        		//scene.render();
        	}	
        	
        	canvas.addEventListener("pointerdown", onPointerDown, false);
			
  class VerticesManipulator{
    constructor(scene){
      this.scene = scene;
      this.meshes = new Map();
      this.radius = 5;
      this.pickOrigin = new BABYLON.Vector3();
        
      this.tmpVec = new BABYLON.Vector3();
      this.spheres = [];
      //this.sphere = BABYLON.MeshBuilder.CreateSphere("sp",{diameter:1},this.scene);
      this.tranny = new BABYLON.TransformNode("tranny",this.scene);
      this.selectedVertices = [];
      this.selectedMesh = null;
      this.gizmoManager = new BABYLON.GizmoManager(this.scene);
        
      this.gizmoManager.positionGizmoEnabled = true;
      this.gizmoManager.rotationGizmoEnabled = false;
      this.gizmoManager.scaleGizmoEnabled = false;
      this.gizmoManager.boundingBoxGizmoEnabled = false;
        
      this.gizmoManager.attachableMeshes = [this.tranny];
        
      this.gizmoManager.gizmos.positionGizmo.onDragEndObservable.add((e)=>{
        const transformMesh = this.gizmoManager.gizmos.positionGizmo.attachedMesh;
        if(!this.selectedVertices){
          return;
        }
        const delta = transformMesh.position.subtract(this.pickOrigin);
        for(let i=0;i<this.selectedVertices.length;++i){
          this.selectedVertices[i].addInPlace(delta);
          if(this.spheres[i]){
            this.spheres[i].position.copyFrom(this.selectedVertices[i])
          }
        }
        this.pickOrigin.addInPlace(delta);
        this.updateVertices(this.selectedMesh);
      })
               
    }
        
    addMesh(mesh){
      mesh.isPickable = true;
      const positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
      const vertices = [];
      for(let i=0;i<positions.length;i+=3){
        vertices.push(new BABYLON.Vector3(positions[i],positions[i+1],positions[i+2]));
      }
      this.meshes.set(mesh, {mesh:mesh, vertices:vertices});
    }
        
    updateVertices(mesh){
      //mesh.bakeCurrentTransformIntoVertices();
      const mesh2 = this.meshes.get(mesh);
      if(!mesh2){
        return;
      }
      const positions = [];
      console.log("this is my test", mesh2.vertices)
      for(let i=0;i<mesh2.vertices.length;++i){
        const vert = mesh2.vertices[i];
        positions.push(vert.x,vert.y,vert.z);
      }
      mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
      mesh.bakeCurrentTransformIntoVertices();
    }
        
    selectVertices(hit){
        
      for(let i=0;i<this.spheres.length;++i){
        this.spheres[i].dispose();
      }
      this.spheres.length = 0;
      this.selectedVertices.length = 0;
      this.selectedMesh = null;
      this.selectedHit = null;
        
      if(!this.meshes.has(hit.pickedMesh)){
        this.addMesh(hit.pickedMesh)
      }
        
      this.selectedMesh = hit.pickedMesh;
      this.selectedHit = hit;
                
      const mesh = this.meshes.get(hit.pickedMesh);
      for(let i=0;i<mesh.vertices.length;++i){
        BABYLON.Vector3.TransformCoordinatesToRef(mesh.vertices[i],mesh.mesh.getWorldMatrix(),this.tmpVec);
        const distance = BABYLON.Vector3.Distance(this.tmpVec,hit.pickedPoint);
        if(distance < this.radius){
          const instance = this.sphere.createInstance("spi"+i);
          instance.position.copyFrom(this.tmpVec)
          this.spheres.push(instance);
          this.selectedVertices.push(mesh.vertices[i]);
          //console.log("Puuf", "hi", )
        }
      }
      console.log("picked", this.selectedVertices[0]._x, this.selectedVertices[0]._y, this.selectedVertices[0]._z)
      var vector_pick = [];
      vector_pick.push(this.selectedVertices[0]._x)
      vector_pick.push(this.selectedVertices[0]._y)
      vector_pick.push(this.selectedVertices[0]._z)
				
      if(counter == 1){
        //localStorage.setItem("first", this.selectedVertices[0])
        localStorage.setItem("first", vector_pick)
        counter= 2;
      }
      else if(counter == 2){
        //localStorage.setItem("second", this.selectedVertices[0])
        localStorage.setItem("second", vector_pick)
        counter= 3;
      }
      else if(counter == 3){
        //localStorage.setItem("third", this.selectedVertices[0])
        localStorage.setItem("third", vector_pick)
        counter= 4;
      }
      else if(counter == 4){
        //localStorage.setItem("fourth", this.selectedVertices[0])
        localStorage.setItem("fourth", vector_pick)
        counter= 5;
      }
      else if(counter == 5){
        console.log("already selected all points");
      }
      manage();
      this.tranny.position.copyFrom(hit.pickedPoint);
      this.gizmoManager.attachToMesh(this.tranny);
      this.pickOrigin.copyFrom(hit.pickedPoint);
    }
        
  }
  let loopI =0;
  initFunction = async function() {
                    
    let asyncEngineCreation = async function() {
      try {
        return createDefaultEngine();
      } catch(e) {
        console.log("the available createEngine function failed. Creating the default engine instead");
        return createDefaultEngine();
      }
    }

    window.engine = await asyncEngineCreation();
    if (!window.engine) throw 'engine should not be null.';
		
    scene = delayCreateScene();
  };

  initFunction().then(() => {
    window.pointDownEvent&&canvas.removeEventListener("pointerdown", window.pointDownEvent)
    sceneToRender = scene        
    window.engine.runRenderLoop(function () {
      //divFps.innerHTML = engine.getFps().toFixed() + " fps";
			
      if (sceneToRender && sceneToRender.activeCamera) {
        sceneToRender.render();
      }
    });
  });

  this.clearEngine =()=>{
    window.engine&&window.engine.dispose()
    window.pointDownEvent&&canvas.removeEventListener("pointerdown", window.pointDownEvent)
    scene&&scene.dispose();
    localStorage.clear();
    gizmoManager&&gizmoManager.dispose();
  }

  // Resize
  window.addEventListener("resize", function () {
    window.engine.resize();
  });
}