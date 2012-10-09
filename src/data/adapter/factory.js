// data/factory.js
(function() {
    "use strict";

    /**
     * Class XML3D.webgl.XML3DDataAdapterFactory
     * extends: XML3D.base.AdapterFactory
     *
     * XML3DDataAdapterFactory creates DataAdapter instances for elements using generic data (<mesh>, <data>, <float>,...).
     * Additionally, it manages all DataAdapter instances so that for each node there is always just one DataAdapter. When
     * it creates a DataAdapter, it calls its init method. Currently, the following elements are supported:
     *
     * <ul>
     *      <li>mesh</li>
     *      <li>shader</li>
     *      <li>lightshader</li>
     *      <li>float</li>
     *      <li>float2</li>
     *      <li>float3</li>
     *      <li>float4</li>
     *      <li>int</li>
     *      <li>bool</li>
     *      <li>texture</li>
     *      <li>data</li>
     * </ul>
     *
     * @author Kristian Sons
     * @author Benjamin Friedrich
     *
     * @version  10/2010  1.0
     */

    /**
     * Constructor of XML3DDataAdapterFactory
     *
     * @constructor
     * @implements {XML3D.base.IFactory}
     * @extends XML3D.base.AdapterFactory
     *
     * @param {XML3D.webgl.CanvasHandler} handler
     */
    var XML3DDataAdapterFactory = function()
    {
        XML3D.base.AdapterFactory.call(this);
    };
    XML3D.createClass(XML3DDataAdapterFactory, XML3D.base.AdapterFactory);

    XML3DDataAdapterFactory.prototype.isFactoryFor = function(obj) {
        return obj == XML3D.data;
    };

    /**
     * Returns a DataAdapter instance associated with the given node. If there is already a DataAdapter created for this node,
     * this instance is returned, otherwise a new one is created.
     *
     * @param   node  element node which uses generic data. The supported elements are listed in the class description above.
     * @returns DataAdapter instance
     */
    XML3DDataAdapterFactory.prototype.getAdapter = function(node)
    {
        return XML3D.base.AdapterFactory.prototype.getAdapter.call(this, node, XML3D.data.XML3DDataAdapterFactory.prototype);
    };

    /**
     * Tries to create an adapter from an URI
     *
     * @param {string} uri
     * @returns {Adapter} An resolved adapter
     */
    XML3DDataAdapterFactory.prototype.getAdapterURI = function(node, uri)
    {
        if(!uri) {
            return new XML3D.base.AdapterHandle();
        }
        uri = new XML3D.URI(uri);

        // TODO: Get document of current adapter, use it instead of window.document
        var a = XML3D.base.resourceManager.getAdapterHandle(node.ownerDocument, uri, XML3D.data);
        return a;
    };


    var data = XML3D.data, reg = {};

    reg['mesh']        = data.SinkDataAdapter;
    reg['shader']      = data.SinkDataAdapter;
    reg['lightshader'] = data.SinkDataAdapter;
    reg['float']       = data.ValueDataAdapter;
    reg['float2']      = data.ValueDataAdapter;
    reg['float3']      = data.ValueDataAdapter;
    reg['float4']      = data.ValueDataAdapter;
    reg['float4x4']    = data.ValueDataAdapter;
    reg['int']         = data.ValueDataAdapter;
    reg['int4']        = data.ValueDataAdapter;
    reg['bool']        = data.ValueDataAdapter;
    reg['img']         = data.ImgDataAdapter;
    reg['texture']     = data.TextureDataAdapter;
    reg['data']        = data.DataAdapter;

   /**
     * Creates a DataAdapter associated with the given node.
     *
     * @param node
     *            element node which uses generic data. The supported elements
     *            are listed in the class description above.
     * @returns DataAdapter instance
     */
    XML3DDataAdapterFactory.prototype.createAdapter = function(node)
    {
        //XML3D.debug.logDebug("Creating adapter: " + node.localName);
        var adapterContructor = reg[node.localName];
        if(adapterContructor !== undefined) {
            return new adapterContructor(this, node);
        }
        XML3D.debug.logWarning("Not supported as data element: " + node.localName);
        return null;
    };

    // Export
    XML3D.data.XML3DDataAdapterFactory = XML3DDataAdapterFactory;
    XML3D.data.factory = new XML3DDataAdapterFactory();
    XML3D.base.registerFactory("application/xml", XML3D.data.factory);
}());