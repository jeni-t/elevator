
function collisionDetectionTool() {
  var gizmoManager=null;
  
  var scene = null;
  let error_material;
  var translate_tool = 0;
  var rotate_tool = 0;
  //var gizmoManager;
  let spheres = []
  let upper_grp = []
  let lower_grp = []
  let camera;
  let selected_obj = null;
  let saveStates = [];
  let check_camera_view = 0;	
  let baseDirectory = "https://neural-hive-3d-modules.s3.ap-south-1.amazonaws.com/demo/collisionDetectionTool/"	
	
  let assetsDirectory = "https://neural-hive-3d-modules.s3.ap-south-1.amazonaws.com/demo/common/Assets/";	
			
  let divFps = document.getElementById("fps");
	
  let upload = BABYLON.GUI.Button.CreateSimpleButton("upload button","Process");
  let clear = BABYLON.GUI.Button.CreateSimpleButton("clear_button","Wireframe");
  let calculate_collision = BABYLON.GUI.Button.CreateSimpleButton("calculate_collision_button", "Show Collision");
  let pivot_point = BABYLON.GUI.Button.CreateSimpleButton("pivot_point", "Shaded");
	
  function manage() {
    //alert('hi am working');
    console.log("test working ")
    //let bt = document.getElementById('btn');
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
  let canvas = document.getElementById("manual");

  let engine = null;
  let sceneToRender = null;
  let counter = 1;
  let rabbit, rabbit1;
  var eventCount= 0;
  var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
       
	   var delayCreateScene = function () {
            
    var createGizmoScene = function(mainScene, mainCamera) {
      var scene2 = new BABYLON.Scene(window.engine);
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
      //light2.intensity = 0.8;
	
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
			
    scene = new BABYLON.Scene(window.engine); 
    gizmoManager = new BABYLON.GizmoManager(scene)
			
    //Adding a light
    //var light = new BABYLON.HemisphericLight("Hemi", new BABYLON.Vector3(0, 1, 0), scene);
    //light.intensity = 30;
			
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
    camera = new BABYLON.ArcRotateCamera("camera1", -9, 1.2, 60, new BABYLON.Vector3.Zero(), scene);
    var faceColors = [];
    camera.setPosition(new BABYLON.Vector3(0, 5, 100));
    camera.attachControl(canvas, false);
    //bottom
    var boxa = BABYLON.Mesh.CreateBox("BoxA", 3.0, scene);
    boxa.position = new BABYLON.Vector3(0,-130,0);
    //top
    var boxb = BABYLON.Mesh.CreateBox("BoxB", 3.0, scene);
    boxb.position = new BABYLON.Vector3(0,130,0);
    //right
    var boxc = BABYLON.Mesh.CreateBox("BoxC", 3.0, scene);
    boxc.position = new BABYLON.Vector3(0,0,130);
    //left
    var boxd = BABYLON.Mesh.CreateBox("BoxD", 3.0, scene);
    boxd.position = new BABYLON.Vector3(0,0,-130);
    //back
    var boxe = BABYLON.Mesh.CreateBox("BoxE", 3.0, scene);
    boxe.position = new BABYLON.Vector3(-130,0,0);
			
    //camera.viewport = new BABYLON.Viewport(0.8, 0.8, 0.2, 0.2);
			
    boxa.setEnabled(false);
    boxb.setEnabled(false);
    boxc.setEnabled(false);
    boxd.setEnabled(false);
    boxe.setEnabled(false);
			
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
			
    /*var pbr = new BABYLON.PBRMetallicRoughnessMaterial("pbr", scene);
            //sphere.material = pbr;
            //sphere.material = pbr;
        
            //pbr.baseColor = new BABYLON.Color3(0.99, 0.98, 0.93, 0.86);
            pbr.baseColor = new BABYLON.Color3(0.99, 0.98, 0.93, 0.86);
            //pbr.baseColor = new BABYLON.Color3(0.5, 1, 1, 0.86);
            pbr.metallic = 1.0;
            pbr.roughness = 0.4;
            pbr.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("./textures/environment.dds", scene);
        
			var pbr1 = new BABYLON.PBRMetallicRoughnessMaterial("pbr", scene);
        
            pbr1.baseColor = new BABYLON.Color3(0.95, 0.34, 0.34, 0.75);
            pbr1.metallic = 1.0;
            pbr1.roughness = 0.4;
            pbr1.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("./textures/gum.dds", scene);
            //return Assets;
        */
    var pbr1 = new BABYLON.PBRMaterial("Gums", scene);
    pbr1.albedoColor = new BABYLON.Color3(1, 0.8, 0.8);
    pbr1.metallic = 0.26; // set to 1 to only use it from the metallicRoughnessTexture
    pbr1.roughness = 0.26; // set to 1 to only use it from the metallicRoughnessTexture
    //pbr2.metallicRoughnessTexture = new BABYLON.Texture("./textures/Teeth_Roughness.png", scene);
    pbr1.albedoTexture = new BABYLON.Texture(baseDirectory+"textures/Gums_06.jpg", scene);
    pbr1.metallicTexture = new BABYLON.Texture(baseDirectory+"textures/Teeth_Roughness.png", scene);
    //pbr2.reflectionTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("./textures/environment.dds", scene);
    //pbr1.bumpTexture = new BABYLON.Texture("./textures/Gums-veins.png", scene);
    //pbr2.microSurface = new BABYLON.Texture("./textures/Teeth_Roughness.png", scene);
    //pbr2.useMicroSurfaceFromReflectivityMapAlpha = false;
    pbr1.subSurface.isRefractionEnabled = true;
    pbr1.subSurface.refractionIntensity = 0.08;
    pbr1.subSurface.indexOfRefraction = 1.15;
    //pbr2.subSurface.thicknessTexture = new BABYLON.Texture(sphere + "./textures/Teeth_Roughness.png", scene, false, false);
    pbr1.subSurface.minimumThickness = 0.2;
    pbr1.subSurface.maximumThickness = 2;
    //pbr2.subSurface.isTranslucencyEnabled = true;
    //pbr2.subSurface.TranslucencyIntensity = 0.5;
    pbr1.subSurface.isScatteringEnabled = true;
    pbr1.subSurface.tintColor = new BABYLON.Color3(0.73, 0.73, 0.73);
    //pbr2.subSurface.tintColor = BABYLON.Color3.Teal();
		
    // Teeth Shader Test

    var pbr = new BABYLON.PBRMaterial("Teeth", scene);
			
    pbr.albedoColor = new BABYLON.Color3(1, 0.98, 0.96);
    pbr.metallic = 0; // set to 1 to only use it from the metallicRoughnessTexture
    pbr.roughness = 0.14; // set to 1 to only use it from the metallicRoughnessTexture
    //pbr1.metallicRoughnessTexture = new BABYLON.Texture("./textures/Teeth_Roughness.png", scene);
    //pbr1.albedoTexture = new BABYLON.Texture("./textures/Tooth_Shade.jpg", scene);
    //pbr1.metallicTexture = new BABYLON.Texture("./textures/fluffyWool.jpg", scene);
    //pbr1.reflectionTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("./textures/environment.dds", scene);
    //pbr1.bumpTexture = new BABYLON.Texture("./textures/Teeth_Normal.png", scene);			
    //pbr1.microSurface = new BABYLON.Texture("./textures/Teeth_Roughness.png", scene);
    //pbr1.useMicroSurfaceFromReflectivityMapAlpha = false;
    pbr.subSurface.isRefractionEnabled = true;
    pbr.subSurface.refractionIntensity = 0.02;
    pbr.subSurface.indexOfRefraction = 1.5;
    //pbr1.subSurface.thicknessTexture = new BABYLON.Texture(sphere + "./textures/Teeth_Roughness.png", scene, false, false);
    pbr.subSurface.minimumThickness = 0.2;
    pbr.subSurface.maximumThickness = 1.6;
    pbr.subSurface.isTranslucencyEnabled = true;
    pbr.subSurface.isScatteringEnabled = true;
    pbr.subSurface.tintColor = new BABYLON.Color3(0.75, 0.73, 0.7);
    //pbr1.subSurface.tintColor = BABYLON.Color3.Teal();
		
		    pbr.backFaceCulling = false;
    pbr1.backFaceCulling = false;
		
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
      //camera.position(v);
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
			BABYLON.SceneLoader.ImportMesh("","scene/","Mandibular.stl",scene,function (meshe){
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
			BABYLON.SceneLoader.ImportMesh("","scene/","Maxillary.stl",scene,function (meshes){
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
			}
*/
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

    /* back.onPointerEnterObservable.add(
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
      //if(check_camera_view == 1){
      camera.position=boxe.position;
      //}
      /*if(pink==1){
			var image = new BABYLON.GUI.Image("back", "Assets/Back 2.png");
			image.top = "-18%";
			image.left = "45%";
			image.width = "60px";
			image.height = "60px";
			advancedTexture.addControl(image); 
			pink=2;
			}
			//if(pink!=5 && pink!=2 && pink!=3 && pink!=4){
			if(pink!=5){
			var image = new BABYLON.GUI.Image("Top", "Assets/Top.png");
			image.top = "30%";
			image.left = "45%";
			image.width = "60px";
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
      //if(check_camera_view == 1){
      camera.position=boxa.position;
      camera.alpha=18.80;
      //}
      /*if(pink==2){
			var image = new BABYLON.GUI.Image("Bottoom", "Assets/Bottoom 2.png");
			image.top = "-6%";
			image.left = "45%";
			image.width = "60px";
			image.height = "60px";
			advancedTexture.addControl(image);
			pink=3;
			}
			//if(pink!=1 && pink!=3 && pink!=4 && pink!=5){
			if(pink!=1){
			var image = new BABYLON.GUI.Image("back", "Assets/Back 1.png");
			image.top = "-18%";
			image.left = "45%";
			image.width = "60px";
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
      //if(check_camera_view == 1){
      camera.position=boxd.position;
      //}
      /*if(pink==3){
			var image = new BABYLON.GUI.Image("Left", "Assets/Left 2.png");
			image.top = "6%";
			image.left = "45%";
			image.width = "60px";
			image.height = "60px";
			advancedTexture.addControl(image);
			pink=4;
			}
			//if(pink!=2 && pink!=1 && pink!=4 && pink!=5){
			if(pink!=2){
			var image = new BABYLON.GUI.Image("Bottoom", "Assets/Bottoom 1.png");
			image.top = "-6%";
			image.left = "45%";
			image.width = "60px";
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
      //if(check_camera_view == 1){
      camera.position=boxc.position;
      //}
      /*if(pink==4){
			var image = new BABYLON.GUI.Image("Right", "Assets/Right 2.png");
			image.top = "18%";
			image.left = "45%";
			image.width = "60px";
			image.height = "60px";
			advancedTexture.addControl(image);
			pink=5;
			}
			//if(pink!=3 && pink!=1 && pink!=2 && pink!=5){
			if(pink!=3){
			var image = new BABYLON.GUI.Image("Left", "Assets/Left 1.png");
			image.top = "6%";
			image.left = "45%";
			image.width = "60px";
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
      //if(check_camera_view == 1){
      camera.position=boxb.position;
      camera.alpha=18.80;
      //}
      /*if(pink==5){
			var image = new BABYLON.GUI.Image("Top", "Assets/Top 2.png");
			image.top = "30%";
			image.left = "45%";
			image.width = "60px";
			image.height = "60px";
			advancedTexture.addControl(image);
			//pink=6;
			}
			if(pink!=4){
			var image = new BABYLON.GUI.Image("Right", "Assets/Right 1.png");
			image.top = "18%";
			image.left = "45%";
			image.width = "60px";
			image.height = "60px";
			advancedTexture.addControl(image); 
			}*/
    });
    gui.addControl(Top);
    advancedTexture.addControl(Top);
			
    var rotate = BABYLON.GUI.Button.CreateSimpleButton("rotated");
    var image = new BABYLON.GUI.Image("rotated", assetsDirectory+"rot_tool.svg");
    image.top = "-30%";
    image.left = "-44%";
    image.width = "60px";
    image.height = "60px";
    advancedTexture.addControl(image); 
    rotate.top = "-30%";
    rotate.left = "-44%";
    rotate.width = "50px";
    rotate.height = "50px";
    rotate.color = "white";
    rotate.fontSize = 15;
    rotate.background = "transparent";
    rotate.fontSize = "18px";
    rotate.cornerRadius = 35;
    /*var tooltipStack6 = new BABYLON.GUI.StackPanel();
             tooltipStack6.top = '-25%';
             tooltipStack6.left = "-44%";

            scene.executeWhenReady(function(){
            var relativePositionX = buttonStack._measureForChildren.left;
            var relativePositionY = buttonStack._measureForChildren.top;
            console.log(relativePositionX);
            console.log(relativePositionY);
            // tooltipStack.left = relativePositionX;
            // tooltipStack.top = relativePositionY;
            tooltipStack6.left = 50;
            tooltipStack6.top = 50;

            console.log(tooltipStack6.left);
            console.log(tooltipStack6.top);
            });

            tooltipStack6.background = "transparent";
            advancedTexture.addControl(tooltipStack6);

            // console.log(tooltipStack);

            var label1 = new BABYLON.GUI.TextBlock();
            label1.text = 'Rotate';
            label1.resizeToFit = true;
            label1.color = 'black';
            tooltipStack6.addControl(label1);

            tooltipStack6.width = "0%";*/

    /* var label2 = new BABYLON.GUI.TextBlock();
            label2.text = 'Attack 10 Defense 15';
            label2.resizeToFit = true;
            label2.color = 'white';
            tooltipStack.addControl(label2);*/

    /* rotate.onPointerEnterObservable.add(
                    (info) => {
                    tooltipStack6.width = "10%"
                    // label1.resizeToFit = false;
                    // label1.width = 0;
                    // console.log(info);
                    }
            );
            rotate.onPointerOutObservable.add(
                    (info) => {
                    tooltipStack6.width = "0%"
                    // label1.resizeToFit = true;
                    // console.log(info);
                    }
            );*/

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
      var checker;
      if(rotate_tool == 0){
        gizmoManager.positionGizmoEnabled = false;
        gizmoManager.rotationGizmoEnabled = true;
        rotate_tool = 1;
      }else{
        gizmoManager.positionGizmoEnabled = false;
        gizmoManager.rotationGizmoEnabled = false;
        rotate_tool = 0;
      }
      var checker;	
      gizmoManager.gizmos.rotationGizmo.xGizmo.dragBehavior.onDragEndObservable.add((e) => {	
        console.log(selected_obj, "selected obj")				
        saveStates.push({"nameMesh": selected_obj.name, "position": selected_obj.position});

        console.log(saveStates);

        updatecollision();
				
      });
      gizmoManager.gizmos.rotationGizmo.yGizmo.dragBehavior.onDragEndObservable.add((e) => {	
        console.log(selected_obj, "selected obj")				
        saveStates.push({"nameMesh": selected_obj.name, "position": selected_obj.position});

        console.log(saveStates);

        updatecollision();
				
      });
      gizmoManager.gizmos.rotationGizmo.zGizmo.dragBehavior.onDragEndObservable.add((e) => {	
        console.log(selected_obj, "selected obj")				
        saveStates.push({"nameMesh": selected_obj.name, "position": selected_obj.position});

        console.log(saveStates);

        updatecollision();
				
      });

      //});
      //gizmo.attachableMeshes = [box_cube, mandibular];
      //gizmo.attachToMesh([box_cube, mandibular]);
      //gizmo.attachedMesh = dummy

      // Keep the gizmo fixed to world rotation
      //gizmo.updateGizmoPositionToMatchAttachedMesh = false;
      gizmo.updateGizmoRotationToMatchAttachedMesh = true;

    });
    //gui.addControl(rotate);
    advancedTexture.addControl(rotate);
			
    var images = new BABYLON.GUI.Image("translate", assetsDirectory+"move_tool1.svg");
    images.top = "-17%";
    images.left = "-44%";
    images.width = "60px";
    images.height = "60px";
    advancedTexture.addControl(images);
    var translate = BABYLON.GUI.Button.CreateSimpleButton("Translate");
    translate.top = "-17%";
    translate.left = "-44%";
    translate.width = "60px";
    translate.height = "60px";
    translate.color = "white";
    translate.fontSize = 15;
    translate.background = "transparent";
    translate.fontSize = "18px";
    translate.cornerRadius = 35;
    /*var tooltipStack7 = new BABYLON.GUI.StackPanel();
             tooltipStack7.top = '-13%';
             tooltipStack7.left = "-42%";

            scene.executeWhenReady(function(){
            var relativePositionX = buttonStack._measureForChildren.left;
            var relativePositionY = buttonStack._measureForChildren.top;
            console.log(relativePositionX);
            console.log(relativePositionY);
            // tooltipStack.left = relativePositionX;
            // tooltipStack.top = relativePositionY;
            tooltipStack7.left = 50;
            tooltipStack7.top = 50;

            console.log(tooltipStack7.left);
            console.log(tooltipStack7.top);
            });

            tooltipStack7.background = "transparent";
            advancedTexture.addControl(tooltipStack7);

            // console.log(tooltipStack);

            var label1 = new BABYLON.GUI.TextBlock();
            label1.text = 'Translate';
            label1.resizeToFit = true;
            label1.color = 'black';
            tooltipStack7.addControl(label1);

            tooltipStack7.width = "0%";*/

    /* var label2 = new BABYLON.GUI.TextBlock();
            label2.text = 'Attack 10 Defense 15';
            label2.resizeToFit = true;
            label2.color = 'white';
            tooltipStack.addControl(label2);*/

    /*  translate.onPointerEnterObservable.add(
                    (info) => {
                    tooltipStack7.width = "10%"
                    // label1.resizeToFit = false;
                    // label1.width = 0;
                    // console.log(info);
                    }
            );
            translate.onPointerOutObservable.add(
                    (info) => {
                    tooltipStack7.width = "0%"
                    // label1.resizeToFit = true;
                    // console.log(info);
                    }
            );*/
    translate.onPointerClickObservable.add(function() {
      if(translate_tool == 0){
        gizmoManager.positionGizmoEnabled = true;
        gizmoManager.rotationGizmoEnabled = false;
        gizmoManager.usePointerToAttachGizmos = false;
        translate_tool =1;
      }
      else{
        gizmoManager.positionGizmoEnabled = false;
        gizmoManager.rotationGizmoEnabled = false;
        gizmoManager.usePointerToAttachGizmos = false
        translate_tool = 0;
      }
      //gizmoManager.attachToMesh(selected_obj);
				
      gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.onDragEndObservable.add((e) => {	
        console.log(selected_obj, "selected obj")				
        saveStates.push({"nameMesh": selected_obj.name, "position": selected_obj.position});

        console.log(saveStates);

        updatecollision()
				
      });
	
      gizmoManager.gizmos.positionGizmo.yGizmo.dragBehavior.onDragEndObservable.add((e) => {	
        console.log(selected_obj, "selected obj")				
        saveStates.push({"nameMesh": selected_obj.name, "position": selected_obj.position});

        console.log(saveStates);

        updatecollision()
				
      });
	
      gizmoManager.gizmos.positionGizmo.zGizmo.dragBehavior.onDragEndObservable.add((e) => {	
        console.log(selected_obj, "selected obj")				
        saveStates.push({"nameMesh": selected_obj.name, "position": selected_obj.position});

        console.log(saveStates);

        updatecollision()
				
      });
	
      /*//gizmo.updateGizmoRotationToMatchAttachedMesh = false;
				//gizmo.updateGizmoPositionToMatchAttachedMesh = true;
				var utilLayer = new BABYLON.UtilityLayerRenderer(scene);

    // Create the gizmo and attach to the sphere
    var gizmo = new BABYLON.PositionGizmo(utilLayer);
	//var gizmo = new BABYLON.RotationGizmo(utilLayer);
    gizmo.attachedMesh = rabbit;
	gizmo.attachedMesh = Tooth_1;
	
	//gizmo.attachableMeshes = [box_cube, mandibular];
	//gizmo.attachToMesh([box_cube, mandibular]);
	//gizmo.attachedMesh = dummy

    // Keep the gizmo fixed to world rotation
    //gizmo.updateGizmoRotationToMatchAttachedMesh = false;
	gizmo.updateGizmoPositionToMatchAttachedMesh = true;*/
    });
    //gui.addControl(translate);
    advancedTexture.addControl(translate);
			
    var old_current_pos = new BABYLON.Vector3(0,0,0);
			
    function updateVertex(obj1, positions){
      console.log('update_pos');
      var positionFunction = function(positions) { //Create a function for updateMeshPositions to call...
        //var positions = new Float32Array(spheres.getTotalVertices() * 3);
        var numberOfVertices = positions.length/3;	//Randomize the vertex coordinates in the array
			
        var current_pos = obj1.getAbsolutePosition();
        //var current_pos1 = current_pos;
        current_pos = current_pos.subtract(old_current_pos);
        //current_pos.x = current_pos.x - old_current_pos.x;
        //current_pos.y = current_pos.y - old_current_pos.y;
        //current_pos.z = current_pos.z - old_current_pos.z;
        console.log("my current pos", current_pos);
        for(var i = 0; i<numberOfVertices; i++) {
          positions[i*3] += current_pos.x;
          positions[i*3+1] += current_pos.y;
          positions[i*3+2] += current_pos.z;
        };
				
        old_current_pos = current_pos;
      };
      obj1.updateMeshPositions(positionFunction, true);	
			    
    }
			
    function updatecollision(){
      checker = 0;
      console.log("uppper group len", upper_grp.length);
      //parent to select children
      //selected_obj_name = selected_obj.name.replace("parent_","");
      console.log("selected_obj position for vertex update", selected_obj.position);
      if(!selected_obj.name.includes('Jaw')){
        selected_obj.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
        for(let i=0;i<upper_grp.length;i++){
          console.log("working");
          if(selected_obj.name == upper_grp[i].name){
          }else{
				
            //colors.push(255,0,0,1);
            //console.log("this is v", v)
				
            if (selected_obj.intersectsMesh(upper_grp[i], true)) {
              //if(upper_grp[i].name == 'Tooth_9'){
              //upper_grp[i].computeWorldMatrix();
			    
              //upper_grp[i].bakeCurrentTransformIntoVertices();
              //upper_grp[i].bakeTransformIntoVertices()
              console.log("primary ", upper_grp[i].name)
              var positions = upper_grp[i].getVerticesData(BABYLON.VertexBuffer.PositionKind)
              //var positions = upper_grp[i].getVerticesData(BABYLON.VertexBuffer.colorKind)
              //upper_grp[i].bakeCurrentTransformIntoVertices();
              //var indices = upper_grp[i].getIndices();
              //var normals = upper_grp[i].getVerticesData(VertexBuffer.NormalKind);
              //BABYLON.VertexData.ComputeNormals(positions, indices, normals);
              //upper_grp[i].updateVerticesData(VertexBuffer.NormalKind, normals, false, false);
              colors = [];
              list1 = [];
              list2 = [];
				
              console.log("pos kind len", positions.length);
              for (var k = 0; k < positions.length; k = k + 3) {
                var v = BABYLON.Vector3.FromArray(positions, k);
                //colors.push(Math.random(), Math.random(), Math.random(), 1);
                //}
		
                /*for (var k = 0; k < 251001; k++) {
				
				if(k%2==1)
				{
				
				//const y = positions[ i*3 + 1];
				//if (y < 0.001) {
            //colors.push(0, 0.5, 1, 1);
			}else{
			//colors.push(10,10,1,1);
			}*/
                //}
                //upper_grp[i].setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
                //if(k==0)
                //{
                //var origin = BABYLON.Mesh.CreateSphere("origin", 3, 0.3, scene);
                //origin.position = v;
                //origin.material = error_material;
                //	}
                //console.log("this is v" , v);
                //var p = new BABYLON.Vector3(positions[k],positions[k+1],positions[k+2]);
                if (selected_obj.intersectsPoint(v)) {
                  list1.push(v);
                  colors.push(1, 0, 0, 1);
				     checker =1;
					 //console.log("intersected with mesh", selected_obj.name, upper_grp[i].name)
					 
                  //selected_obj.material = error_material;
                  //selected_obj.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
                } 
                else{
                  colors.push(0.99, 0.98, 0.93, 0.86);
                }
              }
              upper_grp[i].setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
				
              //start
              colors = []
              var positions = selected_obj.getVerticesData(BABYLON.VertexBuffer.PositionKind)
              //var positions = upper_grp[i].getVerticesData(BABYLON.VertexBuffer.colorKind)
              //upper_grp[i].bakeCurrentTransformIntoVertices();
              //var indices = upper_grp[i].getIndices();
              //var normals = upper_grp[i].getVerticesData(VertexBuffer.NormalKind);
              //BABYLON.VertexData.ComputeNormals(positions, indices, normals);
              //upper_grp[i].updateVerticesData(VertexBuffer.NormalKind, normals, false, false);
              colors = [];
              console.log("pos kind len", positions.length);
              for (var k = 0; k < positions.length; k = k + 3) {
                var v = BABYLON.Vector3.FromArray(positions, k);
                //colors.push(Math.random(), Math.random(), Math.random(), 1);
                //}
		
                /*for (var k = 0; k < 251001; k++) {
				
				if(k%2==1)
				{
				
				//const y = positions[ i*3 + 1];
				//if (y < 0.001) {
            //colors.push(0, 0.5, 1, 1);
			}else{
			//colors.push(10,10,1,1);
			}*/
                //}
                //upper_grp[i].setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
                //if(k==0)
                //{
                //var origin = BABYLON.Mesh.CreateSphere("origin", 3, 0.3, scene);
                //origin.position = v;
                //origin.material = error_material;
                //	}
                //console.log("this is v" , v);
                //var p = new BABYLON.Vector3(positions[k],positions[k+1],positions[k+2]);
                if (upper_grp[i].intersectsPoint(v)) {
                  list2.push(v)
                  colors.push(1, 0, 0, 1);
				     checker =1;
					 //console.log("intersected with mesh", selected_obj.name, upper_grp[i].name)
					 
                  //selected_obj.material = error_material;
                  //selected_obj.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
                } 
                else{
                  colors.push(0.99, 0.98, 0.93, 0.86);
                }
              }
              selected_obj.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
				
              console.log(list1.length, list2.length, "two list leng");
              var sort_list1=[];
              var sort_list2=[];
              var y_sort_list1 = [];
              var y_sort_list2 = [];
              var b_sort_list1 = [];
              var b_sort_list2 = [];
              for(let m=0;m<list1.length-1;m++){
                let check_log = 0;
                for(let n=0;n<list2.length-1;n++){
                  //console.log(list1[m], list2[n]);
                  let x1 = list1[m];
                  let x2 = list2[n];
                  let d = Math.sqrt(((x2.x-x1.x)*(x2.x-x1.x)+(x2.y-x1.y)*(x2.y-x1.y)+(x2.z-x1.z)*(x2.z-x1.z)))
                  /*for(let o=0;o<sort_list2.length-1;o++){
					if(sort_list2[o] == x2){
					check_log = 1;
					}
					}*/
                  if(d<0.2 ){
					
                    sort_list1.push(x1);
                    sort_list2.push(x2);
                    //console.log(d, "distance");
                    check_log = 1;
                  }
                  else if(d>0.51 && d<0.8){
                    y_sort_list1.push(x1);
                    y_sort_list2.push(x2);
					
                  }
                  else if(d>0.81 && d<1){
                    b_sort_list1.push(x1);
                    b_sort_list2.push(x2);
                  }
					
                }
              }
				
              console.log("sort list len", sort_list1.length, sort_list2.length);
				
              //position.applyToMesh(selected_obj, true);
				
              //end 
				
              //
				
			    var current_pos_to_add = selected_obj.getAbsolutePosition();
              var positions = selected_obj.getVerticesData(BABYLON.VertexBuffer.PositionKind)
				
              colors = [];
              console.log("pos kind len", positions.length);
              for (var k = 0; k < positions.length; k = k + 3) {
                var v = BABYLON.Vector3.FromArray(positions, k);
                if(k == 0){
                  console.log("this is my before v", v, "split",current_pos_to_add);
                }
                //v = v.add(current_pos_to_add);
                //v = new BABYLON.Vector3(v.x+current_pos_to_add.x, v.y+current_pos_to_add.y, v.z+current_pos_to_add.z);
                if(k == 0){
                  console.log("this is my after v", v);
                }
		
		         let color_check = 0;
		         let color_check1 = 0;
		         let color_check2 = 0;
                for(let p=0;p<sort_list2.length-1;p++){
                  //if (upper_grp[i].intersectsPoint(v)) {
                  if(sort_list2[p].x == v.x && sort_list2[p].y == v.y && sort_list2[p].z == v.z){
                    //list2.push(v)
                    color_check = 1;
                    //colors.push(1, 0, 0, 1);
				  //   checker =1;
					 
                  }
                  else if(y_sort_list2[p].x == v.x && y_sort_list2[p].y == v.y && y_sort_list2[p].z == v.z){
                    color_check1 = 1;
                  }
                  else if(b_sort_list2[p].x == v.x && b_sort_list2[p].y == v.y && b_sort_list2[p].z == v.z){
                    color_check2 = 1;
                  }				
                  else{
                    //colors.push(0.99, 0.98, 0.93, 0.86);
                  }
                }
				
                if(color_check == 1){
                  //list2.push(v)
                  //color_check = 1;
                  colors.push(1, 0, 0, 1);
				  //   checker =1;
					 
                }
                else if(color_check1 == 1){
                  colors.push(1, 0.92,0.2, 1);
                }
                else if(color_check2 == 1){
                  colors.push(0.2, 0.28, 1, 1);
                }
                else{
                  colors.push(0.99, 0.98, 0.93, 0.86);
                }
				
              }
              selected_obj.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
				
              var current_pos_to_add = upper_grp[i].getAbsolutePosition();
              var positions = upper_grp[i].getVerticesData(BABYLON.VertexBuffer.PositionKind)
				
              colors = [];
              console.log("pos kind len", positions.length);
              for (var k = 0; k < positions.length; k = k + 3) {
                var v = BABYLON.Vector3.FromArray(positions, k);
                if(k == 0){
                  console.log("this is my before v", v, "split",current_pos_to_add);
                }
                //v = v.add(current_pos_to_add);
                //v = new BABYLON.Vector3(v.x+current_pos_to_add.x, v.y+current_pos_to_add.y, v.z+current_pos_to_add.z);
                if(k == 0){
                  console.log("this is my after v", v);
                }
		
		         let color_check = 0;
		         let color_check1 = 0;
		         let color_check2 = 0;
                for(let p=0;p<sort_list1.length-1;p++){
                  //if (upper_grp[i].intersectsPoint(v)) {
                  if(sort_list1[p].x == v.x && sort_list1[p].y == v.y && sort_list1[p].z == v.z){
                    //list2.push(v)
                    color_check = 1;
                    //colors.push(1, 0, 0, 1);
				  //   checker =1;
					 
                  }
                  else if(y_sort_list1[p].x == v.x && y_sort_list1[p].y == v.y && y_sort_list1[p].z == v.z){
                    color_check1 = 1;
                  }
                  else if(b_sort_list1[p].x == v.x && b_sort_list1[p].y == v.y && b_sort_list1[p].z == v.z){
                    color_check2 = 1;
                  }					
                  else{
                    //colors.push(0.99, 0.98, 0.93, 0.86);
                  }
                }
				
                if(color_check == 1){
                  //list2.push(v)
                  //color_check = 1;
                  colors.push(1, 0, 0, 1);
				  //   checker =1;
					 
                }
                else if(color_check1 == 1){
                  colors.push(1, 0.92,0.2, 1);
                }
                else if(color_check2 == 1){
                  colors.push(0.2, 0.28, 1, 1);
                }				
                else{
                  colors.push(0.99, 0.98, 0.93, 0.86);
                }
				
              }
				
              //vertexData.applyToMesh(upper_grp[i], true);
              upper_grp[i].setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
              console.log("process pos opp", selected_obj.getAbsolutePosition())
              //updateVertices(selected_obj)
              //
            }
          }
          var positions1 = selected_obj.getVerticesData(BABYLON.VertexBuffer.PositionKind)
          //updateVertex(selected_obj, positions1);
				
          var positions2 = upper_grp[i].getVerticesData(BABYLON.VertexBuffer.PositionKind)
          //updateVertex(upper_grp[i], positions2);
        }
        console.log("checker value", checker);
				
        if(checker == 0){
          selected_obj.material = pbr;
          console.log("without intersected");
          var positions = selected_obj.getVerticesData(BABYLON.VertexBuffer.PositionKind)
          for (var k = 0; k < positions.length; k = k + 3) {
            var v = BABYLON.Vector3.FromArray(positions, k);
            // var origin = BABYLON.Mesh.CreateSphere("origin", 3, 0.3, scene);
            // origin.position = v;
            // origin.material = error_material;
          }
            
        }
				
      }
		 //console.log("this is colors", colors);
      //upper_grp[i].setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
      /*if(checker == 1){
				
				selected_obj.material = error_material;
                selected_obj.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
				}else{
				selected_obj.material = pbr;
				console.log("without intersected");
				}*/
    }	
        
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
			
    clear.top = "25%";
    clear.left = "-43%";
    clear.width = "130px";
    clear.height = "40px";
    clear.color = "#6495ED";
    clear.background = "#FFFFFF";
    clear.cornerRadius = 5;
    clear.thickness=2;
    var showwireframe = 0;
    clear.onPointerClickObservable.add(function () {
      console.log("clearall")
      //scene.debugLayer.show();
      if(showwireframe == 0){
        pbr.wireframe  = true;
        pbr1.wireframe  = true;
        showwireframe =1;
      }
      else{
        pbr.wireframe  = false;
        pbr1.wireframe  = false;
        showwireframe =0;
      }
      //camera.setTarget(rabbit);
      //localStorage.clear();
		    //counter = 1;
      //upload.isVisible = false;
    });
			
    calculate_collision.top = "45%";
    calculate_collision.left = "-43%";
    calculate_collision.width = "130px";
    calculate_collision.height = "40px";
    calculate_collision.color = "#6495ED";
    calculate_collision.background = "#FFFFFF";
    calculate_collision.cornerRadius = 8;
    calculate_collision.thickness = 2;
    //var pick = 0;
    calculate_collision.onPointerClickObservable.add(function () {
      console.log("calculate_collision")
      /*pick++;
				if(pick == 0){
				calculate_collision.color = "#6495ED";
				}else{
				calculate_collision.color = "#FFFFFF";
				}*/
      console.log(selected_obj, "selected obj")				
      saveStates.push({"nameMesh": selected_obj.name, "position": selected_obj.position});

      console.log(saveStates);
      var all_pos = [];
      var intersect_mesh = [];
      for(let i=0;i<upper_grp.length;i++){
        selected_obj = upper_grp[i];
        for(let j=0;j<lower_grp.length;j++){
          var already_intersect = 0;
          for(let y=0; y<intersect_mesh.length;y++){
            if(intersect_mesh[y] == lower_grp[j].name){
              already_intersect = 1;
            }
          }
			
          if(already_intersect == 0){
            if(i ==0 ){
              //lower_grp[j].bakeCurrentTransformIntoVertices();
			
              console.log("primary ", lower_grp[j].name)
              var positions = lower_grp[j].getVerticesData(BABYLON.VertexBuffer.PositionKind)
			    all_pos.push(positions);
              //lower_grp[j].bakeCurrentTransformIntoVertices();
            }
            else{
              console.log("else ", lower_grp[j].name)
              console.log("pos len", all_pos.length);
              console.log("mesh len", lower_grp.length);
				
              //var positions = lower_grp[j].getVerticesData(BABYLON.VertexBuffer.PositionKind)
              var positions = all_pos[j];
            }
            colors = [];
            var intersect_mesh_checker = 0;
				
            //if (selected_obj.intersectsMesh(lower_grp[j], true)) {
            var my_counter =0;
            for (var k = 0; k < positions.length; k = k + 3) {
              var v = BABYLON.Vector3.FromArray(positions, k);
            
              if (selected_obj.intersectsPoint(v)) {
                if(intersect_mesh_checker == 0){
                  intersect_mesh.push(lower_grp[j].name);
                  intersect_mesh_checker =1;
                }
                //console.log("intersect with", lower_grp[j].name);
                /*if(my_counter < 50){
				colors.push(1, 0, 0, 1);
				my_counter++;
				}*/
                let y1 = v.y;
				
                if (y1 > -5.001) {
                  colors.push(1, 0, 0, 1);
                  console.log("y1 value of",y1);
                }
                else if(y1 > -6.001 && y1<-5.001){
				    colors.push(1, 0.92,0.2, 1);
                }
                else{
                  colors.push(0.2, 0.28, 1, 1);
                }
				     checker =1;
					 
              } 
              else{
                colors.push(0.99, 0.98, 0.93, 0.86);
              }
            }
            lower_grp[j].setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
            //}
            //else{
            //console.log("nothing do to");
            //}
          }
        }
      }
		
      /*for(let i=0; i<upper_grp.length-1;i++){
		selected_obj = upper_grp[i+1];
		upper_grp[i].bakeCurrentTransformIntoVertices();
				
				console.log("primary ", upper_grp[i].name)
				var positions = upper_grp[i].getVerticesData(BABYLON.VertexBuffer.PositionKind)
				
				upper_grp[i].bakeCurrentTransformIntoVertices();
				
				colors = [];
				
				for (var k = 0; k < positions.length; k = k + 3) {
				var v = BABYLON.Vector3.FromArray(positions, k);
            
				if (selected_obj.intersectsPoint(v)) {
				colors.push(1, 0, 0, 1);
				     checker =1;
			
                } 
				else{
				colors.push(0.99, 0.98, 0.93, 0.86);
				}
				}
				upper_grp[i].setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
		}
		*/
      /*for(let i=0; i<lower_grp.length-1;i++){
		selected_obj = lower_grp[i+1];
		lower_grp[i].bakeCurrentTransformIntoVertices();
			
				console.log("primary ", lower_grp[i].name)
				var positions = lower_grp[i].getVerticesData(BABYLON.VertexBuffer.PositionKind)
			
				lower_grp[i].bakeCurrentTransformIntoVertices();
				
				colors = [];
				
				for (var k = 0; k < positions.length; k = k + 3) {
				var v = BABYLON.Vector3.FromArray(positions, k);
            
				if (selected_obj.intersectsPoint(v)) {
				colors.push(1, 0, 0, 1);
				     checker =1;
					 
                } 
				else{
				colors.push(0.99, 0.98, 0.93, 0.86);
				}
				}
				lower_grp[i].setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
		}*/

      checker = 0;
			
    });
			
    pivot_point.top = "35%";
    pivot_point.left = "-43%";
    pivot_point.width = "130px";
    pivot_point.height = "40px";
    pivot_point.color = "#6495ED";
    pivot_point.background = "#FFFFFF";
    pivot_point.cornerRadius = 8;
    pivot_point.thickness=2;
    //var pick1=0
    pivot_point.onPointerClickObservable.add(function () {
      console.log("pivotpoint")
      /*pick1++;
				if(pick1 == 0){
				pivot_point.color = "#6495ED";
				}else{
				pivot_point.color = "#FFFFFF";
				}*/
			
      rabbit.material = pbr1;
      rabbit1.material = pbr1;
      rabbit.forceSharedVertices();
      rabbit1.forceSharedVertices();
			
      //scene.debugLayer.show();
      //localStorage.clear();
		    //counter = 1;
      //upload.isVisible = false;
      //console.log("obj absol", upper_grp[0].position);
      for(let i =0; i<upper_grp.length;i++){
        /*var positions = upper_grp[i].getVerticesData(BABYLON.VertexBuffer.PositionKind)
			for (var k = 0; k < 1; k = k + 3) {
				var v = BABYLON.Vector3.FromArray(positions, k);
				}
			console.log("my postitittititiitit", v);*/
        var center_of_origin = upper_grp[i].getBoundingInfo().boundingBox.center;
        console.log(upper_grp[i].name,"id")
        var dummy = new BABYLON.Mesh("parent_"+upper_grp[i].name, scene);
        dummy.position = center_of_origin
        upper_grp[i].parent = dummy;
        upper_grp[i].material = pbr;
			
        upper_grp[i].forceSharedVertices();
        upper_grp[i].position = new BABYLON.Vector3((-1*center_of_origin.x),(-1*center_of_origin.y),(-1*center_of_origin.z));
      }
			
      for(let i =0; i<lower_grp.length;i++){
        /*var positions = lower_grp[i].getVerticesData(BABYLON.VertexBuffer.PositionKind)
			for (var k = 0; k < 1; k = k + 3) {
				var v = BABYLON.Vector3.FromArray(positions, k);
				}
			console.log("my postitittititiitit", v);*/
        var center_of_origin = lower_grp[i].getBoundingInfo().boundingBox.center;
			
        //var origin = BABYLON.Mesh.CreateSphere("origin", 3, 0.3, scene);
        //origin.position = center_of_origin;
			
        var dummy = new BABYLON.Mesh("parent_"+lower_grp[i].name, scene);
        dummy.position = center_of_origin
        lower_grp[i].parent = dummy;
        lower_grp[i].material = pbr;
        lower_grp[i].forceSharedVertices();
        //lower_grp[i].position = new BABYLON.Vector3((-1*v.x),(-1*v.y),(-1*v.z));
        lower_grp[i].position = new BABYLON.Vector3((-1*center_of_origin.x),(-1*center_of_origin.y),(-1*center_of_origin.z));
      }
			
      //upper_grp[0].setPivotPoint(new BABYLON.Vector3(-3, 0, -3), BABYLON.Space.WORLD);
			
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
    gui.addControl(clear);  
    gui.addControl(upload);  
    gui.addControl(calculate_collision);
    gui.addControl(pivot_point);			
    var Tooth_1;
			
    //var grp_mesh1 = '';
			
    BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/3d/after/", "tooth1.obj", scene, function (meshes) { 
      Tooth_1 = meshes[1];
      //Tooth_1.material = pbr;
      selected_obj = meshes[1];
      //Tooth_1.showBoundingBox = true;
			
      console.log("this is overall meshes", meshes[1].name)
      var mesh_name = meshes[1].name;
      mesh_name = mesh_name.split("_");
      console.log(mesh_name[0],"dif", mesh_name[1]);
			
      console.log("meshcount", meshes.length);
      console.log("first mesh", meshes[0].name);
      for(let i=0; i<meshes.length;i++){
        //meshes[i].forceSharedVertices();
        //meshes[i].bakeCurrentTransformIntoVertices();
        var mesh_name = meshes[i].name;
			
        mesh_name = mesh_name.split("_");
        if(parseInt(mesh_name[1]) < 16){
          upper_grp.push(meshes[i])
        }
        else{
          lower_grp.push(meshes[i])
        }
        //meshes[i].material = pbr;
        spheres.push(meshes[i])
      }
      console.log("upper grp", upper_grp)
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
      var xAxis = BABYLON.Mesh.CreateLines("xAxis", [origin, xNormal], scene);
      xAxis.color = BABYLON.Color3.Red();
      var yAxis = BABYLON.Mesh.CreateLines("yAxis", [origin, yNormal], scene);
      yAxis.color = BABYLON.Color3.Green();
      var zAxis = BABYLON.Mesh.CreateLines("zAxis", [origin, zNormal], scene);
      zAxis.color = BABYLON.Color3.Blue();
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
    BABYLON.SceneLoader.ImportMesh("",baseDirectory+"Assets/3d/after/", "gums.obj", scene, function (meshes) {          
                
      //meshes[1].forceSharedVertices();
      //meshes[2].forceSharedVertices();
      //meshes[1].bakeCurrentTransformIntoVertices();
      //meshes[2].bakeCurrentTransformIntoVertices();
      //camera.setTarget(meshes[2].position);
      //meshes[2].minimizeVertices();
      rabbit = meshes[1];
      rabbit1 = meshes[0];
      //rabbit.forceSharedVertices();
      //camera.setTarget(rabbit);
      //camera.setTarget(selected_obj);
      //meshes[2].material = pbr1;
      //rabbit.material = pbr1;
      //console.log("jaws", meshes[1].name, meshes[2].name)
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
    //displayWorldAxis();
			
    //scene.clearColor = new BABYLON.Color3(0.80, 0.80, 0.80);
    scene.clearColor = new BABYLON.Color3(0.047, 0.047, 0.047);
    
    createGizmoScene(scene, camera);
    //divFps.innerHTML = engine.getFps().toFixed() + " fps";
    return scene;
  };
        
  const onPointerDown = function (evt) {
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
        console.log(gizmoManager);
        gizmoManager.attachToMesh(selected_obj1)
        //gizmoManager.attachableMeshes=[selected_obj]
        /*if(selected_obj.name == 'Tooth 8'){
				console.log("inside the if condi");
				selected_obj.setPivotPoint(new BABYLON.Vector3(-12.556503295898438, 2.229644298553467, -3.59116792678833))
				console.log("now selected object", selected_obj.getAbsolutePivotPoint());
				}*/
        //camera.setTarget(selected_obj);
      }
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
        
  window.pointDownEvent=	canvas.addEventListener("pointerdown", onPointerDown, false);
			
  class VerticesManipulator{
    constructor(scene){
      this.scene = scene;
      this.meshes = new Map();
      this.radius = 5;
      this.pickOrigin = new BABYLON.Vector3();
        
      this.tmpVec = new BABYLON.Vector3();
      this.spheres = [];
      this.sphere = BABYLON.MeshBuilder.CreateSphere("sp",{diameter:0.2},this.scene);
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
  var loopI =0;
  this.initFunction = async function() {
    var asyncEngineCreation = async function() {
      try {
        return createDefaultEngine();
      } catch(e) {
        console.log("the available createEngine function failed. Creating the default engine instead");
        return createDefaultEngine();
      }
    }

    window.engine = await asyncEngineCreation();
    if (!window.engine) throw 'engine should not be null.';
		
    scene = delayCreateScene();};
  this.initFunction().then(() => {sceneToRender = scene        
    window.engine.runRenderLoop(function () {
      //divFps.innerHTML = engine.getFps().toFixed() + " fps";
      //console.log("now working", selected_obj);
      /*for(loopI=0;loopI<upper_grp.length;loopI++){
			//console.log("now check")
				
				if (selected_obj.intersectsMesh(upper_grp[loopI], false)) {
					selected_obj.material = error_material;
                    selected_obj.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
                } else {
                    //balloon1.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
                }
				}*/
			
      if (sceneToRender && sceneToRender.activeCamera) {
        sceneToRender.render();
      }
    });
  });

  this.clearEngine =()=>{
    window.engine&&window.engine.dispose()
    window.pointDownEvent&&canvas.removeEventListener("pointerdown", window.pointDownEvent)
    scene.dispose();
    localStorage.clear();
    gizmoManager.dispose();
  }

  // Resize
  window.addEventListener("resize", function () {
    window.engine.resize();
  });
}