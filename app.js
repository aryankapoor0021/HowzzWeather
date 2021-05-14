const express=require('express');

const https=require('https');

const bodyParser=require('body-parser');

const config=require('./config.js');

const app=express();

const port=process.env.PORT || 3000;

var path=require('path');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/",function(req,res){
 res.sendFile(__dirname+"/index.html");
})

app.post("/Result",function(req,res) {
   console.log(req.body.cityName);

  const city=req.body.cityName;
  const unit="metric";
  const apiId=config.apikey;
  var url="https://api.openweathermap.org/data/2.5/weather?q=" +city+ "&appid=" +apiId + "&units="+unit;

  https.get(url,function(response){

  	response.on("data",function(data){
  		const weatherData=JSON.parse(data);
  		const temprature=weatherData.main.temp;
  		const weatherDescription=weatherData.weather[0].description;
  		const icon=weatherData.weather[0].icon;
  		const imgurl="http://openweathermap.org/img/wn/" + icon + "@2x.png";
  		console.log(weatherDescription);
      console.log(temprature);
      res.render("output",{source:imgurl,city:city,tempR:temprature});
  	});
  });
  
 app.post('/back',function(req,res) {
   res.redirect("/");  
 });

});

app.listen(port,function(){
	console.log("Server Started at 3000");
});

