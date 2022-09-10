const { json } = require('body-parser');
const express = require('express');
const fs = require('fs');
const { request } = require('http');
const app = express();
require('dotenv').config()

app.listen(process.env.PORT, () => console.log("Listening to port 3000..."));
app.use(express.static('public'));
app.use(express.json({limit: "1mb"}));

var data = JSON.parse(fs.readFileSync('private/data.json'));

var foodList = JSON.parse(fs.readFileSync('public/food.json'));

app.get('/food/menu', (req, res) => {
    res.json(foodList);
})

function AddPoint(type){
    switch (type) {
        case "food":
            if (data.FoodStat === 3){
                return false;
            }
            data.FoodStat = data.FoodStat + 1;
            break;
        case "water":
            if (data.WaterStat === 3){
                return false;
            }
            data.WaterStat = data.WaterStat + 1;
            break;
        case "sleep":
            if (data.SleepStat === 3){
                return false;
            }
            data.SleepStat = data.SleepStat + 1;
            break;
    }
    fs.writeFile('private/data.json', JSON.stringify(data, 2), () => {});
    return true;
}

app.post("/food/feed", (req, res) => {
    res.json(AddPoint(req.body.type));
})

app.get("/stats", (req, res) => {
    res.json(data);
})

function ResetPoints(){
    if (data.FoodStat === 3 && data.WaterStat === 3 && data.SleepStat === 3){
        data.FoodStat = 0;
        data.WaterStat = 0;
        data.SleepStat = 0;

        fs.writeFile('private/data.json', JSON.stringify(data, 2), () => {});
    }
}

app.post("/leave", (req, res) => {
    ResetPoints();
})