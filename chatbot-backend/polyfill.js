/**
 * polyfill.js — Must be imported FIRST in server.js
 * Provides DOMMatrix stub so pdf-parse works on Node.js v22+
 * where DOMMatrix was removed from the global scope.
 */
if (!globalThis.DOMMatrix) {
  function DOMMatrix(init) {
    this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
    this.m11 = 1; this.m12 = 0; this.m13 = 0; this.m14 = 0;
    this.m21 = 0; this.m22 = 1; this.m23 = 0; this.m24 = 0;
    this.m31 = 0; this.m32 = 0; this.m33 = 1; this.m34 = 0;
    this.m41 = 0; this.m42 = 0; this.m43 = 0; this.m44 = 1;
    this.is2D = true;
    this.isIdentity = true;
  }
  DOMMatrix.prototype.multiply      = function() { return new DOMMatrix(); };
  DOMMatrix.prototype.translate     = function() { return new DOMMatrix(); };
  DOMMatrix.prototype.scale         = function() { return new DOMMatrix(); };
  DOMMatrix.prototype.rotate        = function() { return new DOMMatrix(); };
  DOMMatrix.prototype.inverse       = function() { return new DOMMatrix(); };
  DOMMatrix.prototype.transformPoint = function(p) { return p || { x: 0, y: 0, z: 0, w: 1 }; };
  DOMMatrix.fromMatrix              = function() { return new DOMMatrix(); };
  DOMMatrix.fromFloat32Array        = function() { return new DOMMatrix(); };
  DOMMatrix.fromFloat64Array        = function() { return new DOMMatrix(); };
  globalThis.DOMMatrix = DOMMatrix;
}
