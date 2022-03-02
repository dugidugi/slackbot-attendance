const { App } = require('@slack/bolt');
require('dotenv').config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
  });
  
const sendSlack = async(text, name, iconImg) => {
  await app.client.chat.postMessage({
    channel: process.env.SLACK_SEND_CHANNEL,
    text: `${text}`,
    username : `${name}`,
    icon_url : `${iconImg}`,
  })
};


// userImg가져오기 
const getUserImg = async(userId) => {
  const resp = await app.client.users.info({
    user:userId
  })

  // console.log(resp);
  return resp.user.profile.image_512;
};

const getUserDisplayName = async(userId) => {
  const resp = await app.client.users.info({
    user:userId
  })

  return resp.user.profile.display_name;
};


module.exports = {sendSlack, getUserImg, getUserDisplayName};
