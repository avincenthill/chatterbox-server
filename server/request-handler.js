/*************************************************************

You should implement your request handler function in this file.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

//import memory array
const memory = require('./memory');
// import url library from node
const url = require('url');

let messageIndexCounter = 0;

const handler = {
  requestHandler: function(request, response) {
    console.log(
      'Serving request type ' + request.method + ' for url ' + request.url
    );
    var defaultCorsHeaders = {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'access-control-allow-headers': 'content-type, accept',
      'access-control-max-age': 10 // Seconds.
    };
    var headers = defaultCorsHeaders;

    // Tell the client we are sending them json
    headers['Content-Type'] = 'json';

    const responseData = JSON.stringify({
      results: memory
    });

    let statusCode;
    let address = url.parse(request.url);
    if (address.pathname === '/classes/messages') {
      if (request.method === 'GET') {
        statusCode = 200;
        if (address.search === '?order=-createdAt') {
          response.writeHead(statusCode, headers);
          reversedResults = JSON.stringify({
            results: memory.slice().reverse()
          });
          response.end(reversedResults);
        }
        response.writeHead(statusCode, headers);
        response.end(responseData);
      } else if (request.method === 'OPTIONS') {
        statusCode = 201;
        response.writeHead(statusCode, headers);
        response.end(null);
      } else if (request.method === 'POST') {
        statusCode = 201;
        let body = [];
        request
          //TBD research .on function
          .on('data', function(chunk) {
            body.push(chunk);
          })
          .on('end', function() {
            let message = JSON.parse(body);
            message.date = new Date();
            message.index = messageIndexCounter;
            messageIndexCounter++;
            if (body) {
              memory.push(message);
            }
            responseData.results = memory;
          });
        response.writeHead(statusCode, headers);
        response.end(responseData);
      }
    } else {
      statusCode = 404;
      console.log(
        'Poorly handled request or invalid endpoint 404 while serving request type ' +
          request.method +
          ' for url ' +
          request.url
      );
      response.writeHead(statusCode, headers);
      response.end(null);
    }
  }
};
//export requestHandler object
module.exports = handler;
