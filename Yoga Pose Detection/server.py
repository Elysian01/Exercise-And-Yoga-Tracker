import io
from array import array
import PIL.Image as Image
import numpy as np
import tensorflow as tf

import os
import base64
import flask
from flask import Flask

app = Flask(__name__)
DOWNLOAD_DIRECTORY = "./recieved_images/"


def readimage(path):
    count = os.stat(path).st_size / 2
    with open(path, "rb") as f:
        return bytearray(f.read())


def test():

    bytes = readimage("test.txt")
    image = Image.open(io.BytesIO(bytes))
    image.save("image.jpg")


def encode_base64(sample_string):
    sample_string_bytes = sample_string.encode("ascii")
    base64_bytes = base64.b64encode(sample_string_bytes)
    base64_string = base64_bytes.decode("ascii")

    print(f"Encoded string: {base64_string}")


def decode_base64_function(base64_message):
    return base64.b64decode(base64_message)


def predict_yoga_pose(img_path, model_path, labels_dict):
    # img = image.load_img(img_path, target_size=(300, 300))
    # img = image.load_img(img_path)
    # img_array = image.img_to_array(img)

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
    return [classes[0].tolist(), pred_index]


@app.route('/', methods=['GET', 'POST'])
def receive_image():
    if flask.request.method == 'POST':
        img = flask.request.values.get("photo")
        set_id = int(flask.request.values.get("set_id"))

        print(img)
        data = bytes(decode_base64_function(img))
        print("\n\n\n")
        print(data)
        # data = data[:-1000]
        image_path = DOWNLOAD_DIRECTORY + 'frame.jpg'
        with open(image_path, 'wb') as f:
            f.write(data)

        if set_id == 1:
            model_path = './final_models/H5_files/Yoga_Set1.h5'
            yoga_labels = {0: "downdog", 1: "tree", 2: "warrior1"}
        else:
            model_path = './final_models/H5_files/Yoga_Set2.h5'
            yoga_labels = {0: "goddess", 1: "mountain", 2: "warrior2"}

        pred_index = str(predict_yoga_pose(
            image_path, model_path, yoga_labels))
        print("Completed")

    return pred_index

# @app.route('/', methods=['GET', 'POST'])
# def receive_image():
#     if flask.request.method == 'POST':
#         img = flask.request.values.get("photo")
#         set_id = int(flask.request.values.get("set_id"))

#         data = bytes(decode_base64(img))
#         print(data)
#         # with open("byte_code.txt", 'wb') as f:
#         #     f.write(data)
#         # image_path = DOWNLOAD_DIRECTORY + 'frame.jpg'
#         # with open(image_path, 'wb') as f:
#         #     f.write(data)

#         # if set_id == 1:
#         #     model_path = './final_models/H5_files/Yoga_Set1.h5'
#         #     yoga_labels = {0: "downdog", 1: "tree", 2: "warrior1"}
#         # else:
#         #     model_path = './final_models/H5_files/Yoga_Set2.h5'
#         #     yoga_labels = {0: "goddess", 1: "mountain", 2: "warrior2"}

#         # pred_index = str(predict_yoga_pose(
#         #     image_path, model_path, yoga_labels))
#         print("Completed")

#     return "pred_index"


if __name__ == '__main__':
    # test()
    app.run(host='0.0.0.0', port=8000, threaded=True, debug=True)
