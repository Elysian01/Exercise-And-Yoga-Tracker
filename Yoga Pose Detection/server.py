import numpy as np
import tensorflow as tf
from keras.preprocessing import image

import base64 
import flask
from flask import Flask

app = Flask(__name__)
DOWNLOAD_DIRECTORY = "./recieved_images/"

def encode_base64(sample_string):
    sample_string_bytes = sample_string.encode("ascii") 
    
    base64_bytes = base64.b64encode(sample_string_bytes) 
    base64_string = base64_bytes.decode("ascii") 
    
    print(f"Encoded string: {base64_string}") 
    

def decode_base64(base64_string):    
    return base64.b64decode(base64_string)
    

def predict_yoga_pose(img_path, model_path, labels_dict):
    img = image.load_img(img_path, target_size=(300, 300))
    img_array = image.img_to_array(img)
    # print(img_array/255)
    img_array = np.expand_dims(img_array, axis=0)

    loaded_model = tf.keras.models.load_model(model_path)
    images = np.vstack([img_array])
    classes = loaded_model.predict(images, batch_size=10)
    print("Class Predictions: ", classes)
    pred_index = np.argmax(classes[0])
    print("\nPrediction is: ", labels_dict[pred_index])
    return [classes[0].tolist(), pred_index]

    

@app.route('/',methods=['GET', 'POST'])
def receive_image():
    if flask.request.method == 'POST':
        img = flask.request.values.get("photo")
        set_id = int(flask.request.values.get("set_id"))
        
        data = bytes(decode_base64(img))
        image_path = DOWNLOAD_DIRECTORY + 'frame.jpg'
        with open(image_path,'wb') as f:
            f.write(data)

        if set_id == 1:
            model_path = './final_models/H5_files/Yoga_Set1.h5'
            yoga_labels = {0: "downdog", 1: "tree", 2: "warrior1"}
        else:
            model_path = './final_models/H5_files/Yoga_Set2.h5'
            yoga_labels = {0:"goddess",1:"mountain",2:"warrior2"}

        pred_index = str(predict_yoga_pose(image_path, model_path, yoga_labels))
        print("Completed")

    return pred_index


if __name__ == '__main__':

    app.run(host='0.0.0.0', port=8000, threaded=True, debug=True)
