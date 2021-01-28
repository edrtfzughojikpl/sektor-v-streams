const request = require('request');

const getChannelIDbyUser = (username) => {
  var options = {
    url: `https://api.twitch.tv/kraken/users?login=${username}`,
    headers: {
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': 'kuslq3yf8rm8kcr8rwsmg9aslhhxzi'
    }
  };
  return new Promise((res, rej) => {
    request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        res(body);
      } else {
        rej(error);
      }
    });
  })
}

const getChannelStatusByID = (user) => {
  var options = {
    url: `https://api.twitch.tv/kraken/streams/${user._id}`,
    headers: {
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': 'kuslq3yf8rm8kcr8rwsmg9aslhhxzi'
    }
  };
  return new Promise((res, rej) => {
    request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        res({
          user,
          body
        });
      } else {
        rej(error);
      }
    });
  })
}

const findChannelActivity = (username) => new Promise((resolve, reject) => {
  getChannelIDbyUser(username)
    .then(body => {
      let json = JSON.parse(body);
      getChannelStatusByID(json.users[0]).then(({
        user,
        body
      }) => {
        resolve({
          user,
          body
        });
      })
    }).catch(error => reject(error));
});

/*;*/


let channels = [];
let currentData = [];

const getDataForKnownChannels = (callback) => {
  currentData = [];
  for (let i = 0; i < channels.length; i++) {
    findChannelActivity(channels[i].username).then(({
      user,
      body
    }) => {
      let stream = JSON.parse(body);
      channels[i].offline = (stream.stream)?stream.stream.channel.profile_banner:(!channels[i].offline)?null:channels[i].offline;
      currentData.push({
        user,
        stream,
        data: channels[i]
      });
      if(i == channels.length-1) callback();
    })
  }
}

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 5000;

const fs = require('fs');

const getChannelFromFile = () => {
  let rawdata = fs.readFileSync('channels.json');
  channels = JSON.parse(rawdata);
}

const updateChannelsOffline = () => {
  let data = JSON.stringify(channels);
  fs.writeFileSync('channels.json', data);
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.emit('some event', {
    streams: currentData
  });
});

setInterval(() => {
  getDataForKnownChannels(() => {
    updateChannelsOffline();
    console.log(currentData.length);
    io.emit('some event', {
      streams: currentData
    });
    console.log("Sending New Fetch");
  });
}, 1 * 60 * 1000);

http.listen(PORT, () => {
  getChannelFromFile();
  getDataForKnownChannels(()=>{
    updateChannelsOffline();
    console.log(`Listening on ${ PORT }`);
  });
});