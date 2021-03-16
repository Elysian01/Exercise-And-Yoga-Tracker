var model;
var yoga_set;
var labels;
var latest_prediction_array = [0, 0, 0, 1, 0, 1, 2, 1, 2, 1]; // size of 10
var pred_index;

const yoga_set1_model_path = "../static/models/Yoga_Set1_Tfjs/model.json"
const yoga_set2_model_path = "../static/models/Yoga_Set2_Tfjs/model.json"

const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButton');
const predResult = document.getElementById("prediction");

const prediction_threshold = 0.6;

const set1_labels = { 0: "Downward Dog", 1: "Tree", 2: "Warrior 1" }
const set2_labels = { 0: "Goddess", 1: "Mountain", 2: "Warrior 2" }

const set1_cautions = { 0: "", 1: "", 2: "" }
const set2_cautions = { 0: "", 1: "", 2: "" }


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
    // Only continue if the model has finished loading.
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
const majorityElement = (arr = []) => {
    const threshold = Math.floor(arr.length / 2);
    const map = {};
    for (let i = 0; i < arr.length; i++) {
        const value = arr[i];
        map[value] = map[value] + 1 || 1;
        if (map[value] >= threshold || map[value] >= threshold - 1)
            return value
    };
    return false;
};

// for stability among prediction, i.e. to handle incorrect prediction in between and keep the label as same
function addNewELementInFixedSizeArray(latest_prediction_array, element) {
    latest_prediction_array.splice(0, 1) // remove first element from array
    latest_prediction_array.push(element)
    return latest_prediction_array
}

function getPriorityInArray(latest_prediction_array, actual_predicted_value) {
    sub_array = latest_prediction_array.slice(4, 10); // last 6 values in array
    found_most_occuring_predicted_value = majorityElement(sub_array);
    if (actual_predicted_value !== found_most_occuring_predicted_value) {
        predResult.innerHTML = labels[pred_index];
        changeData(pred_index);
    }
}


async function predictWebcam() {

    let tensorImg = tf.browser.fromPixels(video).resizeNearestNeighbor([300, 300]).toFloat().expandDims();
    prediction = await model.predict(tensorImg).data();
    console.log(prediction)
    pred_index = prediction.indexOf(Math.max(...prediction));

    addNewELementInFixedSizeArray(latest_prediction_array, pred_index);

    if (pred_index === 0 && prediction[pred_index] > prediction_threshold) {
        getPriorityInArray(latest_prediction_array, pred_index)

    } else if (pred_index === 1 && prediction[pred_index] > prediction_threshold) {
        getPriorityInArray(latest_prediction_array, pred_index)

    } else if (pred_index === 2 && prediction[pred_index] > prediction_threshold) {
        getPriorityInArray(latest_prediction_array, pred_index)
    }

    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);

}

async function initialize(yoga_set = "1") {
    if (yoga_set === "1") {
        labels = set1_labels
        yoga_model_path = yoga_set1_model_path
    } else if (yoga_set === "2") {
        labels = set2_labels
        yoga_model_path = yoga_set2_model_path
    }
    model = await tf.loadLayersModel(yoga_model_path);

    if (model) {
        console.log("Model Loaded " + yoga_set + "...")
        $(".loader-wrapper").fadeOut("slow");
    }
}

demosSection.classList.remove('invisible');

function loadmodel() {
    yoga_set = sessionStorage.getItem("yogaSet");
    initialize(yoga_set)


    //load table data
    if ('excerciseDuration' in sessionStorage) {
        var y = sessionStorage.getItem('excerciseDuration');
        y = JSON.parse(y);
        y.forEach((item, index) => {
            y[index] = JSON.parse(item);
        });

        y.forEach((item, index) => {
            $(".table").find('tbody').append(`<tr><td>${Object.keys(item)}</td><td>${Object.values(item)}</td></tr>`);
        });
    }
}