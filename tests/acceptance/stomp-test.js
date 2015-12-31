import { test } from 'qunit';
import moduleForStompAcceptance from '../../tests/helpers/module-for-stomp-acceptance';
import SockJS from 'sockjs';
import Stomp from 'stompjs';

moduleForStompAcceptance('Acceptance | stomp');

test('#subscribe, mocking stomp queue', function(assert){
  var message = {
    body: "stuff and things"
  };
  var chatApp = new StompChat();
  this.stomper.subscriptions["/queue/tests"](message);
  this.stomper.subscriptions["/queue/tests"](message);

  const messageLen = chatApp.messages.length;
  assert.equal(messageLen, 2, '2 messages were received');
});


function StompChat() {
  const stompClient = Stomp.over(new SockJS('http://localhost:8080/websocket'));
  this.messages = [];

  stompClient.subscribe("/queue/tests", message => {
    this.messages.push(message.body);
  });
}

test('#subscribe, mocking stomp channel, for json', function(assert){
  var message = {
    body: `{ "content" :  "stuff and things"}`
  };
  var expectedContent  = { "content" :  "stuff and things" };

  var chatApp = new StompJSONChat();
  this.stomper.subscriptions["/queue/tests"](message);
 
  const messageLen = chatApp.messages.length;
  assert.equal(messageLen, 1, '1 messages where sent from the server');
  const actualContent = chatApp.messages[0];  
  assert.equal(expectedContent.content, actualContent.content, 'messages should match, stomp only sends text NOT JSON');
});


function StompJSONChat() {
  const stompClient = Stomp.over(new SockJS('http://localhost:8080/websocket'));
  this.messages = [];

  stompClient.subscribe("/queue/tests", message => {
    var obj = JSON.parse(message.body);
    this.messages.push(obj);
  });
}

