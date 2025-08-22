var box; // 3d viewport gizmo
var selected_obj = null; //mouse click select object
var default_material; // before segmentation material
let divFps = document.getElementById("fps"); // fps variable
var canvas = document.getElementById("renderCanvas"); // render canvas for viewport
var inspector = BABYLON.GUI.Button.CreateSimpleButton("inspector", "Inspector"); // for the development need
var engine = null; // render engine
var scene = null; // scene for 3d tool
var sceneToRender = null; // render to view
var error_material; // for the collesion detection tool
var hdrTexture; // improve the quality for the texture
var gum_shader; // gum material for after segmentation
var teeth_shader; // teeth material for the after segmentation
var ghosting_shader; //ghosting shader for the ghosting tool
var ghosting_shader_before_seg;
var Hemi_Left; // Light for left side of object
var Hemi_Right; // Light for right side of object
var Hemi_Mid; // Light for middle of object
var show_maxillary; // show only maxillary button
var show_mandibular; // show only mandibular button 
var show_bite;       // show only bite button
var bottom_camera, top_camera, right_camera, left_camera, front_camera; // for the camera view
var background_material;
var gui, gizmo, gizmoManager;
var translate, rotate;

var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

var delayCreateScene = function () {

	var createGizmoScene = function (mainScene, mainCamera) {
		var scene2 = new BABYLON.Scene(engine);
		scene2.autoClear = false;

		var camera2 = new BABYLON.ArcRotateCamera("camera1", 5 * Math.PI / 8, 5 * Math.PI / 8, 30, new BABYLON.Vector3(0, 2, 0), scene2);

		camera2.viewport = new BABYLON.Viewport(0.7, 0.7, 0.35, 0.35);

		// Dupplicate scene info
		mainScene.afterRender = () => {
			scene2.render();
			camera2.alpha = mainCamera.alpha;
			camera2.beta = mainCamera.beta;
			camera2.radius = 13;
		};



		var redmaterial = new BABYLON.StandardMaterial("redmaterial", scene2);
		//redmaterial.emissiveColor = new BABYLON.Color3(0.173, 0.173, 0.173);
		redmaterial.emissiveColor = new BABYLON.Color3(0, 0.459, 1);


		var bluematerial = new BABYLON.StandardMaterial("bluematerial", scene2);
		bluematerial.emissiveColor = new BABYLON.Color3(0.341, 0.431, 0.541);

		var greenmaterial = new BABYLON.StandardMaterial("greenmaterial", scene2);
		greenmaterial.emissiveColor = new BABYLON.Color3(0.110, 0.110, 0.110);
		
		var whitematerial = new BABYLON.StandardMaterial("whitematerial", scene2);
		whitematerial.emissiveColor = new BABYLON.Color3(1, 1, 1);


		/*********************Create Box***************/
		var faceColors = [];
		faceColors[0] = BABYLON.Color3.White();
		faceColors[1] = BABYLON.Color3.White()
		faceColors[2] = BABYLON.Color3.White();
		faceColors[3] = BABYLON.Color3.White();
		faceColors[4] = BABYLON.Color3.White();
		faceColors[5] = BABYLON.Color3.White();

		var box = BABYLON.MeshBuilder.CreateBox("Box", { faceColors: faceColors, size: 1.5 }, scene2, true);
		//box.material = new BABYLON.StandardMaterial("", scene2);
		//box.setEnabled(false);
		box.material = whitematerial;
		var plane = BABYLON.MeshBuilder.CreatePlane("plane", { height: 1.5, width: 1.5, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene2)
		plane.position = new BABYLON.Vector3(0.83, 0, 0);
		var axis = new BABYLON.Vector3(0, 1, 0);
		plane.rotate(axis, 1.5708, BABYLON.Space.WORLD)
		plane.material = redmaterial;

		var plane = BABYLON.MeshBuilder.CreatePlane("plane", { height: 1.5, width: 1.5, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene2)
		plane.position = new BABYLON.Vector3(-0.83, 0, 0);
		var axis = new BABYLON.Vector3(0, 1, 0);
		plane.rotate(axis, 1.5708, BABYLON.Space.WORLD)
		plane.material = redmaterial;

		var plane = BABYLON.MeshBuilder.CreatePlane("plane", { height: 1.5, width: 1.5, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene2)
		plane.position = new BABYLON.Vector3(0, 0, 0.83);

		plane.material = bluematerial;

		var plane = BABYLON.MeshBuilder.CreatePlane("plane", { height: 1.5, width: 1.5, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene2)
		plane.position = new BABYLON.Vector3(0, 0, -0.83);

		plane.material = bluematerial;

		var plane = BABYLON.MeshBuilder.CreatePlane("plane", { height: 1.5, width: 1.5, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene2)
		plane.position = new BABYLON.Vector3(0, 0.83, 0);
		var axis = new BABYLON.Vector3(1, 0, 0);
		plane.rotate(axis, 1.5708, BABYLON.Space.WORLD)
		plane.material = greenmaterial;

		var plane = BABYLON.MeshBuilder.CreatePlane("plane", { height: 1.5, width: 1.5, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene2)
		plane.position = new BABYLON.Vector3(0, -0.83, 0);
		var axis = new BABYLON.Vector3(1, 0, 0);
		plane.rotate(axis, -1.5708, BABYLON.Space.WORLD)
		plane.material = greenmaterial;



		error_material = new BABYLON.PBRMetallicRoughnessMaterial("error_material", scene);

		error_material.baseColor = new BABYLON.Color3(0.99, 0.98, 0.93, 0.86);

		error_material.metallic = 1.0;
		error_material.roughness = 0.4;


		//Load Environment SkyBox 
		//scene.createDefaultEnvironment({environmentTexture: "./textures/environment.dds"});
		//hdrTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData("./textures/environment.env", scene);
		//scene.environmentTexture = hdrTexture;
		
		//Load Environment SkyBox 
			/*scene.createDefaultEnvironment({
			environmentTexture: "./Textures/environment.dds"});
			
            var BackgroundSkybox = scene.getNodeByName("BackgroundSkybox");
			BackgroundSkybox.setEnabled(false);
			var BackgroundPlane = scene.getNodeByName("BackgroundPlane");
			//BackgroundPlane.position = new BABYLON.Vector3(100,0,0);
			BackgroundPlane.position = new BABYLON.Vector3(-30,20,0);
			BackgroundPlane.rotation = new BABYLON.Vector3(0, 5, 0);
			BackgroundPlane.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
			var BackgroundPlaneMaterial = scene.getMaterialByName('BackgroundPlaneMaterial')
			BackgroundPlaneMaterial.alpha= 0.3;
			BackgroundPlaneMaterial.diffuseColor = new BABYLON.Color3(0.5,0.5,0.5) */
			
			//BackgroundPlane.lookAt(camera.position);
			//camera.setTarget(BackgroundPlane);
			
			//BackgroundPlane.

		//___________________________________________________________________________________________________________________________________________


		


		ghosting_shader = new BABYLON.PBRMaterial("Ghosting", scene);
			
			
		ghosting_shader.albedoColor = new BABYLON.Color3(0.141, 0.282, 0.804);
		ghosting_shader.metallic = 0.08;
		ghosting_shader.roughness = 0.3;
		ghosting_shader.alpha = 1;
		ghosting_shader.alphaMode = BABYLON.Engine.ALPHA_ADD
		ghosting_shader.indexOfRefraction = 1.3;
			

		
        ghosting_shader.backFaceCulling = false;    
		
		ghosting_shader_before_seg = new BABYLON.PBRMaterial("Ghosting", scene);
			
			
		ghosting_shader_before_seg.albedoColor = new BABYLON.Color3(0.38, 0.38, 0.38);
		ghosting_shader_before_seg.metallic = 0.08;
		ghosting_shader_before_seg.roughness = 0.3;
		ghosting_shader_before_seg.alpha = 0.5;
		ghosting_shader_before_seg.alphaMode = BABYLON.Engine.ALPHA_ADD
		ghosting_shader_before_seg.indexOfRefraction = 1.3;


		/***********Create and Draw Axes**************************************/
		var showAxis = function (size) {
			var makeTextPlane = function (text, color, size) {
				//var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene2, true);
				//dynamicTexture.hasAlpha = true;
				//dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
				var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene2, true);
				plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene2);
				plane.material.backFaceCulling = false;
				plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
				//plane.material.diffuseTexture = dynamicTexture;
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
				new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
				new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
			], scene2);
			axisY.color = new BABYLON.Color3(0, 1, 0);
			var yChar = makeTextPlane("Y", "green", size / 5);
			yChar.position = new BABYLON.Vector3(1, 0.9 * size, -0.05 * size);
			var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
				new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
				new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
			], scene2);
			axisZ.color = new BABYLON.Color3(0, 0, 1);
			var zChar = makeTextPlane("Z", "blue", size / 5);
			zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
		};

		//showAxis(4);
	}


	var scene = new BABYLON.Scene(engine);
	gizmoManager = new BABYLON.GizmoManager(scene)

	
	
	default_material = new BABYLON.StandardMaterial("myMaterial", scene);
	default_material.diffuseColor = new BABYLON.Color3(0.820, 0.804, 0.804);
	default_material.specularColor = new BABYLON.Color3(0.647, 0.627, 0.627);
	default_material.specularPower = 10.90;

	default_material.backFaceCulling = false;

	//var env512 = BABYLON.CubeTexture.CreateFromPrefilteredData("https://assets.babylonjs.com/environments/environmentSpecular.env", scene);
	//env512.name = "env512";
	//env512.gammaSpace = false;

	// L  I  G  H  T  S  			

	//Directional Light Left

	//Adding Hemi - Left light
	var Hemi_Left = new BABYLON.HemisphericLight("Hemi_Left", new BABYLON.Vector3(0, 1, 1), scene);
	Hemi_Left.intensity = 0.6000;

	//Adding Hemi - Center light
	var Hemi_Mid = new BABYLON.HemisphericLight("Hemi_Mid", new BABYLON.Vector3(-1, 0, 0), scene);
	Hemi_Mid.intensity = 0.2000;

	//Adding Hemi - Right light
	var Hemi_Right = new BABYLON.HemisphericLight("Hemi_Right", new BABYLON.Vector3(1, 1, -1), scene);
	Hemi_Right.intensity = 0.5000;




	//Adding an Arc Rotate Camera
	camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);


background_material = new BABYLON.StandardMaterial("background_material", scene);
	
	background_material.diffuseTexture = new BABYLON.Texture("./textures/backgroundGround.png", scene);
	background_material.emissiveTexture = new BABYLON.Texture("./textures/backgroundGround.png", scene);
	background_material.alpha = 0.3;
	background_material.useAlphaFromDiffuseTexture = true;
	background_material.diffuseTexture.hasAlpha = true;
	
	var plane = BABYLON.MeshBuilder.CreatePlane("plane", { height: 10, width: 10  }, scene)
	plane.material = background_material;
	//plane.parent = camera;
	//camera.addChild(plane);
	
	plane.position = new BABYLON.Vector3(-60.77, -6.89, 0.00);
	plane.rotation  = new BABYLON.Vector3(0,5,0);
	plane.scaling = new BABYLON.Vector3(15,15,15);
    plane.setEnabled(false);
	//camera.parent = plane;
	//plane.lookAt(camera.position);
	
	var faceColors = [];

	//camera.setPosition(new BABYLON.Vector3(0, 0, 100));
	camera.setPosition(new BABYLON.Vector3(0, 0, 100));
	camera.attachControl(canvas, true);

	//bottom
	bottom_camera = BABYLON.Mesh.CreateBox("bottom_camera", 1.0, scene);
	bottom_camera.position = new BABYLON.Vector3(-40, -90, 0);
	//top
	top_camera = BABYLON.Mesh.CreateBox("top_camera", 1.0, scene);
	top_camera.position = new BABYLON.Vector3(-40, 90, 0);
	//right
	right_camera = BABYLON.Mesh.CreateBox("right_camera", 1.0, scene);
	right_camera.position = new BABYLON.Vector3(20, -9, 0);
	//left
	left_camera = BABYLON.Mesh.CreateBox("left_camera", 1.0, scene);
	left_camera.position = new BABYLON.Vector3(-90, -9, 0);
	//front
	front_camera = BABYLON.Mesh.CreateBox("front_camera", 1.0, scene);
	front_camera.position = new BABYLON.Vector3(-40, 0, -30);

	bottom_camera.setEnabled(false);
	top_camera.setEnabled(false);
	right_camera.setEnabled(false);
	left_camera.setEnabled(false);
	front_camera.setEnabled(false);



	//var env512 = BABYLON.CubeTexture.CreateFromPrefilteredData("https://assets.babylonjs.com/environments/environmentSpecular.env", scene);
	//env512.name = "env512";
	//env512.gammaSpace = false;

	var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
	gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");

	var panel = new BABYLON.GUI.StackPanel();
	panel.width = "220px";
	panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
	advancedTexture.addControl(panel);
	var image = new BABYLON.GUI.Image("rotated", "Assets/rot_tool.png");
	image.top = "-30%";
	image.left = "-47%";
	image.width = "60px";
	image.height = "60px";
	//advancedTexture.addControl(image);
	rotate = BABYLON.GUI.Button.CreateSimpleButton("rotated");
	rotate.top = "-30%";
	rotate.left = "-47%";
	rotate.width = "50px";
	rotate.height = "50px";
	rotate.color = "white";
	rotate.fontSize = 15;
	rotate.background = "transparent";
	rotate.fontSize = "18px";
	rotate.cornerRadius = 25;


	rotate.onPointerUpObservable.add(function () {
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
	var images = new BABYLON.GUI.Image("translate", "Assets/move_tool1.svg");
	images.top = "-15%";
	images.left = "-47%";
	images.width = "60px";
	images.height = "60px";
	//advancedTexture.addControl(images);
	translate = BABYLON.GUI.Button.CreateSimpleButton("Translate");
	translate.top = "-15%";
	translate.left = "-47%";
	translate.width = "60px";
	translate.height = "60px";
	translate.color = "white";
	translate.fontSize = 15;
	translate.background = "transparent";
	translate.fontSize = "18px";
	translate.cornerRadius = 30;


	/*translate.onPointerUpObservable.add(function () {
		console.log('translate')
		gizmoManager.positionGizmoEnabled = true;
		gizmoManager.rotationGizmoEnabled = false;
		var checker;
		gizmoManager.gizmos.rotationGizmo.xGizmo.dragBehavior.onDragEndObservable.add((e) => {
			console.log(selected_obj, "selected obj")


		});

		gizmo.updateGizmoRotationToMatchAttachedMesh = true;

	});*/
	//gui.addControl(translate);
	//advancedTexture.addControl(translate);



	show_bite = BABYLON.GUI.Button.CreateSimpleButton("set");
	var image = new BABYLON.GUI.Image("set", "Assets/Frame 445 2.png");
	image.top = "-40%";
	image.left = "15%";
	image.width = "70px";
	image.height = "70px";
	//advancedTexture.addControl(image);
	show_bite.top = "-40%";
	show_bite.left = "15%";
	show_bite.width = "50px";
	show_bite.height = "50px";
	//rotate.color = "Red";
	show_bite.fontSize = 15;
	show_bite.background = "transparent";
	show_bite.fontSize = "18px";
	show_bite.cornerRadius = -15;

	//gui.addControl(show_bite);
	//advancedTexture.addControl(show_bite);

	//scene.environmentTexture = env512;
	show_mandibular = BABYLON.GUI.Button.CreateSimpleButton("Mand");
	var image = new BABYLON.GUI.Image("Mand", "Assets/Mand-1 1.png");
	image.top = "-40%";
	image.left = "5%";
	image.width = "70px";
	image.height = "70px";
	//advancedTexture.addControl(image);
	show_mandibular.top = "-40%";
	show_mandibular.left = "5%";
	show_mandibular.width = "50px";
	show_mandibular.height = "50px";

	show_mandibular.fontSize = 15;
	show_mandibular.background = "transparent";
	show_mandibular.fontSize = "18px";
	show_mandibular.cornerRadius = 10;

	//gui.addControl(show_mandibular);
	//advancedTexture.addControl(show_mandibular);


	show_maxillary = BABYLON.GUI.Button.CreateSimpleButton("Max");
	var image = new BABYLON.GUI.Image("Max", "Assets/Max-1 1.png");
	image.top = "-40%";
	image.left = "-5%";
	image.width = "70px";
	image.height = "70px";
	//advancedTexture.addControl(image);
	show_maxillary.top = "-40%";
	show_maxillary.left = "-5%";
	show_maxillary.width = "50px";
	show_maxillary.height = "50px";
	show_maxillary.fontSize = 15;
	show_maxillary.background = "transparent";
	show_maxillary.fontSize = "18px";
	show_maxillary.cornerRadius = 10;

	//gui.addControl(show_maxillary);
	//advancedTexture.addControl(show_maxillary);


	var back = BABYLON.GUI.Button.CreateSimpleButton("back");
	var image = new BABYLON.GUI.Image("back", "Assets/Back 1.png");
	image.top = "-18%";
	image.left = "45%";
	image.width = "48px";
	image.height = "48px";
	//advancedTexture.addControl(image);
	back.top = "-18%";
	back.left = "45%";
	back.width = "48px";
	back.height = "48px";
	back.fontSize = 15;
	back.background = "transparent";
	back.fontSize = "18px";
	back.cornerRadius = "20px";

	back.onPointerUpObservable.add(function () {
		console.log('back');


	});
	//gui.addControl(back);
	//advancedTexture.addControl(back);


	var Bottoom = BABYLON.GUI.Button.CreateSimpleButton("Bottoom");
	var image = new BABYLON.GUI.Image("Bottoom", "Assets/Bottoom 1.png");
	image.top = "-6%";
	image.left = "45%";
	image.width = "48px";
	image.height = "48px";
	//advancedTexture.addControl(image);
	Bottoom.top = "-6%";
	Bottoom.left = "45%";
	Bottoom.width = "48px";
	Bottoom.height = "48px";
	//Bottoom.color = "Red";
	Bottoom.fontSize = 15;
	Bottoom.background = "transparent";
	Bottoom.fontSize = "18px";
	Bottoom.cornerRadius = "20px";

	Bottoom.onPointerUpObservable.add(function () {
		console.log('Bottoom');


	});
	//gui.addControl(Bottoom);
	//advancedTexture.addControl(Bottoom);

	var Left = BABYLON.GUI.Button.CreateSimpleButton("Left");
	var image = new BABYLON.GUI.Image("Left", "Assets/Left 1.png");
	image.top = "6%";
	image.left = "45%";
	image.width = "48px";
	image.height = "48px";
	//advancedTexture.addControl(image);
	Left.top = "6%";
	Left.left = "45%";
	Left.width = "48px";
	Left.height = "48px";
	//Left.color = "Red";
	Left.fontSize = 15;
	Left.background = "transparent";
	Left.fontSize = "18px";
	Left.cornerRadius = "20px";

	Left.onPointerUpObservable.add(function () {
		console.log('Left');

	});
	//gui.addControl(Left);
	//advancedTexture.addControl(Left);

	var Right = BABYLON.GUI.Button.CreateSimpleButton("Right");
	var image = new BABYLON.GUI.Image("Right", "Assets/Right 1.png");
	image.top = "18%";
	image.left = "45%";
	image.width = "48px";
	image.height = "48px";
	//advancedTexture.addControl(image);
	Right.top = "18%";
	Right.left = "45%";
	Right.width = "48px";
	Right.height = "48px";
	Right.fontSize = 15;
	Right.background = "transparent";
	Right.fontSize = "18px";
	Right.cornerRadius = "20px";

	Right.onPointerUpObservable.add(function () {
		console.log('Right');

	});
	//gui.addControl(Right);
	//advancedTexture.addControl(Right);

	var Top = BABYLON.GUI.Button.CreateSimpleButton("Top");
	var image = new BABYLON.GUI.Image("Top", "Assets/Top.png");
	image.top = "30%";
	image.left = "45%";
	image.width = "48px";
	image.height = "48px";
	//advancedTexture.addControl(image);
	Top.top = "30%";
	Top.left = "45%";
	Top.width = "48px";
	Top.height = "48px";
	Top.fontSize = 15;
	Top.background = "transparent";
	Top.fontSize = "18px";
	Top.cornerRadius = "20px";

	Top.onPointerUpObservable.add(function () {
		console.log('Top');
	});
	//gui.addControl(Top);
	//advancedTexture.addControl(Top);







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

	//gui.addControl(inspector);


	var utilLayer = new BABYLON.UtilityLayerRenderer(scene);

	gizmo = new BABYLON.PositionGizmo(utilLayer);

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
		var xAxis = scene.getMeshByName("xAxis" + mesh.name);
		var yAxis = scene.getMeshByName("yAxis" + mesh.name);
		var zAxis = scene.getMeshByName("zAxis" + mesh.name);
		if (xAxis != null) { xAxis.dispose(); }
		if (yAxis != null) { yAxis.dispose(); }
		if (zAxis != null) { zAxis.dispose(); }

		// calculate new normals for this mesh in world coordinate system
		var xNormal = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(100, 0, 0), matrix);
		var yNormal = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 100, 0), matrix);
		var zNormal = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0, 100), matrix);
		// create axis lines
		xAxis = BABYLON.Mesh.CreateDashedLines("xAxis" + mesh.name, [origin, xNormal], 3, 10, 200, scene, false);
		xAxis.color = BABYLON.Color3.Red();
		yAxis = BABYLON.Mesh.CreateDashedLines("yAxis" + mesh.name, [origin, yNormal], 3, 10, 200, scene, false);
		yAxis.color = BABYLON.Color3.Green();
		zAxis = BABYLON.Mesh.CreateDashedLines("zAxis" + mesh.name, [origin, zNormal], 3, 10, 200, scene, false);
		zAxis.color = BABYLON.Color3.Blue();

		scene.render();
		//return null;
	};


	scene.clearColor = new BABYLON.Color3(0.235, 0.235, 0.235);

	createGizmoScene(scene, camera);


	return scene;
};

var loopI = 0;
window.initFunction = async function () {

	var asyncEngineCreation = async function () {
		try {
			return createDefaultEngine();
		} catch (e) {
			console.log("the available createEngine function failed. Creating the default engine instead");
			return createDefaultEngine();
		}
	}

	window.engine = await asyncEngineCreation();
	if (!engine) throw 'engine should not be null.';


	window.scene = delayCreateScene();
};
initFunction().then(() => {
	sceneToRender = scene
	engine.runRenderLoop(function () {
		//divFps.innerHTML = engine.getFps().toFixed() + " fps";


		if (sceneToRender && sceneToRender.activeCamera) {
			sceneToRender.render();
		}
	});
});

// Resize
window.addEventListener("resize", function () {
	engine.resize();
});