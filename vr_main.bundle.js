/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./vr_app/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/aframe-stereo-component/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/aframe-stereo-component/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {

   // Put an object into left, right or both eyes.
   // If it's a video sphere, take care of correct stereo mapping for both eyes (if full dome)
   // or half the sphere (if half dome)

  'stereo_component' : {
      schema: {
        eye: { type: 'string', default: "left"},
        mode: { type: 'string', default: "full"},
        split: { type: 'string', default: "horizontal"}
      },
       init: function(){

          // Flag to acknowledge if 'click' on video has been attached to canvas
          // Keep in mind that canvas is the last thing initialized on a scene so have to wait for the event
          // or just check in every tick if is not undefined

          this.video_click_event_added = false;

          this.material_is_a_video = false;

          // Check if material is a video from html tag (object3D.material.map instanceof THREE.VideoTexture does not
          // always work

          if(this.el.getAttribute("material")!==null && 'src' in this.el.getAttribute("material") && this.el.getAttribute("material").src !== "") {
            var src = this.el.getAttribute("material").src;

            // If src is an object and its tagName is video...

            if (typeof src === 'object' && ('tagName' in src && src.tagName === "VIDEO")) {
              this.material_is_a_video = true;
            }
          }

          var object3D = this.el.object3D.children[0];

          // In A-Frame 0.2.0, objects are all groups so sphere is the first children
          // Check if it's a sphere w/ video material, and if so
          // Note that in A-Frame 0.2.0, sphere entities are THREE.SphereBufferGeometry, while in A-Frame 0.3.0,
          // sphere entities are THREE.BufferGeometry.

          var validGeometries = [THREE.SphereGeometry, THREE.SphereBufferGeometry, THREE.BufferGeometry];
          var isValidGeometry = validGeometries.some(function(geometry) {
            return object3D.geometry instanceof geometry;
          });

          if (isValidGeometry && this.material_is_a_video) {

              // if half-dome mode, rebuild geometry (with default 100, radius, 64 width segments and 64 height segments)

              if (this.data.mode === "half") {

                  var geo_def = this.el.getAttribute("geometry");
                  var geometry = new THREE.SphereGeometry(geo_def.radius || 100, geo_def.segmentsWidth || 64, geo_def.segmentsHeight || 64, Math.PI / 2, Math.PI, 0, Math.PI);

              }
              else {
                  var geo_def = this.el.getAttribute("geometry");
                  var geometry = new THREE.SphereGeometry(geo_def.radius || 100, geo_def.segmentsWidth || 64, geo_def.segmentsHeight || 64);
              }

              // Panorama in front

              object3D.rotation.y = Math.PI / 2;

              // If left eye is set, and the split is horizontal, take the left half of the video texture. If the split
              // is set to vertical, take the top/upper half of the video texture.

              if (this.data.eye === "left") {
                var uvs = geometry.faceVertexUvs[ 0 ];
                var axis = this.data.split === "vertical" ? "y" : "x";
                for (var i = 0; i < uvs.length; i++) {
                    for (var j = 0; j < 3; j++) {
                        if (axis == "x") {
                            uvs[ i ][ j ][ axis ] *= 0.5;
                        }
                        else {
                            uvs[ i ][ j ][ axis ] *= 0.5;
                            uvs[ i ][ j ][ axis ] += 0.5;
                        }
                    }
                }
              }

              // If right eye is set, and the split is horizontal, take the right half of the video texture. If the split
              // is set to vertical, take the bottom/lower half of the video texture.

              if (this.data.eye === "right") {
                var uvs = geometry.faceVertexUvs[ 0 ];
                var axis = this.data.split === "vertical" ? "y" : "x";
                for (var i = 0; i < uvs.length; i++) {
                    for (var j = 0; j < 3; j++) {
                        if (axis == "x") {
                            uvs[ i ][ j ][ axis ] *= 0.5;
                            uvs[ i ][ j ][ axis ] += 0.5;
                        }
                        else {
                            uvs[ i ][ j ][ axis ] *= 0.5;
                        }
                    }
                }
              }

              // As AFrame 0.2.0 builds bufferspheres from sphere entities, transform
              // into buffergeometry for coherence

              object3D.geometry = new THREE.BufferGeometry().fromGeometry(geometry);

          }
          else{

              // No need to attach video click if not a sphere and not a video, set this to true

              this.video_click_event_added = true;

          }


       },

       // On element update, put in the right layer, 0:both, 1:left, 2:right (spheres or not)

       update: function(oldData){

            var object3D = this.el.object3D.children[0];
            var data = this.data;

            if(data.eye === "both"){
              object3D.layers.set(0);
            }
            else{
              object3D.layers.set(data.eye === 'left' ? 1:2);
            }

       },

       tick: function(time){

           // If this value is false, it means that (a) this is a video on a sphere [see init method]
           // and (b) of course, tick is not added

           if(!this.video_click_event_added){
                if(typeof(this.el.sceneEl.canvas) !== 'undefined'){

                   // Get video DOM

                   this.videoEl = this.el.object3D.children[0].material.map.image;

                   // On canvas click, play video element. Use self to not lose track of object into event handler

                   var self = this;

                   this.el.sceneEl.canvas.onclick = function () {
                      self.videoEl.play();
                   };

                   // Signal that click event is added
                   this.video_click_event_added = true;

                }
           }

       }
     },

  // Sets the 'default' eye viewed by camera in non-VR mode

  'stereocam_component':{

      schema: {
        eye: { type: 'string', default: "left"}
      },

       // Cam is not attached on init, so use a flag to do this once at 'tick'

       // Use update every tick if flagged as 'not changed yet'

       init: function(){
            // Flag to register if cam layer has already changed
            this.layer_changed = false;
       },

       tick: function(time){

            var originalData = this.data;

            // If layer never changed

            if(!this.layer_changed){

            // because stereocam component should be attached to an a-camera element
            // need to get down to the root PerspectiveCamera before addressing layers

            // Gather the children of this a-camera and identify types

            var childrenTypes = [];

            this.el.object3D.children.forEach( function (item, index, array) {
                childrenTypes[index] = item.type;
            });

            // Retrieve the PerspectiveCamera
            var rootIndex = childrenTypes.indexOf("PerspectiveCamera");
            var rootCam = this.el.object3D.children[rootIndex];

            if(originalData.eye === "both"){
                rootCam.layers.enable( 1 );
                rootCam.layers.enable( 2 );
              }
              else{
                rootCam.layers.enable(originalData.eye === 'left' ? 1:2);
              }
            }
       }

  }
};


