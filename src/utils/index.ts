import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import type { Group } from 'three'

const fbxLoader = new FBXLoader();

export const loadFBx = (url: string): Promise<Group> => {
  return new Promise((resolve, reject) => {
    fbxLoader.load(url, (object: Group) => {
      resolve(object);
    }, undefined, (error: any) => {
      reject(error)
    });
  })
}