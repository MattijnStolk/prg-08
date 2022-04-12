import { createChart, updateChart } from "./libraries/scatterplot.js";

let nn;

// DATA
const csvFile = "./data/bmw.csv"

//HTML elements
let accuracyHTML = document.getElementById("accuracy")

// laad csv data als json
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => createNeuralNetwork(results.data)
    })
}

function createNeuralNetwork(data) {
    data.sort(() => Math.random() - 0.5);
    let trainData = data.slice(0, Math.floor(data.length * 0.95))
    let testData = data.slice(Math.floor(data.length * 0.95) + 1)

    console.log(trainData.length)

    showData(trainData)

    const options = {
        task: "regression", 
        debug: true,
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
            mpg: car.mpg,
            engineSize: car.engineSize
        }
        nn.addData(inputs, { price: car.price });
    }

    nn.normalizeData();
    nn.train({ epochs: 12 }, () => finishedTraining(testData));
}

function showData(data){
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
    let amountCorrect = 0;
    let colums = []
    // vergelijk de prediction met het echte label
    for (let i = 0; i < data.length; i++) {
        if (data[i].model == null) return

        let price = data[i].price;
        delete data[i].price

        let prediction = await nn.predict(data[i])
        //empArray.push({ x: hp, y: results[0].mpg });
        colums.push({x: data[i].mileage, y: prediction[0].price})

        console.log(Math.floor(prediction[0].price))
        if (price < prediction[0].price + 750 &&  prediction[0].price - 750 > price ) {
            amountCorrect++
        }
    }

    console.log(amountCorrect)
    console.log(colums)
    updateChart("prediction", colums);
    let accuracy = (amountCorrect / data.length)*100;

    accuracyHTML.innerHTML = 'Accuracy : ' + accuracy + '%';

    console.log(accuracy) 
}


window.addEventListener('load', loadData())