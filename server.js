require('dotenv').config();
const ssc = require('./spreadsheet');
const Slack = require('slack-node');  // 슬랙 모듈 사용
const slackConnect = require('./slackConnect');

const slack = new Slack();
slack.setWebhook(process.env.WEBHOOK_URI);


// server.js
// const https = require("https");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`server is listening 3000`);
});

app.get("/", (req, res) => {
    res.send("hello!");
} )

const handlePost = async (req, res, next, workStatus, workPlace) => {
    // TODO : Slack 회신
    res.send('완료!');

    const {text} = req.body;
    const {user_id} = req.body;

    const userImg = await slackConnect.getUserImg(user_id);
    const userName = await slackConnect.getUserDisplayName(user_id);

    const nowTime = new Date();
    const timeRecorded = nowTime.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    let timeEdited;

    const regex = new RegExp(':');
    const containTime = regex.test(text);

    if(containTime){
        timeEdited = text;
    }
    else{
        const timeFormat = nowTime.toLocaleTimeString('ko-KR' ,{ hour12: false, hour: '2-digit', minute: '2-digit' });
        timeEdited = timeFormat;
    }
    
    const messageText = `*${userName}* | ${workPlace} ${workStatus} - ${timeEdited}`; 
    slackConnect.sendSlack(messageText, userName, userImg);

    ssc.authGoogleSheet(); 
    const payload = {
        user : userName,
        time_recorded : timeRecorded,
        work_status : workStatus,
        work_place : workPlace,
        time_edited : timeEdited
    };
    ssc.addSheetRow(payload);
}

/* POST */
app.post('/workin-office', function(req, res, next) {
    handlePost(req, res, next, "출근", "🏢사무실");
});

app.post('/workin-remote', function(req, res, next) {
    handlePost(req, res, next, "출근", "🏠리모트");
});

app.post('/workout-office', function(req, res, next) {
    handlePost(req, res, next, "퇴근", "🏢사무실");
});

app.post('/workout-remote', function(req, res, next) {
    handlePost(req, res, next, "퇴근", "🏠리모트");
});
