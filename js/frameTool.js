var loaded_maxillary = 0;
var loaded_mandibular= 0;
function frameTool(){
  var cube=null;
  var sphere=null;
  var step_num_glob = 0;
  var box;
  var pbr1;
  var pbr2;
    
  var selected_obj = null;
  var pink=1;
  let divFps = document.getElementById("fps");
  var canvas = document.getElementById("ai");
  var file = BABYLON.GUI.Button.CreateSimpleButton("file","Mandibular load");
  var file2=BABYLON.GUI.Button.CreateSimpleButton("file2","Maxillary load");
  var inspector=BABYLON.GUI.Button.CreateSimpleButton("inspector","Inspector");
  var engine = null;
  var scene = null;
  var sceneToRender = null;
  var stepDirectory = "https://neural-hive-3d-modules.s3.ap-south-1.amazonaws.com/demo/frameByFrameTool/Assets/steps/";
  let assetsDirectory = "https://neural-hive-3d-modules.s3.ap-south-1.amazonaws.com/demo/common/Assets/";
  //var counter = 1;
  //var rabbit;
        
  this.load_step=(step_num)=> {
    
    for(let i=0; i<4; i++){
      window.scene.meshes.forEach(async (m) => {
      //console.log("working fine", m);
        window.scene.removeMesh(m);
        m.dispose();
      //scene.removeMesh(m);
      //m = null;
      //engine.dispose();
      //await scene.removeMesh(m)
      });
    }
    console.log("hi working outside click", step_num);
    BABYLON.SceneLoader.ImportMesh("",stepDirectory+"step"+step_num+"/","mandibular_all.glb",window.scene,async function (meshes){
      for(let j=0; j<meshes.length; j++){
        meshes[j].forceSharedVertices();
        meshes[j].material = pbr1;
        //meshes[j].rotation = new BABYLON.Vector3(1,0,0);
      }
      loaded_mandibular = step_num;
    })
    
    BABYLON.SceneLoader.ImportMesh("",stepDirectory+"step"+step_num+"/","maxillary_all.glb",window.scene,async function (meshes){
      for(let j=0; j<meshes.length; j++){
        meshes[j].forceSharedVertices();
        meshes[j].material = pbr1;
        //meshes[j].rotation = new BABYLON.Vector3(1,0,0);
      }
      loaded_maxillary = step_num;
    })
    step_num_glob = step_num;
  }
    
  var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
       
  var delayCreateScene = function () {
            
    var createGizmoScene = function(mainScene, mainCamera) {
      var scene2 = new BABYLON.Scene(window.engine);
      scene2.autoClear = false;

      var camera2 = new BABYLON.ArcRotateCamera("camera1",  5 * Math.PI / 8, 5 * Math.PI / 8, 30, new BABYLON.Vector3(0, 2, 0), scene2);
      //var camera2 = new BABYLON.FreeCamera("sceneCamera", new BABYLON.Vector3(0, 1, -15), scene2);
      //camera2.inputs.remove(camera2.inputs.attached.mouse);
      //camera2.inputs.clear();
      //camera2.inputs.addMouse();

      // Where to display
      //camera2.viewport = new BABYLON.Viewport(0.8, 0.6, 0.25, 0.55);
      //camera2.viewport = new BABYLON.Viewport(0.8, 0.8, 0.2, 0.2);
      camera2.viewport = new BABYLON.Viewport(0.7, 0.7, 0.35, 0.35);

      // Dupplicate scene info
      mainScene.afterRender = () => {
        scene2.render();
        camera2.alpha = mainCamera.alpha;
        camera2.beta = mainCamera.beta;
        camera2.radius = 13;
      };
    
      pbr2 = new BABYLON.PBRMaterial("Gums", scene);
            
      pbr2.albedoColor = new BABYLON.Color3(1, 0.8, 0.8);
      pbr2.metallic = 0.26; // set to 1 to only use it from the metallicRoughnessTexture
      pbr2.roughness = 0.26; // set to 1 to only use it from the metallicRoughnessTexture
      //pbr2.metallicRoughnessTexture = new BABYLON.Texture("./textures/Teeth_Roughness.png", scene);
      pbr2.albedoTexture = new BABYLON.Texture("./textures/Gums_06.jpg", scene);
      pbr2.metallicTexture = new BABYLON.Texture("./textures/Teeth_Roughness.png", scene);
      //pbr2.reflectionTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("./textures/environment.dds", scene);
      pbr2.bumpTexture = new BABYLON.Texture("./textures/Gums-veins.png", scene);
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

      pbr1 = new BABYLON.PBRMaterial("Teeth", scene);
            
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

      //box = new BABYLON.Mesh("Box", scene2);
      //var axis = new BABYLON.Vector3(0, 0, -1);
      //box.rotate(axis, 3.14159, BABYLON.Space.WORLD)
      //var gizmoManager2 = new BABYLON.GizmoManager(scene2)
      //gizmoManager2.rotationGizmoEnabled = true;
      //var utilLayer2 = new BABYLON.UtilityLayerRenderer(scene2);

      // Create the gizmo and attach to the box
      //var gizmo2 = new BABYLON.RotationGizmo(utilLayer2);
      //gizmo2.attachedMesh = box;
      //console.log("this is gizmo property", gizmo2);
      //gizmo2._hoverMaterial.specularColor = BABYLON.Color3.Red();

      // Keep the gizmo fixed to world rotation
      //gizmo2.updateGizmoRotationToMatchAttachedMesh = false;
      // gizmo2.updateGizmoPositionToMatchAttachedMesh = true;

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
            
    var scene = new BABYLON.Scene(window.engine); 
    var gizmoManager = new BABYLON.GizmoManager(scene)
            
    var matte = new BABYLON.PBRMetallicRoughnessMaterial("matte", scene);
    matte.metallic = 1;
    matte.roughness = 1;
    
    // var env512 = BABYLON.CubeTexture.CreateFromPrefilteredData("https://assets.babylonjs.com/environments/environmentSpecular.env", scene);
    // env512.name = "env512";
    // env512.gammaSpace = false;
            
    //Adding a light
    //var light = new BABYLON.HemisphericLight("Hemi", new BABYLON.Vector3(0, 1, 0), scene);
    //light.intensity = 50;
    //var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    //light.groundColor = BABYLON.Color3.Gray();
        
    // L  I  G  H  T  S  			
	
    //Adding Hemi - Left light
    var light3 = new BABYLON.HemisphericLight("Hemi_Left", new BABYLON.Vector3(0, 1, 1), scene);
    light3.intensity = 0.6000;
	
    //Adding Hemi - Center light
    var light4 = new BABYLON.HemisphericLight("Hemi_Mid", new BABYLON.Vector3(-1, 0, 0), scene);
    light4.intensity = 0.2000;
	
    //Adding Hemi - Right light
    var light5 = new BABYLON.HemisphericLight("Hemi_Right", new BABYLON.Vector3(1, 1, -1), scene);
    light5.intensity = 0.5000;
        
    //Adding an Arc Rotate Camera
    camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    //camera = new BABYLON.FreeCamera("camera1", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    //camera.inputs.clear();
    //camera.inputs.addMouse();
    var faceColors = [];
    //camera.setPosition(new BABYLON.Vector3(0, 5, 100));
    camera.setPosition(new BABYLON.Vector3(0, 0, 100));
    camera.attachControl(canvas, true);
            
    //bottom
    var boxa = BABYLON.Mesh.CreateBox("BoxA", 1.0, scene);
    boxa.position = new BABYLON.Vector3(-40,-90,0);
    //top
    var boxb = BABYLON.Mesh.CreateBox("BoxB", 1.0, scene);
    boxb.position = new BABYLON.Vector3(-40,90,0);
    //right
    var boxc = BABYLON.Mesh.CreateBox("BoxC", 1.0, scene);
    boxc.position = new BABYLON.Vector3(20,-9,0);
    //left
    var boxd = BABYLON.Mesh.CreateBox("BoxD", 1.0, scene);
    boxd.position = new BABYLON.Vector3(-90,-9,0);
    //back
    var boxe = BABYLON.Mesh.CreateBox("BoxE", 1.0, scene);
    boxe.position = new BABYLON.Vector3(-40,0,-30);
            
    boxa.setEnabled(false);
    boxb.setEnabled(false);
    boxc.setEnabled(false);
    boxd.setEnabled(false);
    boxe.setEnabled(false);
            
    //var matte = new BABYLON.PBRMetallicRoughnessMaterial("matte", scene);
    //matte.metallic = 1;
    //matte.roughness = 1;
    
    var matte = new BABYLON.StandardMaterial("myMaterial", scene);
    matte.backFaceCulling = false;
    var env512 = BABYLON.CubeTexture.CreateFromPrefilteredData("https://assets.babylonjs.com/environments/environmentSpecular.env", scene);
    env512.name = "env512";
    env512.gammaSpace = false;
        
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");

    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "220px";
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(panel);
            
    var rotate = BABYLON.GUI.Button.CreateSimpleButton("rotated", "ROT");
    var image = new BABYLON.GUI.Image("rotated", "textures/51116.png");
    image.top = "-45%";
    image.left = "45%";
    image.width = "50px";
    image.height = "50px";
    //advancedTexture.addControl(image); 
    rotate.top = "-45%";
    rotate.left = "45%";
    rotate.width = "50px";
    rotate.height = "50px";
    rotate.color = "Red";
    rotate.fontSize = 15;
    rotate.background = "transparent";
    rotate.fontSize = "18px";
    rotate.cornerRadius = 25;
    rotate.onPointerUpObservable.add(function() {
      console.log('rotate');
        
      gizmoManager.positionGizmoEnabled = false;
      gizmoManager.rotationGizmoEnabled = true;
      var checker;	
      gizmoManager.gizmos.rotationGizmo.xGizmo.dragBehavior.onDragEndObservable.add((e) => {	
        console.log(selected_obj, "selected obj")				
                
      });

      gizmo.updateGizmoRotationToMatchAttachedMesh = true;

    });
    //gui.addControl(rotate);
    //advancedTexture.addControl(rotate);
            
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
    set.onPointerUpObservable.add(async function() {
      for(let i=0;i<2;i++){
        console.log('set');
        /*if(sphere != null && cube != null){
            await scene.removeMesh(cube);
            await scene.removeMesh(sphere);
            sphere = null;
            cube=null;
            }*/
        scene.meshes.forEach((m) => {
          scene.removeMesh(m);
          m.dispose();
          //m.dispose();
          //m = null;
          //engine.dispose();
        });
      }
            
      if(step_num_glob != 0){
        BABYLON.SceneLoader.ImportMesh("",stepDirectory+"step"+step_num_glob+"/","mandibular_all.glb",scene,async function (meshes){
          for(let j=0; j<meshes.length; j++){
            meshes[j].forceSharedVertices();
            meshes[j].material = pbr1;
            //meshes[j].rotation = new BABYLON.Vector3(1,0,0);
          }
        })
    
        BABYLON.SceneLoader.ImportMesh("",stepDirectory+"step"+step_num_glob+"/","maxillary_all.glb",scene,async function (meshes){
          for(let j=0; j<meshes.length; j++){
            meshes[j].forceSharedVertices();
            meshes[j].material = pbr1;
            //meshes[j].rotation = new BABYLON.Vector3(1,0,0);
          }
        })
      }
            
    });
    gui.addControl(set);
    advancedTexture.addControl(set);
            
    scene.environmentTexture = env512;
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
    Mand.onPointerUpObservable.add(async function() {
      for(let i=0;i<3;i++){
        console.log('Mand');
        /*if(sphere != null && cube != null){
            console.log("two mesh on")
            await scene.removeMesh(cube);
            await scene.removeMesh(sphere);
            sphere = null;
            cube=null;
            }*/
        //if(sphere == null){
        scene.meshes.forEach((m) => {
          scene.removeMesh(m);
          m.dispose();
          //m.dispose();
          //m = null;
          //engine.dispose();
        });
        if(step_num_glob != 0){
          BABYLON.SceneLoader.ImportMesh("",stepDirectory+"step"+step_num_glob+"/","mandibular_all.glb",scene,async function (meshes){
            for(let j=0; j<meshes.length; j++){
              meshes[j].forceSharedVertices();
              meshes[j].material = pbr1;
              //meshes[j].rotation = new BABYLON.Vector3(1,0,0);
            }
          })
    
        }
        //}
      }
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
    Max.onPointerUpObservable.add(async function() {
      for(let i=0;i<3;i++){
        console.log('Max');
        /*if(sphere != null && cube != null){
            console.log("two mesh on")
            await scene.removeMesh(cube);
            await scene.removeMesh(sphere);
            sphere = null;
            cube=null;
            }*/
        //if(cube == null){
        //console.log()
        await scene.meshes.forEach(async (m) => {
          console.log("working fine", m);
          scene.removeMesh(m);
          m.dispose();
          //scene.removeMesh(m);
          //m = null;
          //engine.dispose();
          //await scene.removeMesh(m)
        });
        
        if(step_num_glob != 0){
          BABYLON.SceneLoader.ImportMesh("",stepDirectory+"step"+step_num_glob+"/","maxillary_all.glb",scene,async function (meshes){
            for(let j=0; j<meshes.length; j++){
              meshes[j].forceSharedVertices();
              meshes[j].material = pbr1;
              //meshes[j].rotation = new BABYLON.Vector3(1,0,0);
            }
          })
    
        }
        //}
      }

    });
    gui.addControl(Max);
    advancedTexture.addControl(Max);
            
    var back = BABYLON.GUI.Button.CreateSimpleButton("back");
    var image = new BABYLON.GUI.Image("back", assetsDirectory+"Back 1.png");
    image.top = "-18%";
    image.left = "45%";
    image.width = "60px";
    image.height = "60px";
    //advancedTexture.addControl(image); 
    back.top = "-18%";
    back.left = "45%";
    back.width = "50px";
    back.height = "50px";
    //back.color = "Red";
    back.fontSize = 15;
    back.background = "transparent";
    back.fontSize = "18px";
    back.cornerRadius = 15;
    var tooltipStack = new BABYLON.GUI.StackPanel();
    tooltipStack.top = '-20%';
    tooltipStack.left = "38%";

    scene.executeWhenReady(function(){
      //var relativePositionX = buttonStack._measureForChildren.left;
      //var relativePositionY = buttonStack._measureForChildren.top;
      //console.log(relativePositionX);
      //console.log(relativePositionY);
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
    label1.text = 'Disabled';
    label1.resizeToFit = true;
    label1.color = 'black';
    tooltipStack.addControl(label1);

    tooltipStack.width = "0%";

    /* var label2 = new BABYLON.GUI.TextBlock();
            label2.text = 'Attack 10 Defense 15';
            label2.resizeToFit = true;
            label2.color = 'white';
            tooltipStack.addControl(label2);*/

    back.onPointerEnterObservable.add(
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
    );
    back.onPointerUpObservable.add(function() {
      console.log('back');
      //camera.position=boxe.position;
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
    //gui.addControl(back);
    //advancedTexture.addControl(back);
            
    var Bottoom = BABYLON.GUI.Button.CreateSimpleButton("Bottoom");
    var image = new BABYLON.GUI.Image("Bottoom", assetsDirectory+"Bottoom 1.png");
    image.top = "-6%";
    image.left = "45%";
    image.width = "60px";
    image.height = "60px";
    //advancedTexture.addControl(image); 
    Bottoom.top = "-6%";
    Bottoom.left = "45%";
    Bottoom.width = "50px";
    Bottoom.height = "50px";
    //Bottoom.color = "Red";
    Bottoom.fontSize = 15;
    Bottoom.background = "transparent";
    Bottoom.fontSize = "18px";
    Bottoom.cornerRadius = 15;
    var tooltipStack1 = new BABYLON.GUI.StackPanel();
    tooltipStack1.top = '-10%';
    tooltipStack1.left = "38%";

    scene.executeWhenReady(function(){
      //var relativePositionX = buttonStack._measureForChildren.left;
      //var relativePositionY = buttonStack._measureForChildren.top;
      //console.log(relativePositionX);
      //console.log(relativePositionY);
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
    label1.text = 'Disabled';
    label1.resizeToFit = true;
    label1.color = 'black';
    tooltipStack1.addControl(label1);

    tooltipStack1.width = "0%";

    /* var label2 = new BABYLON.GUI.TextBlock();
            label2.text = 'Attack 10 Defense 15';
            label2.resizeToFit = true;
            label2.color = 'white';
            tooltipStack1.addControl(label2);*/

    Bottoom.onPointerEnterObservable.add(
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
    );

    Bottoom.onPointerUpObservable.add(function() {
      console.log('Bottoom');
      //camera.position=boxa.position;
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
    //gui.addControl(Bottoom);
    //advancedTexture.addControl(Bottoom);
            
    var Left = BABYLON.GUI.Button.CreateSimpleButton("Left");
    var image = new BABYLON.GUI.Image("Left", assetsDirectory+"Left 1.png");
    image.top = "6%";
    image.left = "45%";
    image.width = "60px";
    image.height = "60px";
    //advancedTexture.addControl(image); 
    Left.top = "6%";
    Left.left = "45%";
    Left.width = "50px";
    Left.height = "50px";
    //Left.color = "Red";
    Left.fontSize = 15;
    Left.background = "transparent";
    Left.fontSize = "18px";
    Left.cornerRadius = 20;
    var tooltipStack2 = new BABYLON.GUI.StackPanel();
    tooltipStack2.top = '10%';
    tooltipStack2.left = "38%";

    scene.executeWhenReady(function(){
      //var relativePositionX = buttonStack._measureForChildren.left;
      //var relativePositionY = buttonStack._measureForChildren.top;
      //console.log(relativePositionX);
      //console.log(relativePositionY);
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
    label1.text = 'Disabled';
    label1.resizeToFit = true;
    label1.color = 'black';
    tooltipStack2.addControl(label1);

    tooltipStack2.width = "0%";

    /* var label2 = new BABYLON.GUI.TextBlock();
            label2.text = 'Attack 10 Defense 15';
            label2.resizeToFit = true;
            label2.color = 'white';
            tooltipStack.addControl(label2);*/

    Left.onPointerEnterObservable.add(
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
    );
    Left.onPointerUpObservable.add(function() {
      console.log('Left');
      //camera.position=boxd.position;
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
    //gui.addControl(Left);
    //advancedTexture.addControl(Left);
            
    var Right = BABYLON.GUI.Button.CreateSimpleButton("Right");
    var image = new BABYLON.GUI.Image("Right", assetsDirectory+"Right 1.png");
    image.top = "18%";
    image.left = "45%";
    image.width = "60px";
    image.height = "60px";
    //advancedTexture.addControl(image); 
    Right.top = "18%";
    Right.left = "45%";
    Right.width = "50px";
    Right.height = "50px";
    //Right.color = "Red";
    Right.fontSize = 15;
    Right.background = "transparent";
    Right.fontSize = "18px";
    Right.cornerRadius = 20;
    var tooltipStack4 = new BABYLON.GUI.StackPanel();
    tooltipStack4.top = '20%';
    tooltipStack4.left = "38%";

    scene.executeWhenReady(function(){
      //var relativePositionX = buttonStack._measureForChildren.left;
      //var relativePositionY = buttonStack._measureForChildren.top;
      //console.log(relativePositionX);
      //console.log(relativePositionY);
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
    label1.text = 'Disabled';
    label1.resizeToFit = true;
    label1.color = 'black';
    tooltipStack4.addControl(label1);

    tooltipStack4.width = "0%";

    /* var label2 = new BABYLON.GUI.TextBlock();
            label2.text = 'Attack 10 Defense 15';
            label2.resizeToFit = true;
            label2.color = 'white';
            tooltipStack.addControl(label2);*/

    Right.onPointerEnterObservable.add(
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
    );

    Right.onPointerUpObservable.add(function() {
      console.log('Right');
      //camera.position=boxc.position;
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
    //gui.addControl(Right);
    //advancedTexture.addControl(Right);
            
    var Top = BABYLON.GUI.Button.CreateSimpleButton("Top");
    var image = new BABYLON.GUI.Image("Top", assetsDirectory+"Top.png");
    image.top = "30%";
    image.left = "45%";
    image.width = "60px";
    image.height = "60px";
    //advancedTexture.addControl(image); 
    Top.top = "30%";
    Top.left = "45%";
    Top.width = "50px";
    Top.height = "50px";
    //Top.color = "Red";
    Top.fontSize = 15;
    Top.background = "transparent";
    Top.fontSize = "18px";
    Top.cornerRadius = 20;
    var tooltipStack5 = new BABYLON.GUI.StackPanel();
    tooltipStack5.top = '30%';
    tooltipStack5.left = "38%";

    scene.executeWhenReady(function(){
      //var relativePositionX = buttonStack._measureForChildren.left;
      //var relativePositionY = buttonStack._measureForChildren.top;
      //console.log(relativePositionX);
      //console.log(relativePositionY);
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
    label1.text = 'Disabled';
    label1.resizeToFit = true;
    label1.color = 'black';
    tooltipStack5.addControl(label1);

    tooltipStack5.width = "0%";

    /* var label2 = new BABYLON.GUI.TextBlock();
            label2.text = 'Attack 10 Defense 15';
            label2.resizeToFit = true;
            label2.color = 'white';
            tooltipStack.addControl(label2);*/

    Top.onPointerEnterObservable.add(
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
    );
    Top.onPointerUpObservable.add(function() {
      console.log('Top');
      //camera.position=boxb.position;
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
    //gui.addControl(Top);
    //advancedTexture.addControl(Top);
            
    var images = new BABYLON.GUI.Image("translate", "textures/478165.png");
    images.top = "-20%";
    images.left = "-47%";
    images.width = "50px";
    images.height = "50px";
    //advancedTexture.addControl(images);
    var translate = BABYLON.GUI.Button.CreateSimpleButton("Translate");
    translate.top = "-20%";
    translate.left = "-47%";
    translate.width = "50px";
    translate.height = "50px";
    translate.color = "white";
    translate.fontSize = 15;
    translate.background = "transparent";
    translate.fontSize = "18px";
    //button2.cornerRadius = 5;
    translate.onPointerUpObservable.add(function() {
      console.log('translate')
            
      gizmoManager.positionGizmoEnabled = true;
      gizmoManager.rotationGizmoEnabled = false;
      var checker;	
      gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.onDragEndObservable.add((e) => {	
        console.log(selected_obj, "selected obj")				
                
      });
                
    });
            
    file.top = "40%";
    file.left = "43%";
    file.width = "90px";
    file.height = "40px";
    file.color = "red";
    file.background = "transparent";
    file.cornerRadius = 5;
    file.onPointerClickObservable.add(function () {
      //alert("mytest")
      //advancedTexture.addControl(translate);
      //var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 30, scene);
      console.log("button working");
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
    });
            
    inspector.top = "50%";
    inspector.left = "43%";
    inspector.width = "90px";
    inspector.height = "40px";
    inspector.color = "red";
    inspector.background = "transparent";
    inspector.cornerRadius = 5;
    inspector.onPointerClickObservable.add(function () {
      scene.debugLayer.show();
      //camera.setTarget(cube)
    })
    file2.top = "30%";
    file2.left = "43%";
    file2.width = "90px";
    file2.height = "40px";
    file2.color = "red";
    file2.background = "transparent";
    file2.cornerRadius = 5;
    file2.onPointerClickObservable.add(function () {
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
    });
    //gui.addControl(file);
    //gui.addControl(inspector);
    //gui.addControl(file2);
    //BABYLON.SceneLoader.ImportMesh("","textures/","cubes.stl",scene,function (meshes){
    //cube=meshes[1];
    //});
    var utilLayer = new BABYLON.UtilityLayerRenderer(scene);

    var gizmo = new BABYLON.PositionGizmo(utilLayer);
    gizmo.attachedMesh = cube;
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
        
    //var utilLayer = new BABYLON.UtilityLayerRenderer(scene);

    //var gizmo = new BABYLON.PositionGizmo(utilLayer);
    //gizmo.attachedMesh = sphere;
    //displayWorldAxis();
            
    //scene.clearColor = new BABYLON.Color3(0.80, 0.80, 0.80);
    //scene.clearColor = new BABYLON.Color3(0.98, 0.984, 0.992);
    scene.clearColor = new BABYLON.Color3(0.047, 0.047, 0.047);
    createGizmoScene(scene, camera);

    //divFps.innerHTML = engine.getFps().toFixed() + " fps";
    return scene;
  };
                
  var loopI =0;
  this.initFunction = async function() {
    window.scene&&window.scene.dispose()
    window.engine&&window.engine.dispose();
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
        
    window.scene = delayCreateScene();};
  this.initFunction().then(() => {
    sceneToRender = window.scene        
    window.engine.runRenderLoop(function () {
      //divFps.innerHTML = engine.getFps().toFixed() + " fps";
            
      if (sceneToRender && sceneToRender.activeCamera) {
        sceneToRender.render();
      }
    });
  });

  this.clearEngine =()=> {
    window.engine&&window.engine.dispose()
    window.scene.dispose()
  }

  // Resize
  window.addEventListener("resize", function () {
    window.engine.resize();
  });
}