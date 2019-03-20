var scene, camera, light, renderer, particle;
var container;

var points = JSON.parse(window.localStorage.getItem('points'));
// console.log(points);

var pointswithoutnull = points.filter(function(val) {
    return val !== null;
});


var DeviceOrientationControls = require('./entities/DeviceOrientationControls');

var shufflepoints = Array.from({length: pointswithoutnull.length}, () => (Math.random() * 800 - 400));

// var shufflepoints = new Array(pointswithoutnull.length);

for (var i = 0; i < shufflepoints.length; i++) {
    if(i%3 == 2){
        shufflepoints[i] = 680;
    }else{
        shufflepoints[i] = Math.random() * 800 - 400;    
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 600);
    scene.add(camera);

    light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    var geometry = new THREE.BufferGeometry();
    var vertices = new Float32Array(shufflepoints);
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    var material = new THREE.PointsMaterial({ color: 0xBFBFBF, size: 5 });
    particle = new THREE.Points(geometry, material);
    scene.add(particle);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    // controls = new THREE.DeviceOrientationControls(camera,true);

    // var qjgeometry = new THREE.SphereBufferGeometry(1000, 60, 40);
    // qjgeometry.scale(-1, 1, 1);
    // var qjmaterial = new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('../assets/img/starrynight.jpg')
    // });
    // var mesh = new THREE.Mesh(qjgeometry, qjmaterial);
    // mesh.position.set(0, 0, -100);
    // scene.add(mesh);

    // console.log(controls);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, -220);

}

function render() {
    controls.update();
    // console.log(controls.deviceOrientation);
    renderer.render(scene, camera);
    particle.geometry.attributes.position.needsUpdate = true;
    // if (controls.deviceOrientation.beta > 160 && controls.deviceOrientation.beta < 180) {
    //     // console.log('true');
        TweenLite.to(particle.geometry.attributes.position.array, 3, pointswithoutnull);
    //     // alert("miao");
    // }
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

init();
animate();