const request = require('request');

const getChannelFromFile = () => {
  const fs = require('fs');
  // let rawdata1 = fs.readFileSync('./utils/users.json');
  // users = JSON.parse(rawdata1);
  //let rawdata2 = fs.readFileSync('./utils/channels.json');
  //channels = JSON.parse(rawdata2);
  let rawdata = fs.readFileSync('./utils/orgas.json');
  orgas = JSON.parse(rawdata);
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

const getInfoForUser = async (orgaIndex, channelIndex) => {
  var channel = Object.values(orgas)[orgaIndex][channelIndex];
  if (!channel) ++orgaIndex, channelIndex = 0;
  var organisation = Object.keys(orgas)[orgaIndex];
  if (!organisation) orgaIndex = 0, channelIndex = 0;
  organisation = Object.keys(orgas)[orgaIndex];
  channel = Object.values(orgas)[orgaIndex][channelIndex];
  try {
    let res = await channelIDfromUser(channel.channel);
    res = JSON.parse(res);
    if (res.users[0]) {
      let info = await channelStatusByUser(res.users[0]);
      sendInfoToUsers({
        info,
        channel,
        organisation
      });
    }
  } catch (error) {
    console.log("Error: " + error, channel)
  } finally {
    getInfoForUser(orgaIndex, ++channelIndex);
  }
  // if (!users[index]) index = 0;
  // try {
  //   let res = await channelIDfromUser(users[index].channel);
  //   res = JSON.parse(res);
  //   if (res.users[0]) {
  //     let result = await channelStatusByUser(res.users[0]);
  //     sendInfoToUsers(result);
  //   }
  // } catch (error) {
  //   console.log(error)
  // } finally {
  //   getInfoForUser(++index);
  // }
}

let UpdatedChannels = [];
let lastUpdated = new Date();

const sendInfoToUsers = ({
  info,
  channel,
  organisation
}) => {
  let stream = JSON.parse(info.body);
  return new Promise((resolve, reject) => {
    let pos = UpdatedChannels.findIndex(everythingAboutStream => everythingAboutStream.charInfo.channelName.toLowerCase() == info.user.name);
    if (pos == -1) {
      // pos = users.findIndex(user => user.channel.toLowerCase() == info.user.display_name.toLowerCase());
      UpdatedChannels.push({
        user: info.user,
        charInfo: {
          charName: channel.character,
          charOrga: organisation,
          channelName: channel.channel
        },
        stream: stream.stream,
        multiChar: []
      });
    } else {
      UpdatedChannels[pos].stream = stream.stream;
      if (channel.character == UpdatedChannels[pos].charInfo.charName) return;
      const posi = UpdatedChannels[pos].multiChar.findIndex(everythingAboutStream => everythingAboutStream.charName == channel.character);
      if (posi != -1) return
      UpdatedChannels[pos].multiChar.push({
        charName: channel.character,
        charOrga: organisation
      })
    }
    resolve();
  })
}
let channels = [];
let orgas = [];
let users = [];
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
  getInfoForUser(0, 0);
}