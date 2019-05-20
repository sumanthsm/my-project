const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const json2csv = require('json2csv').parse;
var csvjson = require('csvjson');
var fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function convertAppDataToJson(){
    let csvData = [];
    var options = {
        delimiter: ',', // optional
        quote: '"' // optional
    };
    var file_data = fs.readFileSync('./data/appdata.csv', { encoding: 'utf8' });
    csvData = csvjson.toObject(file_data, options);
    return csvData;
}

function convertShortcutsDataToJson(){
    let csvData = [];
    var options = {
        delimiter: ',', // optional
        quote: '"' // optional
    };
    var file_data = fs.readFileSync('./data/shortcutsdata.csv', { encoding: 'utf8' });
    csvData = csvjson.toObject(file_data, options);
    return csvData;
}

app.get('/api/appdata', (req, res) => {
    const data = convertAppDataToJson();
    res.json(data);
});

app.get('/api/shortcutsdata', (req, res) => {
    const data = convertShortcutsDataToJson();
    res.json(data);
});

app.get('/api/appdata:name', (req, res) => {
    console.log(req.params, "params");
    
    let result = [];
    let appData = convertAppDataToJson();
    for (let i = 0; i < appData.length; i++) {
        let appName = appData[i]['appName'];
        if (appName.indexOf(req.params.name) > -1) {
            result.push(appData[i]);
        }
    }
    res.json(result);
});

app.post('/api/shortcutsdata', (req, res) => {
    const fields = ['appId', 'appAbrv', 'appName', 'appDesc', 'appUrl'];
    const opts = { fields };
    let appData = convertAppDataToJson();
    let shortcutsData = convertShortcutsDataToJson();
    const appName = req.body.appName;
    let flag = false;
    console.log(appName, "appName");
    
    
    for(let i = 0; i < shortcutsData.length; i++){
        if(shortcutsData[i].appName === appName){
            flag = true;
        }
    }

    if(flag) {
        res.json({ 'status' : 'fail', 'msg' : 'Data already exists'});
    } else {
        for(let i = 0; i < appData.length; i++){
            if(appData[i].appName === appName){
                shortcutsData.push(appData[i]);
            }
        }

        fs.writeFile("./data/shortcutsdata.csv", json2csv(shortcutsData, opts), function (err) {
            if (err) {
                throw err;
            }
        });
        res.json({'status': 'success', 'msg' : 'Data added successfully'});
    }
});

app.post('/api/deleteshortcut', (req, res) => {
    const fields = ['appId', 'appAbrv', 'appName', 'appDesc', 'appUrl'];
    const opts = { fields };
    let shortcutsData = convertShortcutsDataToJson();
    const appId = req.body.appId;
    const result = shortcutsData.filter((shortcut) => shortcut.appId !== appId);
    // for(let i = 0; i < shortcutsData.length; i++){
    //     if(shortcutsData[i].appId === appId){
    //         flag = true;
    //     }
    // }
    console.log(result, "result");
    
    fs.writeFile("./data/shortcutsdata.csv", json2csv(result, opts), function (err) {
        if (err) {
            throw err;
        }
    });
    res.json({'status': 'success', 'msg' : 'Shortcut deleted successfully'});
});

app.post('/api/createapp', (req, res) => {
    const fields = ['appId', 'appAbrv', 'appName', 'appDesc', 'appUrl'];
    const opts = { fields };
    let flag = 0;
    let appData = convertAppDataToJson();
    const newAppData = req.body.data;
    
    for(let i=0;i<appData.length;i++){
        if(appData[i]['appId'] === newAppData['appId']){
            console.log('if new app data');
            flag = 1;
            break;
        }
    }

    if(flag === 0){
        console.log("flag true");
        appData.push(newAppData);
        fs.writeFile("./data/appdata.csv", json2csv(appData, opts), function (err) {
            if (err) {
                throw err;
            }
        });
        res.json({'status': 'success'});
    }else{
        console.log("flag false");
        res.json({'status': 'fail'});
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`));