(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.RestApi) {
      root.RestApi = {};
    }
    root.RestApi.Organization = factory(root.RestApi.ApiClient);
  }
}(this, function(ApiClient) {
    'use strict';




  /**
   * The Organization model module.
   * @module model/Organization
   * @version v1
   */

  /**
   * Constructs a new <code>Organization</code>.
   * An organization in Rockset is a container for users and collections.
   * @alias module:model/Organization
   * @class
   */
  var exports = function() {
    var _this = this;





  };

  /**
   * Constructs a <code>Organization</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Organization} obj Optional instance to populate.
   * @return {module:model/Organization} The populated <code>Organization</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'String');
      }
      if (data.hasOwnProperty('display_name')) {
        obj['display_name'] = ApiClient.convertToType(data['display_name'], 'String');
      }
      if (data.hasOwnProperty('tier')) {
        obj['tier'] = ApiClient.convertToType(data['tier'], 'String');
      }
      if (data.hasOwnProperty('state')) {
        obj['state'] = ApiClient.convertToType(data['state'], 'String');
      }
    }
    return obj;
  }

  /**
   * unique identifier for the organization
   * @member {String} id
   */
  exports.prototype['id'] = undefined;
  /**
   * name of the organization
   * @member {String} display_name
   */
  exports.prototype['display_name'] = undefined;
  /**
   * pricing tier
   * @member {module:model/Organization.TierEnum} tier
   */
  exports.prototype['tier'] = undefined;
  /**
   * org state
   * @member {module:model/Organization.StateEnum} state
   */
  exports.prototype['state'] = undefined;


  /**
   * Allowed values for the <code>tier</code> property.
   * @enum {String}
   * @readonly
   */
  exports.TierEnum = {
    /**
     * value: "STARTER"
     * @const
     */
    "STARTER": "STARTER",
    /**
     * value: "PREMIUM"
     * @const
     */
    "PREMIUM": "PREMIUM",
    /**
     * value: "ENTERPRISE"
     * @const
     */
    "ENTERPRISE": "ENTERPRISE"  };

  /**
   * Allowed values for the <code>state</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StateEnum = {
    /**
     * value: "NEW"
     * @const
     */
    "NEW": "NEW",
    /**
     * value: "ACTIVE"
     * @const
     */
    "ACTIVE": "ACTIVE",
    /**
     * value: "DELETED"
     * @const
     */
    "DELETED": "DELETED"  };


  return exports;
}));


