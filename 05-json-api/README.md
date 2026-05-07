# Working with Data
In this workshop, we will go through how we can use a quantity of data for your p5.js project. It includes two components: 1) JSON (how to write, read, embed the data in p5.js project), 2) API (how to pull data written by someone into your program). 

*In this README, examples cover the /javascript demo. See the /p5js folder for the p5.js version.

### Data visualization examples
- [Weather gradient](http://weathergradient.com/)
- [Why Buses Bunch](https://setosa.io/bus/)
- [Mapping 24 Emotions Conveyed by Brief Human Vocalization](https://s3-us-west-1.amazonaws.com/vocs/map.html)
- [Browsing Histories](https://labs.rs/en/browsing-histories/)

## Data formats
There are a few data formats that are standardized for computer to read. 

### JSON 
- *JavaScript Object Notation*.
- Widely used for storing, serializing, and transmitting structured data.
- A string of data 
- More read 👉 [Mozilla: Working with JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON)

### CSV
- *Comma-separaated Values*. 
- Represents tabular data: a form of table in which values for each column of the table are separated by commas.
- Simple and light-weight, used to handle a huge amounts of data.
- Easy to use in a Spreadsheet Program.

### XML
- *eXtensible Markup Language*
- markup language without no predefined tags.
- simple text-based format for representing structured information: documents, data, configuration, books, transactions, invoices, and much more

### Other filetype 
- text file, PDF, etc



## JSON 

### Syntax

Basic JSON file is a **string** like the following, with the quotations around the brackets.

```js
{
    "name" : "mycolor",
    "r": 255,
    "g": 0,
    "b": 0
}
```
All property names have to be surrounded by double quotes, and only simple data expressions are allowed. No function calls, bindings, or anything that involves actual computation. Comments are not allowed in JSON.

JSON can have more than one object, and also lets you create nested arrays.
```js
{
  "myshape" [
      { "shape": "circle", 
        "r": 0,
        "g": 255,
        "b": 0 
      },
      { "shape": "square", 
        "r": 255,
        "g": 0,
        "b": 0 
      }
  ]
}
```

### Data path
To use JSON data for your project, we need to figure out a path to get into this JSON objects. In order to access any of the values, we will use dot notation that looks like below. The variable name is first, followed by a dot, followed by the key to be accessed.
```js
  [variable name].r //255
  [variable name].g //0
  [variable name].b //0
```

#### Accessing Array items
If the property name is an array, use the number of index we are looking for. The order of an item in an array is called an index. Think of it as a numerical label. The position number starts at 0 (not 1.). In JS, we can call that item in the array within the context of dot notation like below:
```js
  [variable name].myshape[0].r //0
  [variable name].myshape[1].shape //square
```


## How to use JSON data in your p5.js project

### Internal

If your JSON data is short enough, you can directly define it inside your JavaScript file as an object.

```js
let color = {
  name: "mycolor",
  r: 255,
  g: 0,
  b: 0
};

const box = document.getElementById("box");
const label = document.getElementById("label");

// apply color to a visual element
box.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;

// display text
label.textContent = color.name;
```
```HTML 
<div id="box" style="width:200px; height:200px;"></div>
<p id="label"></p>
```

### External
JSON can be easily builky and complex to load a length of data. In this case, JSON can be loaded into your project as a stand alone file. The difference is, there is no variable in this file. It is just an object that starts with the curly brackets.  
```js
 {
    "name" : "mycolor",
    "r": 255,
    "g": 0,
    "b": 0
}
```



#### Preload
Load the JSON file first, wait until it finishes loading, and then use the data in your JavaScript.

⚠️ Because this method uses fetch(), you need to run your project on a local server when testing in your browser. 
1. Open Terminal
2. Navigate to your project folder (Or drag and drop the folder to the terminal):

```
cd path/to/your/project
```

3. Run a local server using Python by running the following command in Terminal:

```
python3 -m http.server
```

4. Open your browser and go to:

```
http://localhost:8000
```

To stop the server, press `Control` + `C` in Terminal. You can also use other local server tools such as Live Server or MAMP. 

```js
let color;

async function loadData() {
  const response = await fetch('./common/color.json');
  color = await response.json();

  const box = document.getElementById("box");
  const label = document.getElementById("label");

  box.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
  label.textContent = color.name;
}

loadData();
```
```HTML 
<div id="box" style="width:200px; height:200px;"></div>
<p id="label"></p>
```

#### Callback
In addition to preloading, you can use a callback function. This is useful when you want to load data over time and run code once the data has finished loading.

Basic structure:
```js
let weatherData;

function getData() {
  fetch("https://api.openweathermap.org/data/2.5/group?id=5224151,5128581,1723862&units=metric&appid=[yourAPIKey]")
    .then(response => response.json())
    .then(gotData);
}

// callback function
function gotData(data) {
  weatherData = data;
  console.log(weatherData);
}

// call the function
getData();

```
```html
<button id="loadBtn">Load Data</button>
```

## API
Data is usually loaded as an external file or request it from an API. API stands for *Application Programming Interface*, it is a set of routines, protocols, and tools for building software applications. You can think API as a messenger that tells requests and tells a system what you want to do, and returns the response back.

### Query string
The question mark followed by the parameters and their values is referred to as the [query string]("https://en.wikipedia.org/wiki/Query_string"). It assigns a parameter of data by querying a specific condition. In the query string, each parameter is listed one right after the other with an ampersand (`&`) separating them. The order of the query string parameters does not matter. You can see examples here 👉[Open Weather Map API calls](https://openweathermap.org/current)

*To review JSON file on browser, [JSON formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en) plugin is useful.

More read 👉
- [Query String](https://en.wikipedia.org/wiki/Query_string)
- [Documenting APIs: Parameters](https://idratherbewriting.com/learnapidoc/docapis_doc_parameters.html#query_string_parameters)


### API Query with user input
Based on the query string, we can divide the api url into static url and variables, and then query the data with user interraction by using the variables. Below example shows how to change the output when user enters a data.

```js
  async function getWeather() {
  // Get the value typed into the input field (city name)
  let city = document.getElementById("cityInput").value;

  // Build the API request URL using the city and your API key
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=[YOUR_API_KEY]&units=metric`;

  try {
    // Send request to the API and wait for the response
    let res = await fetch(url);

    // Convert the response into a JavaScript object (JSON)
    let data = await res.json();

    // Check if the API returned an error (e.g., city not found)
    if (data.cod !== 200) {
      document.getElementById("output").innerHTML = "City not found";
      return; // stop the function early
    }

    // Extract specific values from the data using dot notation
    let temp = data.main.temp;
    let description = data.weather[0].description;

    // Map temperature to a visual property (font size)
    let size = 20 + temp * 2;

    // Display the result in the HTML
    // Template string (${ }) inserts values into the content
    document.getElementById("output").innerHTML = `
      <h2>${data.name}</h2>
      <p style="font-size:${size}px">${temp.toFixed(1)}°C</p>
      <p>${description}</p>
    `;

  } catch (err) {
    // If something goes wrong (network error, etc.)
    document.getElementById("output").innerHTML = "Error loading data";

    // Log the actual error in the console for debugging
    console.error(err);
  }
}
```
```html 

  <input id="cityInput" placeholder="Enter city" />
  <button onclick="getWeather()">Submit</button>

  <div id="output" class="card"></div>
  ```






