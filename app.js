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

  var today=new Date();
  
  var options={
    weekday:"long",
    day:"numeric",
    month:"long"
  }
  var day=today.toLocaleDateString("en-IN",options);

  

  res.render("index",{date:day});
})

app.post("/Result",function(req,res) {
   console.log(req.body.cityName);

  const city=req.body.cityName;
  const unit="metric";
  const apiId=config.apikey;

  var today=new Date();
  
  var time="";
  setInterval(
  () => time=new Date().toLocaleTimeString(),
  1000
   );
  console.log(time);
  var options={
    weekday:"long",
    day:"numeric",
    month:"long"
  }
  var day=today.toLocaleDateString("en-IN",options);

  var url="https://api.openweathermap.org/data/2.5/weather?q=" +city+ "&appid=" +apiId + "&units="+unit;

  https.get(url,function(response){

  	response.on("data",function(data){
  		const weatherData=JSON.parse(data);
  		const temprature=weatherData.main.temp;
  		var weatherDescription=weatherData.weather[0].description;
  		const icon=weatherData.weather[0].icon;
      const mintemp=weatherData.main.temp_min;
      const maxtemp=weatherData.main.temp_max;
      const feeltemp=weatherData.main.feels_like;
      const humidity=weatherData.main.humidity;
      const windspeed=weatherData.wind.speed;
      weatherDescription=capitalize(weatherDescription);
      const winddeg=weatherData.wind.deg;
  		const imgurl="http://openweathermap.org/img/wn/" + icon + "@2x.png";
  		console.log(weatherDescription);
      console.log(temprature);

      res.render("output",{time:time,date:day,source:imgurl,city:city,tempR:temprature,mintemp:mintemp,maxtemp:maxtemp,feeltemp:feeltemp,weatherDescription:weatherDescription,humidity:humidity,windspeed:windspeed,winddeg:winddeg});
  	});
  });
  
 app.post('/back',function(req,res) {
   res.redirect("/");  
 });

});
// function clock(){
//   var today=new Date();
//   var hours=today.getHours()>10?today.getHours():"0"+today.getHours();
//   var minutes=today.getMinutes()>10?today.getMinutes():"0"+today.getMinutes();
//   var seconds=today.getSeconds()>10?today.getSeconds():"0"+today.getSeconds();
//   var time = hours + ":" + minutes + ":" + seconds;
// }
function capitalize(input) {  
    var words = input.split(' ');  
    var CapitalizedWords = [];  
    words.forEach(element => {  
        CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));  
    });  
    return CapitalizedWords.join(' ');  
}  
app.listen(port,function(){
	console.log("Server Started at 3000");
});

