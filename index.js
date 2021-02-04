const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))


const http = require('http').createServer(app);
const io = require('socket.io')(http);
require('./utils/twitch')(io);

http.listen(PORT, () => console.log(`Listening on ${ PORT }`))