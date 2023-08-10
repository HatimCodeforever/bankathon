import cv2
import pickle
import face_recognition

def Encode(img):
    print("Encoding...")
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    encode=face_recognition.face_encodings(img)[0]
    print("Encoding Complete")
    return encode
def SaveEnc(enc):
    file=open("uploads/User.p","wb")
    pickle.dump(enc,file)
    file.close()
    print("Encoding Saved")