/***/ }),

/***/ "./vr_app/assets-config.js":
/*!*********************************!*\
  !*** ./vr_app/assets-config.js ***!
  \*********************************/
/*! exports provided: ROOM_1_2, APARTMENT_1, APARTMENT_2, APARTMENT_MAP */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ROOM_1_2", function() { return ROOM_1_2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "APARTMENT_1", function() { return APARTMENT_1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "APARTMENT_2", function() { return APARTMENT_2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "APARTMENT_MAP", function() { return APARTMENT_MAP; });
const ROOM_1 = {
    name: 'room_1',
    url: './img/vr_app/my_room.jpg',
    arrows: [
      {
        attr: {
          position: '50 10 -50',
          rotation: "0 0 90",
          src: "#arrow-right",
          width: "10",
          height: "10",
        },
        data: {
          next: 'room_2',
        }
      },
      /* {
        attr: {
          position: '15 0.25 10',
          rotation: "0 0 90",
          src: "#arrow-right",
          width: "5",
          height: "5",
        },
        data: {
          next: 'room_2',
        }
      } */
    ]
}
const ROOM_2 = {
    name: 'room_2',
    url: './img/vr_app/Bathroom.jpg',
    arrows: [
      {
        attr: {
          position: '20 5 -33',
          rotation: "0 0 90",
          src: "#arrow-right",
          width: "5",
          height: "5",
        },
        data: {
          next: 'room_3',
        }
      },
    ]
}
const ROOM_3 = {
  name: 'room_3',
  url: './img/vr_app/Bedroom.jpg',
  arrows: [
    {
    attr: {
      position: '-110 0 -50',
      rotation: '1 10 90',
      src: "#arrow-right",
      width: "10",
      height: "10",
    },
    data: {
      next: 'room_2',
    }
    },

  ]
}

