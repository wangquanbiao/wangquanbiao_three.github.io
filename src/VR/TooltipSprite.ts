import * as THREE from "three";

export class TooltipSprite {
  private scene: THREE.Scene;
  private position: THREE.Vector3;
  private url: string;
  private userData: Record<string, any>;
  public sprite: THREE.Sprite;
  constructor(
    scene: THREE.Scene,
    position: THREE.Vector3,
    url: string,
    userData: Record<string, any> = {},
  ) {
    this.scene = scene;
    this.position = position;
    this.url = url;
    this.userData = userData;
    this.sprite = new THREE.Sprite();
    this.init()
  }
  init() {
    const tooltipTexture = new THREE.TextureLoader().load(this.url);
    const tooltipMaterial = new THREE.SpriteMaterial({
      map: tooltipTexture,
      transparent: true,
    });
    const tooltipSprite = new THREE.Sprite(tooltipMaterial);
    tooltipSprite.position.copy(this.position);
    tooltipSprite.scale.set(0.2, 0.2, 0.2);
    tooltipSprite.userData = this.userData;
    this.sprite = tooltipSprite;
    this.scene.add(tooltipSprite);
  }
}