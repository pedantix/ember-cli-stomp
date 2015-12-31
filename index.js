/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-stomp',
  included: function(app) {
    this._super.included(app);

    app.import('vendor/stomp.min.js');
    app.import('vendor/ember-cli-stomp/shim.js', {
      type: 'vendor',
      exports: { 'stompjs': ['default'] }
    });
  }
};
