/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Mirror Material component for A-Frame by Alfredo Consebola 2017.
 */
AFRAME.registerComponent('mirror', {
  schema: {
    resolution: { type:'number', default: 128},
    refraction: { type:'number', default: 0.95},
    color: {type:'color', default: 0xffffff},
    distance: {type:'number', default: 3000},
    interval: { type:'number', default: 1000},
    repeat: { type:'boolean', default: false}
  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function(){
          this.counter = this.data.interval;
          this.mesh = this.el.getObject3D('mesh');
          this.cam = new THREE.CubeCamera( 0.5, this.data.distance, this.data.resolution);
          
          this.el.object3D.add( this.cam );
          
          this.mirrorMaterial = new THREE.MeshBasicMaterial( { color: this.data.color, refractionRatio: this.data.refraction, envMap: this.cam.renderTarget.texture } );
          this.mesh.material = this.mirrorMaterial;
          this.done = false;
          
  },
  
  tick: function(t,dt){
    if(!this.done){
      if( this.counter > 0){
        this.counter-=dt;
      }else{
        this.mesh.visible = false;
        AFRAME.scenes[0].renderer.autoClear = true;
        this.cam.position.copy( this.el.object3D.position);
        this.cam.updateCubeMap( AFRAME.scenes[0].renderer, this.el.sceneEl.object3D );
        this.mesh.visible = true;
        
        if(!this.data.repeat){
          this.done = true;
          this.counter = this.data.interval;
        }
      }
    }
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {},

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () {},

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { }
});