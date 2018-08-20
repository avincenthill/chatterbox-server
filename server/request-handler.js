/*************************************************************

You should implement your request handler function in this file.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

//import memory array
const memory = require('./memory');

var requestHandler = function(request, response) {
  console.log('Request received!');

  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log(
    'Serving request type ' + request.method + ' for url ' + request.url
  );

  // These headers will allow Cross-Origin Resource Sharing (CORS).
  // This code allows this server to talk to websites that
  // are on different domains, for instance, your chat client.
  //
  // Your chat client is running from a url like file://your/chat/client/index.html,
  // which is considered a different domain.
  //
  // Another way to get around this restriction is to serve you chat
  // client from this domain by setting up static file serving.
  var defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
  };
  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them json
  headers['Content-Type'] = 'json';

  const responseData = JSON.stringify({
    msg: 'Hello, World!',
    results: []
  });

  //Should answer GET requests for /classes/messages with a 200 status code
  if (request.method === 'GET' && request.url.includes('/classes/messages')) {
    console.log('GET request received to classes/messages!');
    // The outgoing status.
    var statusCode = 200;
  } else if (
    request.method === 'POST' &&
    request.url.includes('/classes/messages')
  ) {
    //Should answer POST requests for /classes/messages with a 200 status code
    //add messages to memory
    //respond with messages that were previously posted
    statusCode = 201;
    memory.push(request);
    console.log(memory.length);
    console.log('POST request received to classes/messages!');
  } else {
    //everything that isn't classes/messages is 404
    statusCode = 404;
  }

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  response.end(responseData);
};

//export requestHandler
module.exports = requestHandler;
