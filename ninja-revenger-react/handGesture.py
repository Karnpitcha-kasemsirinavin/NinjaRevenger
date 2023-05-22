from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
import torch

app = Flask(__name__)

model = torch.hub.load('ninja-revenger-react/yolov5-master', 'custom', path='ninja-revenger-react/last.pt', source='local')

@app.route('/', methods=['POST'])
def handle_post_request():
    data = request.get_json()  # Access the JSON data sent in the request
    # print(data)  # Print the received data
    # print(data)
    # try:
    img = to_cv2(data['image'])  # convert base64 to cv2
    # cv2.imshow("output", img)
    # cv2.waitKey(0)
    output = predict(img)  # model prediction
    print(output)
    return jsonify({ 'hand': output})

def to_cv2(img):
    img = img.split(",")[1]
    decoded_data = base64.b64decode(img)
    np_data = np.frombuffer(decoded_data, np.uint8)
    # np_data = np.fromstring(decoded_data, np.uint8)
    img = cv2.imdecode(np_data, cv2.IMREAD_UNCHANGED)
    return img

def predict(img):
    results = model([img])
    # print('RESULTS', results)
    info = results.pandas().xyxy[0].to_dict(orient="records")
    # print('INFO', info, len(info))
    if len(info):
        print('Hand gesture:', info[0]['name'], '\tconfidence:', "{:.3f}".format(info[0]['confidence']))
        return info[0]['class']
    return -1

if __name__ == '__main__':
    app.run(port=3600)