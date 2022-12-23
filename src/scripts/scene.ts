import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water";
import CanvasView from "@scripts/view";
import { getCurrentTheme } from "@scripts/theme";

if (document.getElementById("threejs-scene")) {
  const view = new CanvasView("threejs-scene");

  // Scene
  const waterGeometry = new THREE.PlaneGeometry(750, 750);
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      "/media/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    alpha: 1.0,
    sunDirection: new THREE.Vector3(0, 1, 0),
    sunColor: 0x0a0c37,
    waterColor: 0x000000,
    distortionScale: 4,
    fog: false,
  });
  water.position.z = 20;
  water.rotation.x = -Math.PI / 2;
  view.scene.add(water);

  const geometry = new THREE.SphereGeometry(50, 32, 32);
  const material = new THREE.MeshPhongMaterial();

  material.emissive = new THREE.Color(0xf9ac53);

  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(0, 1.5, 200);
  view.scene.add(sphere);

  const light = new THREE.PointLight(0xf9ac53, 10, 10);
  light.position.set(0, 1.5, 150);
  light.castShadow = false;
  view.scene.add(light);

  const skyGeo = new THREE.SphereGeometry(950, 32, 15);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color(0x0077ff) },
      bottomColor: { value: new THREE.Color(0xffffff) },
      offset: { value: 33 },
      exponent: { value: 0.6 },
    },
    vertexShader: `
varying vec3 vWorldPosition;

void main() {

  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}`,
    fragmentShader: `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;

varying vec3 vWorldPosition;

void main() {

  float h = normalize( vWorldPosition + offset ).y;
  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );

}
`,
    side: THREE.BackSide,
  });

  const sky = new THREE.Mesh(skyGeo, skyMat);
  if (getCurrentTheme() === "light") {
    view.scene.add(sky);
    water.material.uniforms["waterColor"].value = new THREE.Color(0x00008b);
  }

  window.addEventListener("theme-change", () => {
    if (getCurrentTheme() === "light") {
      view.scene.add(sky);
      water.material.uniforms["waterColor"].value = new THREE.Color(0x00008b);
    } else {
      view.scene.remove(sky);
      water.material.uniforms["waterColor"].value = new THREE.Color(0x000000);
    }
  });

  view.camera.position.set(-8, 2.5, -13.5);
  view.camera.rotation.set(0, (200 * Math.PI) / 180, 0);
  view.attach();

  const tick = () => {
    water.material.uniforms["time"].value += 1.0 / 90;
    view.render();
    window.requestAnimationFrame(tick);
  };

  tick();
}
