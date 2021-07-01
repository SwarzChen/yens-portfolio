import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils'
import * as THREE from 'three'

class Gate {
  object = new THREE.Object3D()

  constructor(scene, posX, posY, posZ) {
    const loader = new GLTFLoader()
    loader.load('../models/japanese_gates/scene.gltf', (gltf) => {
      this.object.add(SkeletonUtils.clone(gltf.scene))
      this.object.position.set(posX, posY, posZ)
      this.object.scale.set(3, 3, 3)
      scene.add(this.object)
    })
  }
}

export default Gate