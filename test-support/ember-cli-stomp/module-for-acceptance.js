import { module } from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import sinon from 'sinon';
import Stomp from 'stompjs';
import Ember from 'ember';

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();
      this.stomper = stomperTemplate();
      this.stub = sinon.stub(Stomp, "over").returns(this.stomper);

      if (options.beforeEach) {
        options.beforeEach.apply(this, arguments);
      }

      this.sendMessage = function(channel, body){
        const subscription = this.stomper.subscriptions[channel];
        if(Ember.isPresent(subscription)){
          const message = JSON.stringify(body);
          subscription({"body": message});
        } else {
          Ember.assert(`there is no subscription for "${channel}"`);
        }
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
