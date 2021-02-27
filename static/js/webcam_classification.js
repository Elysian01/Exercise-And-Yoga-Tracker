var model = true;

const yoga_set1_model_path = "../static/models/Yoga_Set1_Tfjs/model.json"
const yoga_set2_model_path = "../static/models/Yoga_Set2_Tfjs/model.json"

const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButton');

// Check if webcam access is supported.
function getUserMediaSupported() {
    return !!(navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it to call enableCam function which we will 
// define in the next step.
if (getUserMediaSupported()) {
    enableWebcamButton.addEventListener('click', enableCam);
} else {
    console.warn('getUserMedia() is not supported by your browser');
}

// Enable the live webcam view and start classification.
function enableCam(event) {
    // Only continue if the COCO-SSD has finished loading.
    if (!model) {
        return;
    }

    // Hide the button once clicked.
    event.target.classList.add('removed');

    // getUsermedia parameters to force video but not audio.
    const constraints = {
        video: true
    };

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        video.srcObject = stream;
        video.addEventListener('loadeddata', predictWebcam);
    });
}

var children = [];

async function predictWebcam() {

    let tensorImg = tf.browser.fromPixels(video).resizeNearestNeighbor([300, 300]).toFloat().expandDims();
    prediction = await model.predict(tensorImg).data();
    console.log(prediction)
    let pred_index = prediction.indexOf(Math.max(...prediction));

    pre_text = "I think it's a "
    if (pred_index === 0) {
        result = "Downward Dog pose"
            // predResult.innerHTML = pre_text + result;
        console.log()

    } else if (pred_index === 1) {
        result = "Tree Pose"
            // predResult.innerHTML = pre_text + result;

    } else {
        result = "Warrior 1 Pose"
            // predResult.innerHTML = pre_text + result;
    }
    console.log(pre_text + result)

    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);

    // Now let's start classifying a frame in the stream.
    // model.detect(video).then(function(predictions) {
    //     // Remove any highlighting we did previous frame.
    //     for (let i = 0; i < children.length; i++) {
    //         liveView.removeChild(children[i]);
    //     }
    //     console.log(predictions)
    // children.splice(0);

    // Now lets loop through predictions and draw them to the live view if
    // they have a high confidence score.
    // for (let n = 0; n < predictions.length; n++) {
    //   // If we are over 66% sure we are sure we classified it right, draw it!
    //   if (predictions[n].score > 0.66) {
    //     const p = document.createElement('p');
    //     p.innerText = predictions[n].class  + ' - with ' 
    //         + Math.round(parseFloat(predictions[n].score) * 100) 
    //         + '% confidence.';
    //     p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
    //         + (predictions[n].bbox[1] - 10) + 'px; width: ' 
    //         + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

    //     const highlighter = document.createElement('div');
    //     highlighter.setAttribute('class', 'highlighter');
    //     highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
    //         + predictions[n].bbox[1] + 'px; width: ' 
    //         + predictions[n].bbox[2] + 'px; height: '
    //         + predictions[n].bbox[3] + 'px;';

    //     liveView.appendChild(highlighter);
    //     liveView.appendChild(p);
    //     children.push(highlighter);
    //     children.push(p);
    //   }
    // }

    // Call this function again to keep predicting when the browser is ready.
    //         window.requestAnimationFrame(predictWebcam);
    //     });
}

async function initialize() {
    model = await tf.loadLayersModel(yoga_set1_model_path);
    if (model)
        console.log("Model Loaded ...")
}
demosSection.classList.remove('invisible');

function loadmodel() {
    initialize()
}