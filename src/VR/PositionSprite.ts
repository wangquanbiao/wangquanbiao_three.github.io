import * as THREE from "three";

export class PositionSprite {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private text: string;
  private position: THREE.Vector3;
  private callbacks: any[] = [];
  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    text: string,
    position: THREE.Vector3,
  ) {
    this.scene = scene;
    this.camera = camera;
    this.text = text;
    this.position = position;
    this.callbacks = [];
    this.init()
  }
  init() {
    // 定义canvas
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "rgba(100,100,100,.7)";
    context.fillRect(0, 256, canvas.width, canvas.height / 2);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "bold 200px Arial";
    context.fillStyle = "white";
    context.fillText(this.text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    })
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(this.position);
    this.scene.add(sprite);

    let pointer = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();
    window.addEventListener('click', (event: MouseEvent) => { 
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, this.camera);
      const intersects = raycaster.intersectObject(sprite);
      if (intersects.length > 0) { 
        // 触发回调
        this.callbacks.forEach((callback) => {
          callback();
        })
      }
    })
  }
  onClick(callback: () => void) {
    this.callbacks.push(callback);
  }
}