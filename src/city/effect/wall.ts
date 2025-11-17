import * as THREE from 'three';
import { color } from '../config';
import { Cylinder } from './cylinder';
export class Wall {
  private scene: THREE.Scene;
  private time: {
    value: number;
  };
  private config: {
    radius: number;
    height: number;
    open: boolean;
    opacity: number;
    color: string;
    position: {
      x: number;
      y: number;
      z: number;
    },
    speed: number
  };
  constructor(scene: THREE.Scene, time: any) {
    this.scene = scene;
    this.time = time;
    this.config = {
      radius: 50,
      height: 50,
      open: true,
      opacity: 0.6,
      color: color.wall,
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      speed: 1.0
    }
    new Cylinder(this.scene, this.time).createCylinder(this.config);
  }
}