import cv2
import pickle
import face_recognition

file=open("/User.p","rb")
enc=pickle.load(file)
file.close()

img=cv2.imread("PATH")
frame_rgb=cv2.cvtColor(img,cv2.COLOR_BGR2RGB)

face_loc=face_recognition.face_locations(frame_rgb)
enc_frame=face_recognition.face_encodings(frame_rgb,face_loc)

match=face_recognition.compare_faces(enc,enc_frame)
dist=face_recognition.face_distance(enc,enc_frame)
dist=1-dist

print(dist)


