/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-cli-stomp',
  included: function(app) {
    this._super.included(app);

    app.import('vendor/stomp.min.js');
    app.import('vendor/ember-cli-stomp/shim.js', {
      type: 'vendor',
      exports: { 'stompjs': ['default'] }
    });
  
    if(process.env.EMBER_ENV === 'test') {
      app.import('vendor/mock-socket.min.js');
      app.import('vendor/ember-cli-stomp/mock-socket-shim.js', {
        type: 'vendor',
        exports: { 'mock-socket': ['default'] }
      });
    }
  }
};
