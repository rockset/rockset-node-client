var apiKey = process.env.API_KEY;
var rockset = require('../lib/rockset')(apiKey);


var getResponseLogger = function (callback) {
  return function (error, response, body) {
      if (error) {
        console.log(error.response.error.text);
        callback();
      } else {
        console.log(response)
        callback();
      }
    }
}


function example1() {
  console.log('\n\n=== List Collections ===');
  rockset.collections.list(getResponseLogger(example2));
}


function example2() {
  console.log('\n\n=== Create a Collection ===');
  rockset.collections.create({
    'name': 'mycollection'
  }, getResponseLogger(example3))
}


function example3() {
  console.log('\n\n=== Delete the collection ===');
  rockset.collections.remove('mycollection', getResponseLogger(done));
}

function done() {
  console.log('\n\n=== done ===');
}


example1()
