from flask import Flask, request, jsonify
import torch
import cv2
import numpy as np
import base64

app = Flask(__name__)

model = torch.hub.load('yolov5-master', 'custom', path='ninja-revenger-react/last.pt', source='local')

@app.route('/process', methods=['POST'])
def process():
    # Retrieve the variable sent from JavaScript
    js_variable = request.form['js_variable']

    try:
        img = to_cv2(js_variable) #convert base64 to cv2
        output = predict(img)  # model prediction
    except:
        output = "no detection"

    # Return the model's output as a JSON response
    return jsonify({'model_output': output})

def to_cv2(img):
    decoded_data = base64.b64decode(img)
    np_data = np.fromstring(decoded_data, np.uint8)
    img = cv2.imdecode(np_data, cv2.IMREAD_UNCHANGED)
    return img

def predict(img):
    results = model([img])
    info = results.pandas().xyxy[0].to_dict(orient="records")
    print('Hand gesture:', info[0]['name'], '\tconfidence:', "{:.3f}".format(info[0]['confidence']))
    return info[0]['class']

if __name__ == '__main__':
    app.run(port=4000, debug=True)
