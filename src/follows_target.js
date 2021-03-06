import stampit from 'stampit'

import { Component } from './component.js'
import { HasObject } from './has_object.js'

const { Vector3, Matrix4, Quaternion, MathUtils } = THREE

const FollowsTarget = stampit(Component, HasObject, {
  props: {
    speed: 100.0,
    followTurning: false,
    turnSpeed: 10.0,
    closeEnough: 1.0,
    distanceToTarget: 0.0,
  },

  deepProps: {
    state: {
      speed: {
        now: 100.0,
        target: 100.0,
      }
    }
  },

  /**
   * Initializes the FollowsTarget stamp
   * @param {Vector3} position Initial position (in cartesian coordinates)
   * @param {Quaternion} direction Initial direction (as a quaternion)
   */
  init({
    speed = this.state.speed.now,
    followTurning = this.followTurning
  }) {
    this.state.speed.target = speed
    this.followTurning = followTurning

    this.quaternion = new Quaternion()
    this.matrix = new Matrix4()
    
    this.followsTargetEnabled = true
  },

  methods: {
    setSpeed(speed) {
      this.state.speed.target = speed
    },

    /**
     * @returns {Vector3}
     */
    getPosition() {
      return this.state.position.now
    },

    /**
     * @param {Vector3} coords
     */
    setPosition(coords) {
      this.state.position.target.copy(coords)
    },
    
    /**
     * @param {Vector3} coords
     */
    addPosition(coords) {
      if (!this.followAdd) {
        this.followAdd = new Vector3()
      }
      this.followAdd.add(coords)
    },

    enableFollowsTarget() {
      this.followsTargetEnabled = true
    },

    disableFollowsTarget() {
      this.followsTargetEnabled = false
    },
    
    /**
     * Instantly move to a position (no animation, no lerp).
     * FIXME: Put this in a better place? CanWarp Component?
     
     * @param {Vector3} coords 
     */
    warpToPosition(coords) {
      this.state.position.now.copy(coords)
      this.object.position.copy(coords)
    },

    updatePosition(delta, distance) {
      if (distance > this.closeEnough) {
        const lerpAlpha = MathUtils.clamp(this.state.speed.now * delta / distance, 0.00001, 0.5)
        this.state.position.now.lerp(this.state.position.target, lerpAlpha)

        // Update the root object's position to match update
        this.object.position.copy(this.state.position.now)
      }
    },

    updateDirection(delta, distance) {
      this.matrix.lookAt(this.state.position.target, this.state.position.now, this.object.up)
      this.quaternion.setFromRotationMatrix(this.matrix)

      if (distance > this.closeEnough) {
        const lerpAlpha = MathUtils.clamp(this.turnSpeed * delta, 0.00001, 1)
        this.object.quaternion.slerp(this.quaternion, lerpAlpha)
      }
    },

    update(delta) {
      if (!this.followsTargetEnabled) {
        return
      }
      // FIXME: Sometimes we are getting an object, rather than a Vector3
      //        in this.state.position.target. This is a terrible hack that
      //        acknowledges that untyped languages suck.
      if (this.state.position.target && !this.state.position.target.copy) {
        const value = this.state.position.target
        this.state.position.target = new THREE.Vector3()
        this.state.position.target.copy(value)
      }
      
      if (this.state.speed.now !== this.state.speed.target) {
        this.state.speed.now = this.state.speed.target
      }

      if (this.followAdd) {
        this.followAdd.normalize()
        this.followAdd.multiplyScalar(100.0)
        this.followAdd.add(this.state.position.now)
        this.state.position.target.copy(this.followAdd)
        this.followAdd.set(0, 0, 0)
      }
        
      this.distanceToTarget = this.state.position.now.distanceTo(this.state.position.target)
      this.updatePosition(delta, this.distanceToTarget)
      if (this.followTurning) {
        this.updateDirection(delta, this.distanceToTarget)
      }
    },
  }

})

export { FollowsTarget }