const ROOM_1_2 = {
  name: 'room_2',
  url: './img/vr_app/Bathroom.jpg',
}
//оренда
const APARTMENT_1 = {
  name: 'APARTMENT_1',
  rooms: [
    ROOM_1_2,
  ]
};

// купівля
const APARTMENT_2 = {
  name: 'APARTMENT_2',
  rooms: [
    ROOM_3,
    ROOM_2,
    ROOM_3,
  ]
};

const APARTMENT_MAP = {
  appt_1: APARTMENT_1,
  appt_2: APARTMENT_2,
}

/***/ }),

/***/ "./vr_app/device_move.js":
/*!*******************************!*\
  !*** ./vr_app/device_move.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./vr_app/main.js":
/*!************************!*\
  !*** ./vr_app/main.js ***!
  \************************/
/*! exports provided: onArrowClick, buildApartment, setUpRoom, buildArrow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onArrowClick", function() { return onArrowClick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildApartment", function() { return buildApartment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setUpRoom", function() { return setUpRoom; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildArrow", function() { return buildArrow; });
/* harmony import */ var _stereo_pair__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stereo-pair */ "./vr_app/stereo-pair.js");
/* harmony import */ var _stereo_pair__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_stereo_pair__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _device_move__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./device_move */ "./vr_app/device_move.js");
/* harmony import */ var _device_move__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_device_move__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _assets_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assets-config */ "./vr_app/assets-config.js");



const SKY_LEFT = document.querySelector('a-sky.left');
const SKY_RIGHT = document.querySelector('a-sky.right');
const SCENE = document.querySelector('a-scene');
const NEXT_ROOM = 'next-room';


AFRAME.registerComponent('next-room', {
  schema: {
    next: { type: 'string' }
  },
  init: function () {
    this.listener = onArrowClick.bind(this);
    this.el.addEventListener('click', this.listener);
  },
  remove() {
    this.el.removeEventListener('click', this.listener);
  },
});


function onArrowClick() {
  const { data } = this;

  const nextRoom = APARTMENT_1.rooms.find(({ name }) => name === data.next);

  setUpRoom(nextRoom);
}

function buildApartment(app) {
  const initialRoom = app.rooms[0];

  setUpRoom(initialRoom);
}

function setUpRoom(room) {
  document.querySelectorAll('[next-room]').forEach(el => el.remove());
  SKY_LEFT.setAttribute('src', room.url);
  SKY_RIGHT.setAttribute('src', room.url);

  room.arrows && room.arrows.forEach(arrowConfig => {
    SCENE.appendChild(buildArrow(arrowConfig));
  })
}

function buildArrow(config) {
  const aImage = document.createElement('a-image');
  Object.entries(config.attr).forEach(([key, val]) => {
    aImage.setAttribute(key, val);
  })

  const dataString = Object.entries(config.data).reduce((acc, [key, val]) => {
    return acc + `${key}: ${val};`;
  }, '')

  aImage.setAttribute(NEXT_ROOM, dataString);
  return aImage;
}
const SELECT_KEY = "VR_APP_APARTMENT";
const selectedAppartment = _assets_config__WEBPACK_IMPORTED_MODULE_2__["APARTMENT_MAP"][window.SELECTED_APARTMENT];

const apartmentFromStorage = sessionStorage.getItem(SELECT_KEY);
const apartmentToShow = apartmentFromStorage ? JSON.parse(apartmentFromStorage) : selectedAppartment;

if (!apartmentFromStorage) {
  sessionStorage.setItem(SELECT_KEY, JSON.stringify(selectedAppartment))
}

buildApartment(apartmentToShow);


/***/ }),

/***/ "./vr_app/stereo-pair.js":
/*!*******************************!*\
  !*** ./vr_app/stereo-pair.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var stereoComponent = __webpack_require__(/*! aframe-stereo-component */ "./node_modules/aframe-stereo-component/index.js").stereo_component;
var stereocamComponent = __webpack_require__(/*! aframe-stereo-component */ "./node_modules/aframe-stereo-component/index.js").stereocam_component;

AFRAME.registerComponent('stereo', stereoComponent);
AFRAME.registerComponent('stereocam', stereocamComponent);

/***/ })

/******/ });
//# sourceMappingURL=vr_main.bundle.js.map