const db = require('./db')
let huejay = require('huejay');

let client;
const authentication = {
  status: 'pending',
  isAuthenticated: false
}

function authenticate() {

  client = new huejay.Client({
    host: db.get('hue').value().host,
    port: 80,
    username: db.get('hue').value().username,
    timeout: 15000
  });

}

authenticate();

client.bridge.isAuthenticated()
  .then(() => {
    authentication.status = 'success';
    authentication.isAuthenticated = true;
  })
  .catch(error => {
    authentication.status = 'error';
    authentication.isAuthenticated = false;
  });

function createUser(ip) {

  client = new huejay.Client({
    host: ip,
    port: 80,
    timeout: 15000
  });

  let user = new client.users.User;

  user.deviceType = 'hellohue';

  return client.users.create(user);
}

module.exports = {
  client,
  authentication,
  authenticate,
  createUser
}