function alignmentTool(maxillaryFile, mandibularFile) {
  var canvas = document.getElementById("alignmentCanvas");
  var pointClick = 0;
  var pink=1;
  var x;
  var mandibular;
  var sphere_counter = 0;
  var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
  // You have to create a function called createScene. This function must return a BABYLON.Scene object
  // You can reference the following variables: scene, canvas
  // You must at least define a camera
  // More info here: https://doc.babylonjs.com/generals/The_Playground_Tutorial
  
  var engine = null;
  var scene = null;
  var sceneToRender = null;
  var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
  var pickprevious = 0;
  var pickResult;
  var advancedTexture;
  var scene;
  var measurement1;
  var dummy;
  var check_camera_view = 0;
  var align_done =0;
  //var maxillary_file = sessionStorage.getItem("maxillary")
  //var mandibular_file = sessionStorage.getItem("mandibular")
  let assetsDirectory = "https://neural-hive-3d-modules.s3.ap-south-1.amazonaws.com/demo/common/Assets/";
  var maxillary_file = "Maxillary.glb";
  var mandibular_file = "Mandibular.glb";
		
  this.exportAsSTL =()=> {
    console.log("exporting as STL");
    const rawMeshes = scene.meshes;
    var my_list = [];
    my_list[0] = mandibular;
    console.log("all rawmeshes", rawMeshes)
    var mandibular_stl = BABYLON.STLExport.CreateSTL(my_list,  false , "mandibular", false, false);
    //box_cube.freezeWorldMatrix();
    my_list[0] = box_cube;
    var maxillary_stl = BABYLON.STLExport.CreateSTL(my_list,  false , "maxillary", false, false);
    return {maxillary: maxillary_stl, mandibular: mandibular_stl}
  }

  var onPointerDown = function (evt) {
    if (evt.button !==0) {
      return;
    }
      
    var pickInfo = scene.pick(scene.pointerX,scene.pointerY);
    if (pickInfo.hit) {
      createMeasurement(scene,pickInfo);
    }
  }

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
    //faceColors[0] = myMaterial;
    faceColors[1] = BABYLON.Color3.Blue()
    faceColors[2] = BABYLON.Color3.Red();
    faceColors[3] = BABYLON.Color3.Black();
    faceColors[4] = BABYLON.Color3.Green();
    faceColors[5] = BABYLON.Color3.Yellow();

    var box = BABYLON.MeshBuilder.CreateBox("Box", {faceColors:faceColors, size:1}, scene2, true);
    //box.material = new BABYLON.StandardMaterial("", scene2);
    //box.material = myMaterial;

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

    //plane.rotate = 
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

  var createScene = function() {
    var scene = new BABYLON.Scene(window.engine);
    //const axis = new BABYLON.AxesViewer(scene,1);
    //var camera = new BABYLON.ArcRotateCamera("Camera", -.9, 1.2, 60, BABYLON.Vector3.Zero(), scene);
    var camera = new BABYLON.ArcRotateCamera("Camera", -.9, 1.2, 100, BABYLON.Vector3.Zero(), scene);
    var faceColors = [];
    
    camera.attachControl(canvas, false);
    //bottom
    var boxa = BABYLON.Mesh.CreateBox("BoxA", 3.0, scene);
    boxa.position = new BABYLON.Vector3(0,-80,0);
    //top
    var boxb = BABYLON.Mesh.CreateBox("BoxB", 3.0, scene);
    boxb.position = new BABYLON.Vector3(0,80,0);
    //right
    var boxc = BABYLON.Mesh.CreateBox("BoxC", 3.0, scene);
    boxc.position = new BABYLON.Vector3(0,0,-80);
    //left
    var boxd = BABYLON.Mesh.CreateBox("BoxD", 3.0, scene);
    boxd.position = new BABYLON.Vector3(0,0,80);
    //back
    var boxe = BABYLON.Mesh.CreateBox("BoxE", 3.0, scene);
    boxe.position = new BABYLON.Vector3(80,0,0);
  
    //camera.viewport = new BABYLON.Viewport(0.8, 0.8, 0.2, 0.2);
  
    boxa.setEnabled(false);
    boxb.setEnabled(false);
    boxc.setEnabled(false);
    boxd.setEnabled(false);
    boxe.setEnabled(false);

    //Adding Hemi - Left light
    var light3 = new BABYLON.HemisphericLight("Hemi_Left", new BABYLON.Vector3(0, 1, 1), scene);
    //light3.intensity = 0.15;
    light3.intensity = 0.4000;
	
    //Adding Hemi - Center light
    var light4 = new BABYLON.HemisphericLight("Hemi_Mid", new BABYLON.Vector3(-1, 0, 0), scene);
    //light4.intensity = 0.4;
    light4.intensity = 0.4000;
	
    //Adding Hemi - Right light
    var light5 = new BABYLON.HemisphericLight("Hemi_Right", new BABYLON.Vector3(1, 1, -1), scene);
    //light5.intensity = 0.15;
    light5.intensity = 0.4000;
        	//var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        	//light.groundColor = BABYLON.Color3.Gray();
    
    //faceColors[0]=BABYLON.Color3.Blue();
    //faceColors[1]=BABYLON.Color3.Red();
    //faceColors[2]=BABYLON.Color3.Green();
    //faceColors[3]=BABYLON.Color3.Yellow();
    //faceColors[4]=BABYLON.Color3.Green();
    //faceColors[5] = BABYLON.Color3.Green();
    
    var options = {
      //width: 20,
      // height: 20,
      //depth: 20,
      faceColors: faceColors
    };
  
    //var matte = new BABYLON.PBRMetallicRoughnessMaterial("matte", scene);
    //matte.metallic = 1;
    //matte.roughness = 1;
    var matte = new BABYLON.StandardMaterial("myMaterial", scene);
    matte.diffuseColor = new BABYLON.Color3(0.820, 0.804, 0.804);
    matte.specularColor = new BABYLON.Color3(0.647, 0.627, 0.627);
    matte.specularPower = 10.90;
    matte.backFaceCulling = false;

    var env512 = BABYLON.CubeTexture.CreateFromPrefilteredData("https://assets.babylonjs.com/environments/environmentSpecular.env", scene);
    env512.name = "env512";
    env512.gammaSpace = false;

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");
    var clear = BABYLON.GUI.Button.CreateSimpleButton("click_button","Inspector");

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
      
      if(align_done == 1)
      {
        for(let i=0; i<3; i++){
          scene.meshes.forEach((m) => {
            scene.removeMesh(m);
            m.dispose();
        
          });
        }
  
        BABYLON.SceneLoader.ImportMesh("","https://neural-hive-3d-modules.s3.ap-south-1.amazonaws.com/demo/alignmentTool/output/", mandibular_file, scene,  function (meshes) {
          for(let j=0;j<meshes.length;j++){
            meshes[j].material = matte;
          }
        });
  
        BABYLON.SceneLoader.ImportMesh("","https://neural-hive-3d-modules.s3.ap-south-1.amazonaws.com/demo/alignmentTool/output/", maxillary_file, scene,  function (meshes) {
          for(let j=0;j<meshes.length;j++){
            meshes[j].material = matte;
          }
        });
      }
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
      if(align_done == 1)
      {
        for(let i=0; i<3; i++){
          scene.meshes.forEach((m) => {
            scene.removeMesh(m);
            m.dispose();
        
          });
        }
  
        BABYLON.SceneLoader.ImportMesh("","https://neural-hive-3d-modules.s3.ap-south-1.amazonaws.com/demo/alignmentTool/output/", mandibular_file, scene,  function (meshes) {
          for(let j=0;j<meshes.length;j++){
            meshes[j].material = matte;
          }
        });
      }
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
      if(align_done == 1)
      {
        for(let i=0; i<3; i++){
          scene.meshes.forEach((m) => {
            scene.removeMesh(m);
            m.dispose();
        
          });
        }
  
        BABYLON.SceneLoader.ImportMesh("","https://neural-hive-3d-modules.s3.ap-south-1.amazonaws.com/demo/alignmentTool/output/", maxillary_file, scene,  function (meshes) {
          for(let j=0;j<meshes.length;j++){
            meshes[j].material = matte;
          }
        });
      }
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

    /*  back.onPointerEnterObservable.add(
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
  */
    back.onPointerUpObservable.add(function() {
      console.log('back');
      //if(check_camera_view == 1){
      camera.position=boxe.position;
      //}
      /*if(pink==1){
  var image = new BABYLON.GUI.Image("back", "scene/Back 2.png");
  image.top = "-18%";
  image.left = "45%";
  image.width = "60px";
  image.height = "60px";
  advancedTexture.addControl(image); 
  pink=2;
  }
  //if(pink!=5 && pink!=2 && pink!=3 && pink!=4){
  if(pink!=5){
  var image = new BABYLON.GUI.Image("Top", "scene/Top.png");
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
      camera.alpha=3.25;
			
      //camera.target = new BABYLON.Vector3()
      //}
      /*if(pink==2){
  var image = new BABYLON.GUI.Image("Bottoom", "scene/Bottoom 2.png");
  image.top = "-6%";
  image.left = "45%";
  image.width = "60px";
  image.height = "60px";
  advancedTexture.addControl(image);
  pink=3;
  }
  //if(pink!=1 && pink!=3 && pink!=4 && pink!=5){
  if(pink!=1){
  var image = new BABYLON.GUI.Image("back", "scene/Back 1.png");
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
        );

  */
    Left.onPointerUpObservable.add(function() {
      console.log('Left');
      //if(check_camera_view == 1){
      camera.position=boxd.position;
      //}
      /*if(pink==3){
  var image = new BABYLON.GUI.Image("Left", "scene/Left 2.png");
  image.top = "6%";
  image.left = "45%";
  image.width = "60px";
  image.height = "60px";
  advancedTexture.addControl(image);
  pink=4;
  }
  //if(pink!=2 && pink!=1 && pink!=4 && pink!=5){
  if(pink!=2){
  var image = new BABYLON.GUI.Image("Bottoom", "scene/Bottoom 1.png");
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
        );
  */
  
    Right.onPointerUpObservable.add(function() {
      console.log('Right');
      //if(check_camera_view == 1){
      camera.position=boxc.position;
      //}
      /*if(pink==4){
  var image = new BABYLON.GUI.Image("Right", "scene/Right 2.png");
  image.top = "18%";
  image.left = "45%";
  image.width = "60px";
  image.height = "60px";
  advancedTexture.addControl(image);
  pink=5;
  }
  //if(pink!=3 && pink!=1 && pink!=2 && pink!=5){
  if(pink!=3){
  var image = new BABYLON.GUI.Image("Left", "scene/Left 1.png");
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

    /* Top.onPointerEnterObservable.add(
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
  */
  
    Top.onPointerUpObservable.add(function() {
      console.log('Top');
      //if(check_camera_view == 1){
      camera.position=boxb.position;
      camera.alpha=3.25;
      //}
      /*if(pink==5){
  var image = new BABYLON.GUI.Image("Top", "scene/Top 2.png");
  image.top = "30%";
  image.left = "45%";
  image.width = "60px";
  image.height = "60px";
  advancedTexture.addControl(image);
  //pink=6;
  }
  if(pink!=4){
  var image = new BABYLON.GUI.Image("Right", "scene/Right 1.png");
  image.top = "18%";
  image.left = "45%";
  image.width = "60px";
  image.height = "60px";
  advancedTexture.addControl(image); 
  }*/
    });
    gui.addControl(Top);
    advancedTexture.addControl(Top);

    clear.top = "30%";
    clear.left = "25%";
    clear.width = "90px";
    clear.height = "40px";
    clear.color = "white";
    clear.background = "transparent";
    clear.cornerRadius = 5;
    clear.onPointerClickObservable.add(function () {
      console.log("clearall")
      scene.debugLayer.show();
      //localStorage.clear();
      //counter = 1;
      //upload.isVisible = false;
  
    });
    //gui.addControl(clear); 
    /*var buttonbox = document.createElement('div');
buttonbox.id = "buttonbox";
buttonbox.style.position = "absolute";
buttonbox.style.top = "400px";
buttonbox.style.left = "85.9%";
buttonbox.style.border = "5px inset white";
buttonbox.style.padding = "60px";
buttonbox.style.paddingRight = "1px";
buttonbox.style.width = "29px";
buttonbox.style.display = "pink";
document.body.appendChild(buttonbox);*/
  
    var export_but = BABYLON.GUI.Button.CreateSimpleButton("export_but","Export");
    export_but.top = "24%";
    export_but.left = "-43%";
    export_but.width = "130px";
    export_but.height = "40px";
    export_but.color = "#6495ED";
    export_but.thickness = 2;
    //export_but.background = "gray";
    export_but.fontSize = "18px";
    //export_but.color = "#FFFFFF";
    export_but.background ="#FFFFFF";
    export_but.cornerRadius = 8;
    //var pick = 0;
    export_but.onPointerClickObservable.add(function () {
      /*pick++;
    if(pick == 0){
    export_but.background = "#B564E3";
    }else{
    export_but.background = "#777B7E";
    }*/
      if(options === "export_but") {
        export_but.isVisible = true;
      } else {
        export_but.isVisible = false;
      }
    
      var box_cube_abs = box_cube.absolutePosition;
      var mandibular_abs = mandibular.absolutePosition;
      var mandibular_rot = mandibular.rotation;
      dummy.removeChild(box_cube);
      dummy.removeChild(mandibular);
      mandibular.removeChild(box_cube);
      box_cube.position = box_cube_abs;
      mandibular.position = mandibular_abs;
      //box_cube.rotation =mandibular_rot;
      //console.log("clearall")
      /*if (counter == 0) {
  click.isPickable = false;
  console.log("click");
  }
  else if (counter == 1) {
  click.isPickable = true;
  }*/
      //pointClick=1;
      exportAsSTL()
      //buttonbox.appendChild(export_but);
      //export_but.onclick = function() {
      // Show/Hide myMeshThree
      //for (mesh of Export)
      //  mesh.setEnabled(true); 
      //}

    });
    //gui.addControl(export_but); 
  
    var button2 = BABYLON.GUI.Button.CreateSimpleButton("but2", "Align");
    button2.top = "24%";
    button2.left = "-43%";
    button2.width = "130px";
    button2.height = "40px";
    button2.color = "#6495ED";
    button2.thickness = 2;
    button2.fontSize = 15;
    //button2.background = "gray";
    button2.fontSize = "18px";
    //button2.color = "#FFFFFF";
    button2.background ="#FFFFFF";
    button2.cornerRadius = 8;
    //var pick2 = 0;
    button2.onPointerUpObservable.add(function() {
      console.log("clicked!");
      check_camera_view = 1;
      box_cube.parent = dummy;
      //alignFaces(box1, 0, box2, faceid, false);
      //alignFaces(box1, 0, poly_tri, 0, false);
      //scene.render();
      //alignFaces(x, 1, box2, 1, false); //working file
      x.dispose();
      align_done = 1;
      var sphere1 = scene.getNodeByName("measure_sphere1");//work
      sphere1.setEnabled(false);
      var sphere2 = scene.getNodeByName("measure_sphere2");//work
      sphere2.setEnabled(false);
      var sphere3 = scene.getNodeByName("measure_sphere3");//work
      sphere3.setEnabled(false);
      var sphere4 = scene.getNodeByName("measure_sphere4");//work
      sphere4.setEnabled(false);
      
      BABYLON.SceneLoader.ImportMesh("","https://neural-hive-3d-modules.s3.ap-south-1.amazonaws.com/demo/alignmentTool/output/", mandibular_file, scene,  function (meshes) { 
        //camera.setTarget(meshes[1]);
        meshes[1].material = matte;
      });
      BABYLON.SceneLoader.ImportMesh("","https://neural-hive-3d-modules.s3.ap-south-1.amazonaws.com/demo/alignmentTool/output/", maxillary_file, scene,  function (meshes) { 
        meshes[1].material = matte;
      });
      scene.render();
      camera.position = boxe.position;
      //boxb.rotation = new BABYLON.Vector3(Math.PI/2,0.5,0);
      //buttonbox.appendChild(button2);
      //button2.onclick = function() {
      /*pick2++;
    if(pick2 == 0){
    button2.background = "#B564E3";
    }else{
    button2.background = "#777B7E";
    }*/
      if(options === "button2") {
        button2.isVisible = true;
      } else {
        button2.isVisible = false;
      }
    
      // Show/Hide myMeshThree
      //for (mesh of Align)
      //  mesh.setEnabled(true); 
      //}

    });
    gui.addControl(button2);
  
    var click = BABYLON.GUI.Button.CreateSimpleButton("click_button","Point");
    click.top = "24%";
    click.left = "-43%";
    click.width = "130px";
    click.height = "40px";
    click.color = "#6495ED";
    click.thickness = 2;
    //click.background = "gray";
    click.fontSize = "18px";
    //click.fontcolor = "#FFFFFF";
    //click.color = "#FFFFFF";
    click.background ="#FFFFFF";
    click.cornerRadius = 8;
    //var pick1 = 0;
    click.onPointerClickObservable.add(function () {
      /*pick1++;
    if(pick1 == 0){
    clik.background = "#B564E3";
    }else{
    click.background = "#777B7E";
    }*/
      //scene.registerBeforeRender(function() {
      if(options === "click") {
        click.isVisible = true;
      } else {
        click.isVisible = false;
      }
      //	});	
    
      //console.log("clearall")
      /*if (counter == 0) {
  click.isPickable = false;
  console.log("click");
  }
  else if (counter == 1) {
  click.isPickable = true;
  }*/
      pointClick=1;
      //buttonbox.appendChild(click);
      //	click.onclick = function() {
      // Show/Hide myMeshThree
      //for (mesh of pickPoint)
      //  mesh.setEnabled(true); 
      //}

    });
    gui.addControl(click); 
  
    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "220px";
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(panel);
    var image = new BABYLON.GUI.Image("rotated", assetsDirectory+"rot_tool.svg");
    image.top = "-30%";
    image.left = "-44%";
    image.width = "60px";
    image.height = "60px";
    advancedTexture.addControl(image); 
    var rotate = BABYLON.GUI.Button.CreateSimpleButton("rotated");
    rotate.top = "-30%";
    rotate.left = "-44%";
    rotate.width = "50px";
    rotate.height = "50px";
    rotate.color = "white";
    rotate.fontSize = 15;
    rotate.background = "transparent";
    rotate.fontSize = "18px";
    rotate.cornerRadius = 25;
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

    /*rotate.onPointerEnterObservable.add(
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
      //gizmo.updateGizmoRotationToMatchAttachedMesh = true;
      //gizmo.updateGizmoPositionToMatchAttachedMesh = false;
    
      var utilLayer = new BABYLON.UtilityLayerRenderer(scene);

      // Create the gizmo and attach to the sphere
      //var gizmo = new BABYLON.PositionGizmo(utilLayer);
      var gizmo = new BABYLON.RotationGizmo(utilLayer);
      gizmo.attachedMesh = box_cube;
      gizmo.attachedMesh = mandibular;

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
    images.top = "-15%";
    images.left = "-44%";
    images.width = "60px";
    images.height = "60px";
    advancedTexture.addControl(images);
    var translate = BABYLON.GUI.Button.CreateSimpleButton("Translate");
    translate.top = "-15%";
    translate.left = "-44%";
    translate.width = "60px";
    translate.height = "60px";
    translate.color = "white";
    translate.fontSize = 15;
    translate.background = "transparent";
    translate.fontSize = "18px";
    translate.cornerRadius = 30;
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

    /* translate.onPointerEnterObservable.add(
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

    translate.onPointerUpObservable.add(function() {
      console.log('translate')
      //gizmo.updateGizmoRotationToMatchAttachedMesh = false;
      //gizmo.updateGizmoPositionToMatchAttachedMesh = true;
      var utilLayer = new BABYLON.UtilityLayerRenderer(scene);

      // Create the gizmo and attach to the sphere
      var gizmo = new BABYLON.PositionGizmo(utilLayer);
      //var gizmo = new BABYLON.RotationGizmo(utilLayer);
      gizmo.attachedMesh = box_cube;
      gizmo.attachedMesh = mandibular;

      //gizmo.attachableMeshes = [box_cube, mandibular];
      //gizmo.attachToMesh([box_cube, mandibular]);
      //gizmo.attachedMesh = dummy

      // Keep the gizmo fixed to world rotation
      //gizmo.updateGizmoRotationToMatchAttachedMesh = false;
      gizmo.updateGizmoPositionToMatchAttachedMesh = true;
    });
    //gui.addControl(translate);
    advancedTexture.addControl(translate);
  
    //var box_cube = BABYLON.MeshBuilder.CreateBox("Box1", options, scene, true);
    //box_cube.position.z -= 30;
    //box_cube.position.y += 20;
    //box_cube.scaling = new BABYLON.Vector3(15,15,15);
    /*var box2 = BABYLON.MeshBuilder.CreateBox("Box2", options, scene, true);	
      box2.position.x += 40;
      box2.rotation = new BABYLON.Vector3(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);*/
      
    //box_cube.actionManager = new BABYLON.ActionManager(scene);
    //box2.actionManager = new BABYLON.ActionManager(scene);
    var box1 = null;
    const align_point_list = []
    var first_point = new BABYLON.Vector3(0,0,0);
    var second_point = new BABYLON.Vector3(0,0,30);
    var third_point = new BABYLON.Vector3(80,0,30);
    var fourth_point = new BABYLON.Vector3(80,0,0);
    align_point_list.push(first_point)	
    align_point_list.push(second_point)	
    align_point_list.push(third_point)	
    //align_point_list.push(fourth_point)	
    console.log("my align point list", align_point_list)
  
    const align_point_list1 = []
    var first_point1 = new BABYLON.Vector3(0,80,0);
    var second_point1 = new BABYLON.Vector3(0,80,30);
    var third_point1 = new BABYLON.Vector3(0,0,30);
    var fourth_point1 = new BABYLON.Vector3(0,0,0);
    align_point_list1.push(first_point1)	
    align_point_list1.push(second_point1)	
    align_point_list1.push(third_point1)	
    //align_point_list1.push(fourth_point1)	
  
    /*var box3 = BABYLON.MeshBuilder.CreatePolygon(
        "align-plane",
        { align_point_list, 
        updatable: true
        },
        scene
    );*/
    //var box1;
  
    /*var box1 = BABYLON.MeshBuilder.CreatePolygon(
        "polygon",
       align_point_list1,
        scene
    );*/

    //box1 = box1.build();
    //const box1 = BABYLON.MeshBuilder.ExtrudePolygon("polygon1", {shape:align_point_list1, depth:0,  faceColors: faceColors, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);

    const box2 = BABYLON.MeshBuilder.ExtrudePolygon("polygon2", {shape:align_point_list,   sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    //box2.position.x += 40;
    //box2.setPivotPoint(new BABYLON.Vector3(-5, -1, -1));
    //var my_mesh = null;
  
    box2.setEnabled(false);
    scene.environmentTexture = env512;	
    BABYLON.SceneLoader.ImportMesh("","", maxillaryFile, scene, function (meshes) { 
      //BABYLON.SceneLoader.ImportMesh("","scene/", "demo.glb", scene, function (meshes) { 
      box_cube = meshes[0];
      camera.setTarget(box_cube);
      box_cube.material = matte;
      //box_cube.position.y = 50;

      //var pivot = new THREE.Object3D();
      //pivot.add( box_cube );
      //scene.add( pivot );
      //var mesh = newMeshes[0];
      //box_cube.showBoundingBox = true;

      //box_cube.position.x = .1;
      //box_cube.position.y = .46;
      //box_cube.position.z = 0;
      //box_cube.setPivotPoint(box_cube.getBoundingInfo().boundingBox.center);
      //box_cube.rotate(BABYLON.Axis.Y, -(Math.PI / 2), BABYLON.Space.WORLD);
      //box_cube.rotate(BABYLON.Axis.X, -(Math.PI / 2), BABYLON.Space.WORLD);
  
      //box_cube.setPivotPoint(new BABYLON.Vector3(-5, -1, -1));
      //box_cube.translate(new BABYLON.Vector3(2,3,4),1, BABYLON.Space.LOCAL);
      //box_cube.setPositionWithLocalVector(new BABYLON.Vector3(50,3,4));
      //box_cube.locallyTranslate(new BABYLON.Vector3(2,3.4));
      //box_cube.setPivotPoint(box_cube.getBoundingInfo().boundingBox.center);
      //var pivotAt = new BABYLON.Vector3(-15, -10, -10);
      //box_cube.setPivotMatrix(BABYLON.Matrix.Translation(-pivotAt.x, -pivotAt.y, -pivotAt.z));
      //box_cube.position = pivotAt;
      //grp_mesh1 = BABYLON.Mesh.MergeMeshes([meshes[1], meshes[2]]);
      //meshes[1].translate(new BABYLON.Vector3(-1, -1, -1).normalize(), 0.001, BABYLON.Space.WORLD)
      //box1 = meshes[1];
      //console.log("get absolute pos", box1.getAbsolutePosition())
      //my_mesh.parent = box1;
      /*const pivotAt = new BABYLON.Vector3(0, 0, 0);
  const relativePosition = pivotAt.subtract(box1.getAbsolutePosition())
  relative_pos = relativePosition;*/
      //console.log("relative pos", relativePosition)
      //box1.setPivotPoint(relativePosition);
      //box1.translate(relativePosition.normalize(), 0.001, BABYLON.Space.WORLD)
      //box1.COMPUTE_NORMALS = true;
      //box1.actionManager = new BABYLON.ActionManager(scene);
    })
      
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
      
    var bluematerial = new BABYLON.StandardMaterial("bluematerial", scene);
    bluematerial.emissiveColor = new BABYLON.Color3(0, 0, 1);
    class Measurement {
      constructor(pick1) {
        sphere_counter = sphere_counter +1;
        this.sphere1 = BABYLON.Mesh.CreateSphere("measure_sphere"+sphere_counter,8,.2,scene);
        this.sphere1.scaling = new BABYLON.Vector3(10,10,10);
        this.sphere1.position = pick1.pickedPoint; 
        this.sphere1.material = bluematerial;
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

    var alignFaces = async function (m1, m1Face, m2, m2Face, opposite){
      // if opposite is set to false then
      //     function will rotate mesh m1 so that the specified face (m1face) faces the same way as the specified face of mesh m2 (m2face)
      // if opposite is set to true then 
      //     function will rotate mesh m1 so that the specified face (m1face) faces the opposite way to the specified face of m2 (m2face)
    
      curr_pos = box_cube.getAbsolutePosition()
      console.log("before align", curr_pos)
      var i_x = curr_pos.x;
      var i_y = curr_pos.y;
      var i_z = curr_pos.z;
    
      var m1Vector1;
      var m1Vector2;
      var m1IndexData = [];
      var m1VertexData = [];
      var m1FaceVertices = [];
      var m1FaceNormal
    
      var m2Vector1;
      var m2Vector2;
      var m2IndexData = [];
      var m2VertexData = [];
      var m2FaceVertices = [];
      var m2FaceNormal;
      var x1, y, z;
      var m1Matrix, m2Matrix;
      var i;
      var rotAngle, degAngle, rotAxis;
        
      m1.computeWorldMatrix();
      m1Matrix = m1.getWorldMatrix(true);
      console.log("m1Matrix", m1Matrix);
      m2.computeWorldMatrix();
      m2Matrix = m2.getWorldMatrix(true);
    
      m1VertexData = m1.getVerticesData(BABYLON.VertexBuffer.PositionKind, true);
      m1IndexData = m1.getIndices();
      console.log("my data start", m1VertexData, m1IndexData, "my data");
      m2VertexData = m1.getVerticesData(BABYLON.VertexBuffer.PositionKind, true);
      m2IndexData = m1.getIndices();
      //console.log("my data start", m2VertexData, m2IndexData, "my data");
      
      console.info('M1 IndexData Length: ' + m1IndexData.length + ', VertexData Length: ' + m1VertexData.length);			
      console.info('M2 IndexData Length: ' + m2IndexData.length + ', VertexData Length: ' + m2VertexData.length);
          
      // read vertices for the specified face on mesh 1 and 2 that are to be aligned
      for (i = 0; i < 3; i++){
        x1 = m1VertexData[m1IndexData[m1Face * 3 + i]*3 ];
        y = m1VertexData[m1IndexData[m1Face * 3 + i]*3 + 1];
        z = m1VertexData[m1IndexData[m1Face * 3 + i]*3 + 2];	
        console.log("this is ", new BABYLON.Vector3(x1,y,z))
        console.log("matrix", m1Matrix)
        m1FaceVertices[i]=BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(x1,y,z),m1Matrix);
        console.info('M1 Vertex ' + i + '= ' + m1FaceVertices[i]);
    
        x1 = m2VertexData[m2IndexData[m2Face * 3 + i]*3 ];
        y = m2VertexData[m2IndexData[m2Face * 3 + i]*3 + 1];
        z = m2VertexData[m2IndexData[m2Face * 3 + i]*3 + 2];				
        m2FaceVertices[i]=BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(x1,y,z),m2Matrix);
        console.info('M2 Vertex ' + i + '= ' + m2FaceVertices[i]);
    
      }						         
    
      // calculate the normal to those faces
      console.log("two value of m1Vector1", m1FaceVertices[1], m1FaceVertices[0])
      m1Vector1 = m1FaceVertices[1].subtract(m1FaceVertices[0]);
      m1Vector2 = m1FaceVertices[1].subtract(m1FaceVertices[2]);	
      console.log("m1Vector1", m1Vector1)
      console.log("m1Vector2", m1Vector2)
      console.log("wo normalize", BABYLON.Vector3.Cross(m1Vector1, m1Vector2))
      m1FaceNormal = BABYLON.Vector3.Cross(m1Vector1, m1Vector2).normalize();
      console.log("with normalize", m1FaceNormal);
          
      m2Vector1 = m2FaceVertices[1].subtract(m2FaceVertices[0]);
      m2Vector2 = m2FaceVertices[1].subtract(m2FaceVertices[2]);	
      m2FaceNormal = BABYLON.Vector3.Cross(m2Vector1, m2Vector2).normalize();
        
      // calculate the angle between mesh1 face normal and mesh 2 face normal
      rotAngle = Math.acos(BABYLON.Vector3.Dot(m1FaceNormal, m2FaceNormal));
      // calculate it in degrees also for console display purposes
      degAngle=rotAngle*(180/Math.PI);
      console.info('Angle between normals= '+degAngle);
      
      rotAxis=BABYLON.Vector3.Cross(m1FaceNormal,m2FaceNormal);
      console.info('Rotation Axis= '+rotAxis);
          
      // rotate the box to match static box
      m1.rotate(rotAxis, rotAngle);
      
      if(degAngle == 0){
        console.log("deg angle",box_cube.getAbsolutePosition())
        console.log("deg angle1",box_cube.position)
        curr_pos = box_cube.getAbsolutePosition()
        //curr_pos = dummy.getAbsolutePosition()
        box_cube.position = new BABYLON.Vector3(curr_pos.x, 0, curr_pos.z);
        //curr_pos = dummy.getAbsolutePosition()
        await BABYLON.SceneLoader.ImportMesh("","", mandibularFile, scene,  function (meshes) { 
          //meshes[1].position = new BABYLON.Vector3(curr_pos.x, 0, curr_pos.z);
          mandibular = meshes[0];
          console.log("to set", curr_pos.x, 0, curr_pos.z)
          console.log("to set11", i_x, 0, i_z)
          //let s_x = parseFloat(curr_pos.x);
          //console.log("sx", s_x);
          //mandibular.position = new BABYLON.Vector3((-1*curr_pos.x), 0, curr_pos.z);
          //mandibular.position = new BABYLON.Vector3(0, 0, curr_pos.z);
          mandibular.parent = dummy;
          mandibular.material = matte;
          parent_correction = new BABYLON.Vector3(i_x, 0, i_z)
          relativePosition = parent_correction.subtract(box_cube.getAbsolutePosition())
      
          box_cube.position = relativePosition
          //mandibular.position = box_cube.getAbsolutePosition();
          //mandibular.position = relativePosition
          box1.setEnabled(false)
          box2.setEnabled(false)
          polygon.setEnabled(false)
          var sphere1 = scene.getNodeByName("measure_sphere1");//work
          sphere1.setEnabled(false);
          var sphere2 = scene.getNodeByName("measure_sphere2");//work
          sphere2.setEnabled(false);
          var sphere3 = scene.getNodeByName("measure_sphere3");//work
          sphere3.setEnabled(false);
          //sphere1.setEnabled(false)
          //sphere2.setEnabled(false)
          //mandibular.parent = box_cube;
          //dummy.addChild(mandibular);
          console.log("deg angle",box_cube.getAbsolutePosition())
          console.log("deg angle1",box_cube.position)
          curr_pos = box_cube.getAbsolutePosition()
          box_cube.position = new BABYLON.Vector3(curr_pos.x, curr_pos.y, curr_pos.z);
          console.log("to set", curr_pos.x, curr_pos.y, curr_pos.z)
          console.log("to set11", i_x, i_y, i_z)
          box_cube.parent = mandibular;
          parent_correction = new BABYLON.Vector3(i_x, i_y, i_z)
          relativePosition = parent_correction.subtract(mandibular.getAbsolutePosition())
          mandibular.position = relativePosition
      
          // Create utility layer the gizmo will be rendered on

          //gizmo.updateGizmoPositionToMatchAttachedMesh = true;

          // Toggle gizmo on keypress
          document.onkeydown = ()=>{
            //gizmo.attachedMesh = !gizmo.attachedMesh ? box_cube : null
            //gizmo.attachedMesh = !gizmo.attachedMesh ? mandibular : null
            //gizmo.attachedMesh = dum
          }
      
          mandibular.position = relativePosition;
          console.log("mandibular",mandibular.getAbsolutePosition())
          //mandibular.parent = box_cube
        })
      
        //mandibular.position = new BABYLON.Vector3(curr_pos.x, 0, curr_pos.z);
        //console.log("aps pos of mandipular", mandibular.getAbsolutePosition())
        //mandibular.position = new BABYLON.Vector3(curr_pos.x, 0, curr_pos.z);
      
      }
      else{
        alignFaces(x, 1, box2, 1, false);
      }
                    
      // calculate the axis around which to rotate face 1 normal to be same as face 2 normal - this will be 90 to the 2 normals
      rotAxis=BABYLON.Vector3.Cross(m1FaceNormal,m2FaceNormal);
      console.info('Rotation Axis= '+rotAxis);
          
      // rotate the box to match static box
      m1.rotate(rotAxis, rotAngle);
      // translate box 1 to same position as box 2 to compare whether faces are aligned
      m1.position = m2.position;
                  
      //displayMeshAxis(m1);
      //displayMeshAxis(m2);
    
      return;
    }
  
    var clicks = []

    var polygon ;		
    scene.onPointerObservable.add((pointerInfo) => {
      if(pointClick == 1){
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
          if (pointerInfo.pickInfo.hit) {
            var box = BABYLON.MeshBuilder.CreateBox("box", {size: 0.01}, scene);
            box.renderingGroupId = 1
            box.position = pointerInfo.pickInfo.pickedPoint;
    
            pickprevious = pointerInfo.pickInfo;
            measurement1 = new Measurement(pickprevious);
       
            clicks.push(box)
          }
     
          let angle = 0;
          console.log(clicks.length);
          if (clicks.length > 3) {
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

            if (!!polygon){
              polygon.dispose()
            }
            polygon = BABYLON.MeshBuilder.CreatePolygon(
              "polygon",
              { shape, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable:true },
              scene
            );
  
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
              //box_cube.parent = dummy;
              //var pivot11 = new BABYLON.TransformNode("root");
              //pivot11.position = new BABYLON.Vector3(shape[0].x,shape[0].y,shape[0].z); 
              //polygon.parent = pivot11;
              //pivot11.setParent(polygon); 
            }else{
  
            }
  
            //polygon.position = new BABYLON.Vector3(0,0,0);
            console.log("obj pivot points", polygon.getPivotPoint(), polygon.getAbsolutePivotPoint())
            console.log("obj position", polygon.position, polygon.getAbsolutePosition())
            //polygon.setPivotMatrix(BABYLON.Matrix.Translation(clicks[0].position.x, clicks[0].position.y, clicks[0].position.z),false);
            //polygon.setPivotPoint(BABYLON.Vector3(clicks[0].position.x, clicks[0].position.y, clicks[0].position.z), false);
            console.log("my clickes of 0",clicks[0])
            //box1.setPositionWithLocalVector(new BABYLON.Vector3(clicks[0].position.x, clicks[0].position.y, clicks[0].position.z));

            polygon.isPickable = false
            pointClick = 0;
    
          }
        }
        //
      }
    });
  
    scene.onPointerDown = function (ev, pickResult) {                
      if (pickResult.hit) {
                    
        var box = pickResult.pickedMesh;
        console.log("my selected obj",box)
        faceid = pickResult.faceId;
        console.log("my face id",pickResult.faceId)
        /*box_base.dispose();
                        face = Math.floor(pickResult.faceId / 2);
                        console.log(face);
                        faceColors[face] = new BABYLON.Color4((face + 1) / 6, (6 - face) / 6, 0, 1);
                        box_base = BABYLON.MeshBuilder.CreateBox("box", {width: 10, height: 10, depth: 10, faceColors:faceColors}, scene); 
                        box_base.position.y = 5;*/
                        
      }
    }
      
    var onPointerDown = function (evt) {
      if (evt.button !== 0) {
        return;
      }                 
     
      // align box 1 face 2 (red) with box 2 face 2 (red)
      //alignFaces(box1, 1, box2, 9, false);
      //scene.render();
        
      // the specified faces should now be pointing in same direction but will be skewed/rotated around the normal
      // to those faces.  So we call the function again to align 2 faces that are perpendicular to the specified faces
        
      //alignFaces(box1, 4, box2, 4, false);
      //scene.render();
    }	
      
    window.pointDownEvent=canvas.addEventListener("pointerdown", onPointerDown, false);
    //canvas.addEventListener("pointerup", onPointerUp, false);
    //canvas.addEventListener("pointermove", onPointerMove, false);
      
    //displayWorldAxis();
    //displayMeshAxis(box1);
    //displayMeshAxis(box2);
      
    //scene.clearColor = new BABYLON.Color3(0.80, 0.80, 0.80);
    scene.clearColor = new BABYLON.Color3(0.517, 0.517, 0.517);

    createGizmoScene(scene, camera);			
    return scene;
  };

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
    scene = createScene();
  };

  this.initFunction().then(() => {sceneToRender = scene        
    window.engine.runRenderLoop(function () {
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
    //gizmoManager&&gizmoManager.dispose();
  }

  // Resize
  window.addEventListener("resize", function () {
    window.engine.resize();
  });
}