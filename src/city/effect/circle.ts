import * as THREE from 'three';
import { color } from '../config';
import { Cylinder } from './cylinder';
import { zip } from 'three/examples/jsm/libs/fflate.module.js';
export class Circle {
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
      height: 1,
      open: false,
      opacity: 0.6,
      color: color.circle,
      position: {
        x: 300,
        y: 0,
        z: 300,
      },
      speed: 2.0
    }
    new Cylinder(this.scene, this.time).createCylinder(this.config);
  }
}