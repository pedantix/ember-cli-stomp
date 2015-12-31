import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import SockJSClient from 'sockjs';
import Stomp from 'stompjs';
import MockServer from 'mock-socket';
import { MockWebSocket } from 'mock-socket';

moduleForAcceptance('Acceptance | basic');

test('visiting /', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');
  });
});

test('importing stuff, this seems trivial but serves as a smoke test, that everything that is need is here', function(assert){
  assert.ok(SockJSClient, 'sockjs client should exist');
  assert.ok(Stomp, 'stomp should exist');
  assert.ok(MockServer, 'mock server should exist');
  assert.ok(MockWebSocket, 'mock socket should exist so we can test websockets');
});


test('should be able to mock a server', function(assert){
  //thanks thoov
  var mockServer = new MockServer("ws://localhost:8080");
  mockServer.on('connection', ()=>{
    mockServer.send('test message 1');
    mockServer.send('test message 2');
  });
  //
  window.WebSocket = MockWebSocket; 

  var chatApp = new Chat();

  andThen(() => {
    const messageLen = chatApp.messages.length;
    assert.equal(messageLen, 2, '2 messages where sent from the s server');
    mockServer.close();
  }, 500);
});



//smoke test borrowed from thoov
//establishing the basics are setup before doing the meaningful part of this addon
//aka stomp protocol
// chat.js
function Chat() {
  const chatSocket = new WebSocket('ws://localhost:8080');
  this.messages = [];

  chatSocket.onmessage = event => {
    this.messages.push(event.data);
  };
}
