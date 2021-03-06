import stampit from 'stampit'

import { SkeletonUtils } from './lib/SkeletonUtils.js'
import { Component } from './component.js'

const { AnimationMixer } = THREE

/**
 * Finds an AnimationClip with a function passed in as the condition. More flexible
 * than the AnimationClip.findByName function it was adapted from:
 * 
 * https://github.com/mrdoob/three.js
 * /blob/e88ddc6613f5d17a0b815ffbfb1d9ca46d63361d/src/animation/AnimationClip.js#L197
 * 
 * @param {Function} condition A filter function, returns true if a match is found.
 */
function findAnimationClip(objectOrClipArray, condition) {
  var clipArray = objectOrClipArray

  if (!Array.isArray( objectOrClipArray)) {
    var o = objectOrClipArray
    clipArray = o.geometry && o.geometry.animations || o.animations
  }

  for (var i = 0; i < clipArray.length; i ++) {
    if (condition(clipArray[ i ].name)) {
      return clipArray[ i ]
    }
  }

  return null
}

const HasAnimationMixer = stampit(Component, {
  props: {
    animationResourceId: null,
    animationActions: ['walking', 'falling'],
    animationMixer: null,
    animatedObject: null,
    clips: null,
  },
  
  deepProps: {
    state: {
      animationSpeed: {
        now: 1.0,
        target: 1.0,
      },
      animationMeshName: {
        now: null,
        target: null
      },
    }
  },

  init({
    animationResourceId,
    animationMeshName,
    animationSpeed = this.state.animationSpeed.now,
    animationActions = this.animationActions
  }) {
    this.clips = {}
    this.animationSpeed = animationSpeed
    this.animationResourceId = animationResourceId
    this.animationActions = animationActions
    this.state.animationMeshName.target = animationMeshName
  },

  methods: {
    setAnimationSpeed(speed) {
      this.state.animationSpeed.target = speed
    },

    getClonedObjectWithSkeleton(meshName) {
      let object3d
      this.resources.get(this.animationResourceId).scene.traverse(o1 => {
        if (o1.name === meshName) { // Object3D, contains Bone & SkinnedMesh
          // Find mesh inside avatar container
          object3d = SkeletonUtils.clone(o1)
          object3d.traverse(o2 => {
            if (o2.isMesh) { this.setMeshDefaults(o2) }
          })
        }
      })

      if (!object3d) {
        throw new Error(`Unable to find object in scene ${meshName} in ${this.animationResourceId}`)
      }
      
      return object3d
    },

    setMeshDefaults (mesh) {
      mesh.castShadow = true
      mesh.receiveShadow = true
      if (mesh.material) {
        mesh.material.metalness = 0.0
        mesh.material.transparent = true
      }
      return mesh
    },

    attachAnimatedObject(meshName) {
      // If this isn't the first time, remove existing animatedObject from the root object
      if (this.animatedObject) {
        this.object.remove(this.animatedObject)
      }

      // We must use a clone of the object so that our customizations aren't global
      this.animatedObject = this.getClonedObjectWithSkeleton(meshName)
      this.animatedObject.scale.set(1, 1, 1)
      this.object.add(this.animatedObject)
    },


    /**
     * Creates a `this.mixer` AnimationMixer object and a `this.clips` map for each 
     * of the animationActions defined in this stamp's props. Clips can be played
     * as animation sequences.
     * 
     * Note: the `animationActions` don't have to be exact matches, they must merely
     * be present in the animation's name. For example 'walking' will match
     * 'armature-15-walking'.
     */
    changeAnimationMesh(meshName) {
      this.attachAnimatedObject(meshName)
      
      // TODO: this is a bit of a hack, but it seems to be the only way to match
      // animations to mesh name:
      // - our mesh names are of the form '[gender]-[sequence]-armature'
      // - we remove the '-armature' and are left with a prefix
      // - this prefix can be used to match the AnimationClip (see findAnimationClip below)
      const prefix = meshName.split('-').slice(0,2).join('-')

      const animations = this.resources.get(this.animationResourceId).animations
      this.mixer = new AnimationMixer(this.animatedObject)
      for (const action of this.animationActions) {
        const animation = findAnimationClip(animations, (name) => {
          return name.indexOf(prefix) === 0 && name.indexOf(action) >= 0
        })
        if (animation) {
          this.clips[action] = this.mixer.clipAction(animation)
        } else {
          console.error('Unable to find AnimationClip for action', action)
        }
      }
    },

    update(delta) {
      if (this.state.animationMeshName.now !== this.state.animationMeshName.target) {
        this.state.animationMeshName.now = this.state.animationMeshName.target
        this.changeAnimationMesh(this.state.animationMeshName.now)
      }
      if (this.mixer) {
        if (this.state.animationSpeed.now !== this.state.animationSpeed.target) {
          // TODO: transition to faster/slower speed?
          this.state.animationSpeed.now = this.state.animationSpeed.target
        }
        this.mixer.update(delta * this.state.animationSpeed.now)
      }
    },

    teardown() {
      if (this.animatedObject) {
        this.object.remove(this.animatedObject)
      }
    }
 
  }
})

export { HasAnimationMixer }
