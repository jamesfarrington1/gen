var weatherData;
var url ="https://api.openweathermap.org/data/2.5/weather?q=";
// Get an API key from https://openweathermap.org/ and replace [YOUR_API_KEY] below
var apiKey ="&appid=[yourAPIkey]&units=metric";
var button;
var input;

function setup(){
    createCanvas(windowWidth, windowHeight);

    input = createInput('London');
    input.position(10, 10);
    input.addClass('weather-input');

    button = createButton('submit');
    button.position(10, 50);
    button.mousePressed(functionY);
    button.addClass('weather-button');
}

function functionX(data) {
    weatherData = data;
    console.log(weatherData);
}

function functionY() {
    loadJSON(url + input.value() + apiKey, functionX, 'jsonp');
}

function draw(){
    background(0);

    if (weatherData) {
        let x = width / 2;
        let y = height / 2;
        let temp = weatherData.main.temp;
        let size = temp * 10;

        fill(255);
        noStroke();
        circle(x, y, size);

        fill(255);
        textAlign(CENTER, TOP);
        textSize(24);
        text(nf(temp, 1, 1) + "°C", x, y + size / 2 + 20);
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}