import cv2
import mediapipe as mp

mp_drawing = mp.solutions.drawing_utils     #draw variable for landmark
mp_hands = mp.solutions.hands               #initialize hand variable
hands = mp_hands.Hands()

cap = cv2.VideoCapture(0)   #capture video frames

while cap.isOpened():
    success, image = cap.read() 
    if not success:
        print("Ignoring empty camera frame.")
        continue

    results = hands.process(image)

    if results.multi_hand_landmarks:
        num_hands = len(results.multi_hand_landmarks)  # get number of detected hands
        print("Number of hands detected:", num_hands, "\n")  # print the number of detected hands

        for num, hand_landmarks in enumerate(results.multi_hand_landmarks):
            mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            if num == 0:
                hand = "hand 1"
            else:
                hand = "hand 2"
            for i in range(21):         #21 landmarks in total
                print(f'{mp_hands.HandLandmark(i).name} ', hand, ":")      #name of land mark
                print(f'{hand_landmarks.landmark[mp_hands.HandLandmark(i).value]}')        #landmark value
            
    cv2.imshow('MediaPipe Hands', image)
    if cv2.waitKey(5) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()