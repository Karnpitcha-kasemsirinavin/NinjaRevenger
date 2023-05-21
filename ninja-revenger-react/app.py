from flask import Flask, request, jsonify
import torch
import base64
from PIL import Image
from io import BytesIO

app = Flask(__name__)

model = torch.hub.load('yolov5-master', 'custom', path='last.pt', source='local')

@app.route('/process', methods=['POST'])
def process():
    # Retrieve the variable sent from JavaScript
    js_variable = request.form['js_variable']

    # Process the variable using the PyTorch model
    output = predict(js_variable)

    # Return the model's output as a JSON response
    return jsonify({'model_output': output})

# def base64_to_image(img_data):
#     # Convert the base64 image data to PIL Image object
#     img_bytes = base64.b64decode(img_data.split(',')[1])
#     img = Image.open(BytesIO(img_bytes))
#     return img

def predict(img):
    results = model([img])
    info = results.pandas().xyxy[0].to_dict(orient="records")
    print('Hand gesture:', info[0]['name'], '\tconfidence:', "{:.3f}".format(info[0]['confidence']))
    return info[0]['class']

if __name__ == '__main__':
    app.run()