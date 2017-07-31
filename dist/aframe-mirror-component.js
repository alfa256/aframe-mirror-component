/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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

	          this.cam = new THREE.CubeCamera( 0.5, this.data.distance, this.data.resolution);
	          this.el.object3D.add( this.cam );
	          this.mirrorMaterial = new THREE.MeshBasicMaterial( { color: this.data.color, refractionRatio: this.data.refraction, envMap: this.cam.renderTarget.texture } );
	          this.done = false;
	          var mirrormat = this.mirrorMaterial;
	          this.mesh = this.el.getObject3D('mesh');
	          if(this.mesh){
	            this.mesh.traverse( function( child ) { 
	                if ( child instanceof THREE.Mesh ) child.material = mirrormat;
	            });
	          }
	  },
	  
	  tick: function(t,dt){
	    if(!this.done){
	      if( this.counter > 0){
	        this.counter-=dt;
	      }else{
	        this.mesh = this.el.getObject3D('mesh');
	        
	        if(this.mesh){
	            this.mesh.visible = false;
	            AFRAME.scenes[0].renderer.autoClear = true;
	            this.cam.position.copy(this.el.object3D.worldToLocal(this.el.object3D.getWorldPosition()));
	            this.cam.updateCubeMap( AFRAME.scenes[0].renderer, this.el.sceneEl.object3D );
	            
	            var mirrormat = this.mirrorMaterial;
	            this.mesh.traverse( function( child ) { 
	                if ( child instanceof THREE.Mesh ) child.material = mirrormat;
	            });
	            this.mesh.visible = true;
	        
	            if(!this.data.repeat){
	              this.done = true;
	              this.counter = this.data.interval;
	            }
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


/***/ })
/******/ ]);