//Classes
var mouse = {
	x: 0,
	y: 0,
	left: false,
	right: false,
	lastx: 0,
	lasty: 0
}
var player = {
	pos: new THREE.Vector3(0, 0, 0),
	hp: 6,
	speed: 0.25
}

//Functions
function lerp(a, b, amnt) {
	return a + (b - a) * amnt;
}
function angle(x1, y1, x2, y2) {
	return -Math.atan2(x2 - x1, y2 - y1);
}
function dist(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

//Listeners
window.addEventListener("resize", function f() {
	camera.left = window.innerWidth / -2;
	camera.right = window.innerWidth / 2;
	camera.top = window.innerHeight / 2;
	camera.bottom = window.innerHeight / -2;
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.updateProjectionMatrix();
});
document.addEventListener("mousemove", function f(event){
	var vector = new THREE.Vector3(
		(event.clientX / window.innerWidth - 0.5) * 2, 
		-(event.clientY / window.innerHeight - 0.5) * 2, -1).unproject(camera);
	mouse.x = vector.x;
	mouse.y = vector.y;
});
document.addEventListener("touchmove", function f(event){
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});
document.addEventListener("mousedown", function f(event){
	mouse.left = (event.buttons & 1);
	mouse.right = (event.buttons & 2);
});
document.addEventListener("mouseup", function f(event){
	mouse.left = (event.buttons & 1);
	mouse.right = (event.buttons & 2);
});

//Setup
var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(
	window.innerWidth / -2, 
	window.innerWidth / 2,
	window.innerHeight / 2,
	window.innerHeight / -2,
	-10, 1000);
camera.zoom = 50;
camera.updateProjectionMatrix();
var renderer = new THREE.WebGLRenderer({ antialias:true });

//Set Renderer Things
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)

//Definitions
var debugText = document.getElementById("debug");

//Add Cube
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({wireframe: true, opacity: 0.5, transparent: true, color: 0x00aaff});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//Add Arrow
var arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xffffff, 0.5, 0.25);
scene.add(arrow);

//Render
render();
	function render() {
		//Pre-Frame
		requestAnimationFrame(render);

		//Text
		debugText.innerHTML = "Mouse Position = " + mouse.x + "," + mouse.y
			+ "<br>Camera Position = " + camera.position.x + "," + camera.position.y
			+ "<br>Player Position = " + player.pos.x + "," + player.pos.y;

		//Move
		//cube.position.x = lerp(cube.position.x, mouse.x, 0.1);
		//cube.position.y = lerp(cube.position.y, mouse.y, 0.1);
		cube.rotation.y = (cube.position.x + cube.position.y) / 4;
		player.pos.x += (mouse.x - mouse.lastx) * player.speed;
		player.pos.y += (mouse.y - mouse.lasty) * player.speed;
		arrow.rotation.z = angle(0, 0, mouse.x, mouse.y);
		arrow.position = player.pos;
		arrow.setLength(dist(mouse.lastx, mouse.lasty, mouse.x, mouse.y), 0.5, 0.25);

		//Translate Camera
		camera.position.lerp(player.pos, 0.05);

		//Post-Frame
		renderer.render(scene, camera);
		mouse.lastx = mouse.x;
		mouse.lasty = mouse.y;
	}