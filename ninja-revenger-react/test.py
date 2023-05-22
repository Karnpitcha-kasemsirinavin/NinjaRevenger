from flask import Flask, request

app = Flask(__name__)

@app.route('/', methods=['POST'])
def handle_post_request():
    data = request.get_json()  # Access the JSON data sent in the request
    print(data)  # Print the received data
    return 'Data received'

if __name__ == '__main__':
    app.run(port=3600)