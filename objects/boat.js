import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import { MAX_VELOCITY, ACCELERATION } from './config'
import CANNON from 'cannon'

class VelocityModel {
  v = 0
  a = 0
  theta = 0
  triggerKey = ''

  constructor(triggerKey) {
    this.v = 0
    this.a = 0
    this.theta = 0
    this.triggerKey = triggerKey

    this.keyControl()
  }

  keyControl() {
    window.addEventListener('keydown', (event) => {
      const keyPress = event.key
      if (keyPress === this.triggerKey) {
        this.a = ACCELERATION
      }
      if (keyPress === 'd') {
        this.theta += Math.PI / 100
      }
      if (keyPress === 'a') {
        this.theta -= Math.PI / 100
      }
    })

    window.addEventListener('keyup', (event) => {
      const keyRelease = event.key
      if (keyRelease === this.triggerKey) {
        this.a = -ACCELERATION
      }
    })
  }

  accelerate() {
    if (this.v < MAX_VELOCITY && this.v > 0) {
      this.v += this.a
    } else if (this.v <= 0 && this.a > 0) {
      this.v += this.a
    } else if (this.v >= MAX_VELOCITY && this.a < 0) {
      this.v += this.a
    }
  }
}

class Boat {
  front = new VelocityModel('w')
  back = new VelocityModel('s')
  mesh = new THREE.Mesh()

  sphereBody = new CANNON.Body()

  constructor(scene, world, posX, posY, posZ) {
    const loader = new GLTFLoader()
    loader.load('../models/tiny_boat/scene.gltf', (gltf) => {
      this.mesh = gltf.scene
      this.mesh.scale.set(0.1, 0.1, 0.1)
      scene.add(this.mesh)
    })

    let sphereShape = new CANNON.Sphere(1)
    let sphereCM = new CANNON.Material()
    this.sphereBody = new CANNON.Body({
      mass: 5,
      shape: sphereShape,
      position: new CANNON.Vec3(0, 10, 0),
      material: sphereCM,
    })
    world.add(this.sphereBody)

    //ground
    let groundShape = new CANNON.Plane()
    let groundCM = new CANNON.Material()
    let groundBody = new CANNON.Body({
      mass: 0,
      shape: groundShape,
      material: groundCM,
      position: new CANNON.Vec3(0, -2, 0),
    })
    groundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2,
    )
    world.add(groundBody)

    let sphereGroundContact
    sphereGroundContact = new CANNON.ContactMaterial(groundCM, sphereCM, {
      friction: 0.5,
      restitution: 0.7,
    })
    world.addContactMaterial(sphereGroundContact)
  }

  update() {
    this.front.accelerate()
    this.back.accelerate()

    this.sphereBody.position.x -= this.front.v * Math.cos(this.front.theta)
    this.sphereBody.position.z -= this.front.v * Math.sin(this.front.theta)
    this.sphereBody.position.x += this.back.v * Math.cos(this.front.theta)
    this.sphereBody.position.z += this.back.v * Math.sin(this.front.theta)

    this.mesh.rotation.y = -this.front.theta
    this.sphereBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      this.mesh.rotation.y,
    )

    this.mesh.position.copy(this.sphereBody.position)
    this.mesh.quaternion.copy(this.sphereBody.quaternion)
  }
}

export default Boat