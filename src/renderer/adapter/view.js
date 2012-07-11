// Adapter for <view>
(function() {
    var XML3DViewRenderAdapter = function(factory, node) {
        XML3D.webgl.RenderAdapter.call(this, factory, node);
        this.zFar = 100000;
        this.zNear = 0.1;
        this.parentTransform = null;
        this.viewMatrix = mat4.create();
        this.projMatrix = null;
        this.updateViewMatrix();
    };
    XML3D.createClass(XML3DViewRenderAdapter, XML3D.webgl.RenderAdapter);
    var p = XML3DViewRenderAdapter.prototype;

    var tmp = mat4.create(),
        tmp2 = mat4.create();

    p.updateViewMatrix = function() {
        // Create local matrix
        var pos = this.node.position._data;
        var orient = this.node.orientation.toMatrix()._data;

        // tmp = T
        mat4.identity(tmp);
        tmp[12] = pos[0];
        tmp[13] = pos[1];
        tmp[14] = pos[2];

        // tmp = T * O
        mat4.multiply(tmp, orient);

        var p = this.factory.getAdapter(this.node.parentNode);
        this.parentTransform = p.applyTransformMatrix(mat4.identity(tmp2));

        if (this.parentTransform) {
            mat4.multiply(this.parentTransform, tmp, tmp);
        }
        mat4.set(mat4.inverse(tmp), this.viewMatrix);
    };

    p.getProjectionMatrix = function(aspect) {
        if (this.projMatrix == null) {
            var fovy = this.node.fieldOfView;
            var zfar = this.zFar;
            var znear = this.zNear;
            var f = 1 / Math.tan(fovy / 2);
            this.projMatrix = mat4.create([ f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (znear + zfar) / (znear - zfar), -1, 0, 0,
                   2 * znear * zfar / (znear - zfar), 0 ]);

        }
        return this.projMatrix;
    };

    /* Interface method */
    p.getViewMatrix = function() {
        var m = new window.XML3DMatrix();
        m._data.set(this.viewMatrix);
        return m;
    };

    p.getModelViewMatrix = function(model) {
        return mat4.multiply(this.viewMatrix, model, mat4.create());
    };

    p.getModelViewProjectionMatrix = function(modelViewMatrix) {
        return mat4.multiply(this.projMatrix, modelViewMatrix, mat4.create());
    };

    p.notifyChanged = function(evt) {
    	var target = evt.internalType || evt.attrName || evt.wrapped.attrName;

        switch (target) {
        case "parenttransform":
        	this.parentTransform = evt.newValue;
            this.updateViewMatrix();
        break;
        
        case "orientation":
        case "position":
        	 this.updateViewMatrix();
        break;
        
        case "fieldOfView":
        	 this.projMatrix = null;
        break;
        
        default:
            XML3D.debug.logWarning("Unhandled event in view adapter for parameter " + target);
        break;
        }
 
        this.factory.handler.redraw("View changed");
    };

    // Export to XML3D.webgl namespace
    XML3D.webgl.XML3DViewRenderAdapter = XML3DViewRenderAdapter;

}());
