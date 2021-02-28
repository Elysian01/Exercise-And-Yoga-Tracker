const yoga_set1_model_path = "../static/models/Yoga_Set1_Tfjs/model.json"
const yoga_set2_model_path = "../static/models/Yoga_Set2_Tfjs/model.json"

// Drag and drop image handling
var fileDrag = document.getElementById("file-drag");
var fileSelect = document.getElementById("file-upload");

// Add event listeners
fileDrag.addEventListener("dragover", fileDragHover, false);
fileDrag.addEventListener("dragleave", fileDragHover, false);
fileDrag.addEventListener("drop", fileSelectHandler, false);
fileSelect.addEventListener("change", fileSelectHandler, false);

function fileDragHover(e) {
    // prevent default behaviour
    e.preventDefault();
    e.stopPropagation();

    fileDrag.className = e.type === "dragover" ? "upload-box dragover" : "upload-box";
}

function fileSelectHandler(e) {
    // handle file selecting
    var files = e.target.files || e.dataTransfer.files;
    fileDragHover(e);
    for (var i = 0, f;
        (f = files[i]); i++) {
        previewFile(f);
    }
}

// Web page elements for functions to use
var imagePreview = document.getElementById("image-preview");
var imageDisplay = document.getElementById("image-display");
var uploadCaption = document.getElementById("upload-caption");
var predResult = document.getElementById("pred-result2");
var loader = document.getElementById("loader");
var model = undefined;

async function initialize() {
    model = await tf.loadLayersModel(yoga_set1_model_path);
    if (model)
        console.log("Model Loaded ...")
}

// Main button events
async function predict() {
    // action for the submit button
    if (!imageDisplay.src || !imageDisplay.src.startsWith("data")) {
        window.alert("Please select an image before submit.");
        return;
    }

    let tensorImg = tf.browser.fromPixels(imagePreview).resizeNearestNeighbor([300, 300]).toFloat().expandDims();
    prediction = await model.predict(tensorImg).data();

    let pred_index = prediction.indexOf(Math.max(...prediction));
    console.log()

    pre_text = "I think it's a "
    if (pred_index === 0) {
        result = "Downward Dog pose"
        predResult.innerHTML = pre_text + result;
        console.log()

    } else if (pred_index === 1) {
        result = "Tree Pose"
        predResult.innerHTML = pre_text + result;

    } else {
        result = "Warrior 1 Pose"
        predResult.innerHTML = pre_text + result;
    }
    console.log(pre_text + result)

    show(predResult)

    window.scrollBy(0, 300);

}

function clearImage() {
    // reset selected files
    fileSelect.value = "";

    // remove image sources and hide them
    imagePreview.src = "";
    imageDisplay.src = "";
    predResult.innerHTML = "";

    hide(imagePreview);
    hide(imageDisplay);
    hide(loader);
    hide(predResult);
    show(uploadCaption);

    imageDisplay.classList.remove("loading");
}

function previewFile(file) {
    // show the preview of the image
    var fileName = encodeURI(file.name);

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        imagePreview.src = URL.createObjectURL(file);

        // show(imagePreview);
        hide(uploadCaption);

        // reset
        predResult.innerHTML = "";
        imageDisplay.classList.remove("loading");

        displayImage(reader.result, "image-display");
    };
}

// Helper functions

function displayImage(image, id) {
    // display image on given id <img> element
    let display = document.getElementById(id);
    display.src = image;
    show(display);
}

function hide(el) {
    // hide an element
    el.classList.add("hidden");
}

function show(el) {
    // show an element
    el.classList.remove("hidden");
}


function loadmodel() {
    initialize()
}