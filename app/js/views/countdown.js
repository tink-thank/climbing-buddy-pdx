
var target_date = new Date().getTime();

var hours; 
var minutes;
var seconds;
 
var countdown = document.getElementById("countdown");
 
setInterval(function () {
 
    var current_date = new Date().getTime();
    var seconds_left = (target_date - current_date) / 1000;
     
    minutes = parseInt(seconds_left / 60);
    seconds = parseInt(seconds_left % 60);
     
    countdown.innerHTML = hours + " : " + minutes + " : " + seconds;  
 
}, 1000);