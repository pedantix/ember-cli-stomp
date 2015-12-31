import { test } from 'qunit';
import sinon from 'sinon';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import SockJS from 'sockjs';
import Stomp from 'stompjs';

moduleForAcceptance('Acceptance | stomp');

test('#subscribe, mocking stomp queue', function(assert){
  var stomper = {
    subscriptions: {},
    subscribe(channel, callback){
      this.subscriptions[channel] = callback; 
    }
  };

  var message = {
    body: "stuff and things"
  };

  var stub = sinon.stub(Stomp, "over").returns(stomper);
  var chatApp = new StompChat();
  stomper.subscriptions["/queue/tests"](message);
  stomper.subscriptions["/queue/tests"](message);

  const messageLen = chatApp.messages.length;
  assert.equal(messageLen, 2, '2 messages were received');
  stub.restore();
});


function StompChat() {
  const stompClient = Stomp.over(new SockJS('http://localhost:8080/websocket'));
  this.messages = [];

  stompClient.subscribe("/queue/tests", message => {
    this.messages.push(message.body);
  });
}

test('#subscribe, mocking stomp channel, for json', function(assert){
  var stomper = {
    subscriptions: {},
    subscribe(channel, callback){
      this.subscriptions[channel] = callback; 
    }
  };
  var stub = sinon.stub(Stomp, "over").returns(stomper);
  //the above should be extracted

  var message = {
    body: `{ "content" :  "stuff and things"}`
  };
  var expectedContent  = { "content" :  "stuff and things" };

  var chatApp = new StompJSONChat();
  stomper.subscriptions["/queue/tests"](message);
 
  const messageLen = chatApp.messages.length;
  assert.equal(messageLen, 1, '1 messages where sent from the server');
  const actualContent = chatApp.messages[0];  
  assert.equal(expectedContent.content, actualContent.content, 'messages should match, stomp only sends text NOT JSON');

  //the below can be extracted
  stub.restore();
});


function StompJSONChat() {
  const stompClient = Stomp.over(new SockJS('http://localhost:8080/websocket'));
  this.messages = [];

  stompClient.subscribe("/queue/tests", message => {
    var obj = JSON.parse(message.body);
    this.messages.push(obj);
  });
}

