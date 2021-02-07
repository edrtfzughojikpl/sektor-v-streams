const cluster = require('cluster');
if (cluster.isMaster) {
  cluster.fork();

  cluster.on('exit', (worker) => {
    console.log('Worker ' + worker.id + ' died..');
    cluster.fork();
  });
} else {
  const express = require('express')
  const path = require('path')
  const PORT = process.env.PORT || 5000

  const app = express()
    .use(express.static(path.join(__dirname, 'public')))
    .use('/favicon.ico', express.static(path.join(__dirname, 'public', 'images', 'favicon.ico')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))


  const http = require('http').createServer(app);
  const io = require('socket.io')(http);
  require('./utils/twitch')(io);

  http.listen(PORT, () => console.log(`Listening on ${ PORT }`));

  process.on('uncaughtException', () => {
    console.log(err);  
    process.exit(1);
  })
}