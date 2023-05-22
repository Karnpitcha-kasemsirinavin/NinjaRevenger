import cv2
import mediapipe as mp
import torch

cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FPS, 15)
#print("CAP_PROP_FPS : '{}'".format(cap.get(cv2.CAP_PROP_FPS)))
mpHands = mp.solutions.hands
hands = mpHands.Hands()
mpDraw = mp.solutions.drawing_utils
mpStyles = mp.solutions.drawing_styles
font = cv2.FONT_ITALIC
n = 0

model = torch.hub.load('yolov5-master', 'custom', path='model/last.pt', source='local')

while True:
    n += 1
    success, image = cap.read()
    image = cv2.flip(image, 1)
    h, w, c = image.shape
    imageRGB = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = hands.process(imageRGB)

    if results.multi_hand_landmarks:
        #print(results.multi_hand_landmarks)
        for landmark in results.multi_hand_landmarks:
            mpDraw.draw_landmarks(image, landmark, mpHands.HAND_CONNECTIONS)

        if n%15 == 0:
            predict = model([image])
            info = predict.pandas().xyxy[0].to_dict(orient="records")
            if len(info) != 0:
                x_min, y_min, x_max, y_max = int(info[0]['xmin']), int(info[0]['ymin']), int(info[0]['xmax']), int(info[0]['ymax'])
                print('Confidence:', "{:.3f}".format(info[0]['confidence']), '\t>>>', info[0]['name'])
                cv2.rectangle(image, (x_min - 20, y_min - 20), (x_max + 20, y_max + 20), (0, 255, 0), 2)
                cv2.putText(image, info[0]['name']+'  '+"{:.3f}".format(info[0]['confidence']), (x_min - 20, y_min - 30), font, fontScale=0.6, color=(0, 255, 0), thickness=2, lineType=cv2.LINE_4)


    cv2.imshow('webcam', image)

    if cv2.waitKey(1) == 27:
        break  # esc to quit

cap.release()
cv2.destroyAllWindows()
