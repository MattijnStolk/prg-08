// Initialize the Image Classifier method with MobileNet
const classifier = ml5.imageClassifier('MobileNet', modelLoaded);

let model = false
let synth = window.speechSynthesis

// Initialize the elements on the HTML
const image = document.getElementById('output')
const fileButton = document.querySelector("#file")
const prediction = document.querySelector("#prediction")
const predictionDiv = document.querySelector("#prediction-div")

//Listen to changes on the image
fileButton.addEventListener("change", (event)=>loadFile(event))

function loadFile(event) {
    image.src = URL.createObjectURL(event.target.files[0])
    image.addEventListener('load', () => userImageUploaded())

    function userImageUploaded(){
        if (model == true) {
            console.log("The image is now visible in the DOM")

            classifier.classify(document.getElementById('output'), (err, results) => {
                console.log(results);
                predictionDiv.style.display = "block"
                prediction.innerHTML = results[0].label;
                speak(results[0].label)
            })
        }
    }
}

function modelLoaded(){
    model = true
    console.log('Model is loaded!')
}

function speak(text) {
    if (synth.speaking) {
        console.log('still speaking...')
        return
    }
    if (text !== '') {
        console.log(text)
        let utterThis = new SpeechSynthesisUtterance(text)
        synth.speak(utterThis)
    }
}


//