import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import SockJSClient from 'sockjs';
import Stomp from 'stompjs';


moduleForAcceptance('Acceptance | basic');

test('visiting /', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');
  });
});

test('importing stuff', function(assert){
  assert.ok(SockJSClient, 'sockjs client should exist');
  assert.ok(Stomp, 'stomp should exist');
});