define('mock-socket', [], function() {
  "use strict";

  return {
    'default': MockServer,
    'MockWebSocket': MockWebSocket
  };
});