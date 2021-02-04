const request = require('request');

const getChannelFromFile = () => {
  const fs = require('fs');
  let rawdata = fs.readFileSync('./utils/channels.json');
  channels = JSON.parse(rawdata);
  channels.sort();
}


const channelIDfromUser = (user) => {
  var options = {
    url: `https://api.twitch.tv/kraken/users?login=${user}`,
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
};

const channelStatusByUser = (user) => {
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

const getInfoForUser = (index) => {
  if (!channels[index]) index = 0;
  channelIDfromUser(channels[index])
    .then(res => {
      res = JSON.parse(res);
      if (res.users[0]) {
        user = res.users[0];
        channelStatusByUser(user)
          .then(result => {
            sendInfoToUsers(result);
            getInfoForUser(++index);
          })
      }
    }).catch(err => console.log(err));
}

let UpdatedChannels = [];
let lastUpdated = new Date();

const sendInfoToUsers = (info) => {
  let stream = JSON.parse(info.body);
  return new Promise((resolve, reject) => {
    let pos = UpdatedChannels.findIndex(channel => channel.user.display_name == info.user.display_name);
    if (pos == -1) {
      UpdatedChannels.push({
        user: info.user,
        stream: stream.stream
      });
    } else
      UpdatedChannels[pos].stream = stream.stream;
    resolve();
  })
}

let channels = [];
let io;

getChannelFromFile();

setInterval(() => {
  lastUpdated = new Date();
  io.emit('data', {
    channels: UpdatedChannels,
    lastUpdated
  });
}, 2.5 * 60 * 1000);

module.exports = (IO) => {
  io = IO;
  io.on('connection', (socket) => {
    socket.emit('data', {
      channels: UpdatedChannels,
      lastUpdated
    });
  });
  getInfoForUser(0);
}
