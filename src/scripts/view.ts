import { WebGLRenderer, PerspectiveCamera, Scene } from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { HalftonePass } from "three/examples/jsm/postprocessing/HalftonePass";

export default class CanvasView {
  canvas!: HTMLCanvasElement;
  renderer!: WebGLRenderer;
  camera!: PerspectiveCamera;
  scene!: Scene;
  dimensions: { width: number; height: number };

  private resizeListener: EventListener;

  constructor(id: string, { fitParent = true } = {}) {
    this.canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!this.canvas || this.canvas.tagName != "CANVAS")
      throw `#${id} is not a canvas element.`;

    this.dimensions = this.getDimensions();
    this.createCamera();
    this.createRenderer();
    this.createScene();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  attach() {
    if (this.resizeListener) return;
    window.addEventListener(
      "resize",
      (this.resizeListener = () => {
        // Update sizes
        this.dimensions = this.getDimensions();
        this.resetCamera();
        this.resetRenderer();
      })
    );
  }

  detach() {
    window.removeEventListener("resize", this.resizeListener);
    this.resizeListener = null;

    // more clean up
    this.renderer.dispose();
  }

  getDimensions() {
    const parent = this.canvas.parentElement;
    const rect = parent.getBoundingClientRect();

    return {
      width: rect.width,
      height: rect.height,
    };
  }

  resetDimensions() {
    this.dimensions = this.getDimensions();
  }

  createCamera() {
    this.camera = new PerspectiveCamera(
      75,
      this.dimensions.width / this.dimensions.height,
      0.01,
      1000
    );
  }

  resetCamera() {
    this.camera.aspect = this.dimensions.width / this.dimensions.height;
    this.camera.updateProjectionMatrix();
  }

  createRenderer() {
    this.renderer = new WebGLRenderer({ canvas: this.canvas });
    this.resetRenderer();
  }

  resetRenderer() {
    this.renderer.setSize(this.dimensions.width, this.dimensions.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  createScene() {
    this.scene = new Scene();
  }
}
