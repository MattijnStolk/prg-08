//Imports
import { createChart, updateChart, updateUserChart } from "./libraries/scatterplot.js";

//Globals
let nn;
let nnLoaded = false;

//HTML elements
let inputModel = document.getElementById('model')
let inputyear = document.getElementById('year')
let inputTrans = document.getElementById('transmission')
let inputMileAge = document.getElementById('mileAge')
let inputFuelType = document.getElementById('fuelType')
let inputEngineSize = document.getElementById('engineSize')
let submitButton = document.getElementById('submit')
let accuracyHTML = document.getElementById('accuracy')
let predictionHTML = document.getElementById('prediction')

//Listeners
submitButton.addEventListener("click", (e) => submitClickHandler(e))

// DATA
const csvFile = "./data/bmw.csv"

//Load cvs data as json
function loadData() {
  Papa.parse(csvFile, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: results => createNeuralNetwork(results.data)
  })
}

//to do 
//css opmaak

function createNeuralNetwork(data) {
  data.sort(() => Math.random() - 0.5);
  let trainData = data.slice(0, Math.floor(data.length * 0.95))
  let testData = data.slice(Math.floor(data.length * 0.95) + 1)

  showData(trainData)

  const options = {
    task: "regression",
    debug: false, //!!
    layers: [
      {
        type: 'dense',
        units: 16,
        activation: 'relu'
      },
      {
        type: 'dense',
        units: 16,
        activation: 'sigmoid'
      },
      {
        type: 'dense',
        activation: 'sigmoid'
      }
    ]
  }
  nn = ml5.neuralNetwork(options);

  for (let car of trainData) {
    if (car.model == null || car.model == undefined) return
    let inputs = {
      model: car.model,
      year: car.year,
      transmission: car.transmission,
      mileage: car.mileage,
      fuelType: car.fuelType,
      //tax: car.tax,
      //mpg: car.mpg,
      engineSize: car.engineSize
    }
    nn.addData(inputs, { price: car.price });
  }

  nn.normalizeData();
  nn.train({ epochs: 12 }, () => finishedTraining(testData));
}

function showData(data) {
  const columns = data.map((car) => (
    // console.log(car)
    {
      x: car.mileage,
      y: car.price,
    }
  ));

  // now call the create chart function
  createChart(columns);
}

async function finishedTraining(data) {
  console.log('finished training')

  let amountCorrect = 0;
  let colums = []
  // vergelijk de prediction met het echte label
  for (let i = 0; i < data.length; i++) {
    if (data[i].model == null) return

    let price = data[i].price;
    delete data[i].price

    let prediction = await nn.predict(data[i])
    colums.push({ x: data[i].mileage, y: prediction[0].price })

    if (price < prediction[0].price + 1000 && prediction[0].price - 1000 > price) {
      amountCorrect++
    }
  }

  updateChart("control data", colums);
  let accuracy = Math.floor((amountCorrect / data.length) * 100);

  accuracyHTML.innerHTML = 'Accuracy : ' + accuracy + '%';

  nnLoaded = true
}

async function submitClickHandler(e) {
  e.preventDefault()
  if (nnLoaded == false) { 
    //console.log(e.srcElement.parentElement)
    alert('please wait untill the model is loaded') 
  } else {
    const inputData = {
      model: inputModel.value,
      year: Number(inputyear.value),
      transmission: inputTrans.value,
      mileage: Number(inputMileAge.value),
      fuelType: inputFuelType.value,
      engineSize: Number(inputEngineSize.value)
    }

    let prediction = await nn.predict(inputData)

    console.log({x:inputMileAge.value , y:prediction[0].price})
    updateUserChart("prediction", {x:inputMileAge.value , y:prediction[0].price})

    predictionHTML.innerHTML = "Prediction = €" + Math.floor(prediction[0].price)+ ".-"
    predictionHTML.style.display = "block"
  }
}

window.addEventListener('load', loadData())