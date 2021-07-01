import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils'
import * as THREE from 'three'

class StoneIsland {
  object = new THREE.Object3D()

  constructor(scene, posX, posY, posZ) {
    const loader = new GLTFLoader()
    loader.load('../models/stone_island/scene.gltf', (gltf) => {
      this.object.add(SkeletonUtils.clone(gltf.scene))
      this.object.position.set(posX, posY, posZ)
      this.object.scale.set(0.05, 0.05, 0.05)
      scene.add(this.object)
    })
  }
}

export default StoneIsland