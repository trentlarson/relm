import stampit from 'stampit'

const CanProject = stampit({
  props: {
    domElement: null
  },
  
  init() {
    this.vector = new THREE.Vector3()
    this.domElement = null
  },

  methods: {
    project(position, camera, screen) {
      this.vector.copy(position)

      this.vector.project( camera ); 
      this.vector.x = (this.vector.x + 1) * screen.width / 2
      this.vector.y = -(this.vector.y - 1) * screen.height / 2
      this.vector.z = 0

      this.updateDomElement()
    },

    updateDomElement() {
      if (this.domElement) {
        this.domElement.style.left = this.vector.x + 'px'
        this.domElement.style.top = this.vector.y + 'px'
      }
    }
  }
})

const WithLabel = stampit({
  init({ body = document.body, onLabelChanged }) {
    this.domElement = document.createElement('div')
    this.domElement.classList.add('entity-label')
    
    // If an onLabelChanged function is passed in, labels can be edited by the user
    if (onLabelChanged) {
      this.onLabelChanged = onLabelChanged
      
      this.domElement.setAttribute('contenteditable', 'true')
      this.domElement.addEventListener('keydown', (event) => {
        if (event.keyCode === 13) { /* ENTER confirms the edit */
          this.domElement.blur()
        } else if (event.keyCode === 27) { /* ESC cancels the edit */
          this.domElement.textContent = this.labelBeforeEdit
          this.domElement.blur()
        }
      })
      this.domElement.addEventListener('focus', () => {
        this.labelBeforeEdit = this.domElement.textContent
        this.domElement.classList.add('editing')
      })
      this.domElement.addEventListener('blur', () => {
        this.onLabelChanged(this.domElement.textContent)
        this.domElement.classList.remove('editing')
      })
    }
    
    this.documentBody = body
    this.documentBody.appendChild(this.domElement)
  },

  methods: {
    show() {
      if (!this.domElement) { return }
      this.domElement.style.display = ""
    },

    hide() {
      if (!this.domElement) { return }
      this.domElement.style.display = "none"
    },

    setText(text) {
      this.text = text
      this.domElement.textContent = text
    },

    destroyDomElement() {
      if (this.domElement) {
        this.domElement.remove()
      }
    }
  }
})

const Label = stampit(
  CanProject,
  WithLabel
)

export { Label, WithLabel, CanProject }