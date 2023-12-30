const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');

server.use(jsonServer.defaults({ cors: true })); // Enable CORS
server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});
