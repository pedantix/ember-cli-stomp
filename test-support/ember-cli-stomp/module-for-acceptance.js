import { module } from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import sinon from 'sinon';
import Stomp from 'stompjs';

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();
      this.stomper = stomperTemplate();
      this.stub = sinon.stub(Stomp, "over").returns(this.stomper);

      if (options.beforeEach) {
        options.beforeEach.apply(this, arguments);
      }
    },

    afterEach() {
      destroyApp(this.application);
      this.stub.restore(); 

      if (options.afterEach) {
        options.afterEach.apply(this, arguments);
      }
    }
  });
}

function stomperTemplate(){
  return {
    subscriptions: {},
    subscribe(channel, callback){
      this.subscriptions[channel] = callback; 
    }
  };
}
