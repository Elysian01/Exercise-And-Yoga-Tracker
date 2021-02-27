import io
from array import array
import PIL.Image as Image
import numpy as np
import tensorflow as tf

import cv2
import os
import base64
import flask
import urllib.request
from flask import Flask, flash, request, redirect, url_for, render_template
# from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'static/uploads/'

app = Flask(__name__)
app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

DOWNLOAD_DIRECTORY = "./recieved_images/"
ALLOWED_EXTENSIONS = set(['jpg', 'jpeg'])


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def decode_base64_function(base64_message):
    return base64.b64decode(base64_message)


def predict_yoga_pose(img_path, model_path, labels_dict):

    image = Image.open(img_path)
    image = image.resize((300, 300))
    img_array = np.asarray(image)
    # print(img_array/255)
    img_array = np.expand_dims(img_array, axis=0)

    loaded_model = tf.keras.models.load_model(model_path)
    images = np.vstack([img_array])
    classes = loaded_model.predict(images, batch_size=10)
    print("Class Predictions: ", classes)
    pred_index = np.argmax(classes[0])
    print("\nPrediction is: ", labels_dict[pred_index])
    return [labels_dict[pred_index], classes[0].tolist()[pred_index]]


@app.route('/classify')
def upload_form():
    return render_template('upload.html')


# @app.route('/classify', methods=['GET', 'POST'])
# def classification_page():

#     return render_template("upload.html")


@app.route('/classify', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)

    file = request.files['file']

    if file.filename == '':
        flash('No image selected for uploading')
        return redirect(request.url)

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        #print('upload_image filename: ' + filename)
        flash('Image successfully uploaded and displayed below')
        return render_template('upload.html', filename=filename)
    else:
        flash('Allowed image types are -> png, jpg, jpeg, gif')
        return redirect(request.url)


@app.route('/classify/display/<filename>')
def display_image(filename):
    print('display_image filename: ' + filename)
    file_path = UPLOAD_FOLDER + filename
    set_id = 1
    if set_id == 1:
        model_path = './final_models/H5_files/Yoga_Set1.h5'
        yoga_labels = {0: "downdog", 1: "tree", 2: "warrior1"}
    else:
        model_path = './final_models/H5_files/Yoga_Set2.h5'
        yoga_labels = {0: "goddess", 1: "mountain", 2: "warrior2"}
    pred_list = predict_yoga_pose(file_path, model_path, yoga_labels)
    pose_name = pred_list[0].title() + "Pose"
    pose_accuracy = pred_list[1]
    print(pose_name)
    print(pose_accuracy)
    print("\n\n")
    return redirect(url_for('static', filename='uploads/' + filename), code=301)


# @app.route('/classify/predict/<filename>', methods=["POST"])
# def predict_results(filename):
#     print('display_image filename: ' + filename)
#     file_path = UPLOAD_FOLDER + filename
#     set_id = 1
#     if set_id == 1:
#         model_path = './final_models/H5_files/Yoga_Set1.h5'
#         yoga_labels = {0: "downdog", 1: "tree", 2: "warrior1"}
#     else:
#         model_path = './final_models/H5_files/Yoga_Set2.h5'
#         yoga_labels = {0: "goddess", 1: "mountain", 2: "warrior2"}

#     pred_list = predict_yoga_pose(file_path, model_path, yoga_labels)
#     pose_name = pred_list[0].title() + "Pose"
#     pose_accuracy = pred_list[1]
#     print(pose_name)
#     print(pose_accuracy)
#     print("\n\n")
#     return render_template("upload.html", pose_name=pose_name, pose_accuracy=pose_accuracy)


@app.route('/', methods=['GET', 'POST'])
def receive_image():
    if flask.request.method == 'POST':
        img = flask.request.values.get("photo")
        set_id = int(flask.request.values.get("set_id"))

        # print(img)
        # Make an array of 120,000 random bytes.
        # randomByteArray = bytearray(img.encode())
        # flatNumpyArray = np.array(randomByteArray)

        # Convert the array to make a 400x300 grayscale image.
        # grayImage = flatNumpyArray.reshape(300, 400)
        # cv2.imwrite('RandomGray.png', grayImage)

        # Convert the array to make a 400x100 color image.
        # bgrImage = flatNumpyArray.reshape(300, 300, 3)
        # cv2.imwrite('RandomColor.jpg', bgrImage)

        data = bytes(decode_base64_function(img))

        image_path = DOWNLOAD_DIRECTORY + 'frame.jpg'
        with open(image_path, 'wb') as f:
            f.write(data)

        if set_id == 1:
            model_path = './final_models/H5_files/Yoga_Set1.h5'
            yoga_labels = {0: "downdog", 1: "tree", 2: "warrior1"}
        else:
            model_path = './final_models/H5_files/Yoga_Set2.h5'
            yoga_labels = {0: "goddess", 1: "mountain", 2: "warrior2"}

        pred_list = predict_yoga_pose(image_path, model_path, yoga_labels)
        pose_name = pred_list[0].title() + " Pose"
        pose_accuracy = pred_list[1]
        print(pose_name)
        print(pose_accuracy)
        final_list = (pose_name, pose_accuracy)
        print("\n\n")
        print("Completed")

    return pose_name


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, threaded=True, debug=True)
