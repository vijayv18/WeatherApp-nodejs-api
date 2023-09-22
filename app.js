require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname+"/index.html");
});

app.post("/", function(req, res) {
    console.log("Post request successful");
    const query = req.body.cityName;
    const appKey = process.env.APP_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ appKey +"&units=" + unit;
    https.get(url, function(response) {
        response.on('data', function(d) {
            const weatherData = JSON.parse(d);
            const temp = weatherData.main.temp;
            const desc = weatherData.weather[0].description;
            const icon = "https://openweathermap.org/img/wn/"+ weatherData.weather[0].icon + "@2x.png";
            
            res.write("<body style='background-color:gray;'>")
            res.write("<h1>The temperature in "+ query + " is "+ temp +" degree Celsius.</h1>");
            res.write("<h2>Weather description: "+ desc +".</h2>")
            res.write("<img src="+icon+">")
            res.write("</body>");
            res.send();
        });
    })
});


app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
});