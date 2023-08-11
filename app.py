from flask import Flask, render_template,request,jsonify,json,redirect,session
from pymongo import MongoClient
import os
import sys
sys.path.append('python')
import resume_parser
import mail
import openai
from deepface import DeepFace
import base64
from dotenv import load_dotenv
from bson.binary import Binary
from bson import ObjectId
from datetime import datetime
import re
from deepface import DeepFace



load_dotenv()

app = Flask(__name__)

passw = os.getenv("passw")
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")

connection_string = "mongodb+srv://codeomega:373896178@cluster0.hnyk6mi.mongodb.net/"
def MongoDB(collection_name):
    client = MongoClient(connection_string)
    db = client.get_database('bankathon')
    collection = db.get_collection(collection_name)
    return collection

@app.route('/')
def landing_page():
    return render_template('index.html')

@app.route('/home')
def home():
    return render_template('landingPage.html')

@app.route('/category')
def category():
    return render_template('category.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/job-detail/<job_id>')
def job_detail(job_id):
    collection = MongoDB('jobs')
    job = collection.find_one({'_id': ObjectId(job_id)})
    return render_template('job-detail.html', job=job)

@app.route('/job-list')
def job_list():
    collection = MongoDB('jobs')
    partjobs = collection.find({'job_mode': 'Part Time'})
    fulljobs = collection.find({'job_mode': 'Full Time'})
    conjobs = collection.find({'job_mode': 'Contract'})
    return render_template('job-list.html', partjobs = partjobs,fulljobs = fulljobs,conjobs = conjobs)

@app.route('/testimonial')
def testimonial():
    return render_template('testimonial.html')

@app.route('/404')
def error_404():
    return render_template('404.html')

@app.route('/register')
def register():
    return render_template('Registration.html')

@app.route('/login')
def login():
    return render_template('Login.html')

@app.route('/login-post',methods=['POST'])
def loginpost():
    record = {
    'password' : request.form.get('logpass'),
    'email' : request.form.get('logemail'),
    'type': request.form.get('type'),
    }
    collection_name = 'applicant' if record['type'] == 'applicant' else 'recruiter'
    collection = MongoDB(collection_name)
    existing_user = collection.find_one({'email': record['email']})
    if existing_user:
        if existing_user['password'] == record['password']:
            response = {'success': True}
            session['user_id'] = str(existing_user['_id'])
            print(session['user_id'])
            return jsonify(response)
        else:
            response = {'success': 'password_mismatch'}
            return jsonify(response)
    else :
        response = {'success': False}
        return jsonify(response)

@app.route('/register-post',methods=['POST'])
def registerpost():
    new_record = {
    'first_name' : request.form.get('firstName'),
    'last_name' : request.form.get('lastName'),
    'birthday' : request.form.get('birthdayDate'),
    'gender' : request.form.get('gender'),
    'password' : request.form.get('password'),
    'email' : request.form.get('emailAddress'),
    'phone_number' : request.form.get('phoneNumber'),
    'profile_image': None
    }
    profile_image = request.files.get('profile')
    if profile_image:
        new_record['profile_image'] = Binary(profile_image.read())
    collection = MongoDB('applicant')
    existing_user = collection.find_one({'email': new_record['email']})  
    if existing_user:
      response = {'success': 'exists'}
      return jsonify(response)
    
    result = collection.insert_one(new_record)
    if result.inserted_id:
        session['user_id'] = str(result.inserted_id)
        return jsonify({'success': True})
    else:
        response = {'success': False}
        return jsonify(response)


@app.route('/dashboard')
def dashboard():
    return render_template('dash.html')

@app.route('/job-post')
def jobpost():
    return render_template('job-post.html')

@app.route('/post-jobpost', methods=['POST'])
def save_job():
    dict2 = {}
    stored_object_id = ObjectId(session['user_id'])
    current_date = datetime.now().date()
    formatted_date = current_date.strftime('%Y-%m-%d')
    job_skills= []
    skills = request.form.getlist('skills[]')
    for skill in skills:
        skill_name, skill_weight = skill.split(',')
        job_skills.append({'name': skill_name, 'weight': skill_weight})
        dict2[skill_name]=int(skill_weight)
    openai.api_key = os.getenv('OPENAI_API_KEY')
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages= [
            {
                "role": "system",
                "content": '''You are an interviewer and you are supposed to ask questions to a candidate who has applied for the job. Your task is to ask 5 questions on the topics specified to you by the HR team. The HR team will provide you a dictionary of topics and their corresponding difficulties. The maximum weightage that can be assigned to a topic is 5. Refrain from adding any irrelevant information or details besides the questions.
                Template - 
                "{Questions on all the topics in a list}'''
            },
            {
                "role": "user",
                "content": dict2
            }
        ],
        max_tokens=450,
        frequency_penalty=0,
        presence_penalty=0
    )
    rep=response.choices[0].message.content
    question_regex = r"\d+\.\s(.*\?)"
    questions = re.findall(question_regex, rep)
    

    job_data = {
        'rec_id': stored_object_id,
        'job_title': request.form.get('jobTitle'),
        'job_description': request.form.get('jobDescription'),
        'job_responsibility': request.form.get('jobResponsibility'),
        'job_qualification': request.form.get('jobQualification'),
        'job_mode': request.form.get('jobMode'),
        'salary_range': int(request.form.get('salaryRange')),
        'job_deadline': request.form.get('deadDate'),
        'job_location': request.form.get('loc'),
        'cur_date': formatted_date,
        'required_skills': job_skills,
        'job_questions' : questions,
    }

    
    
    collection = MongoDB('jobs')
    result = collection.insert_one(job_data)
    
    if result.inserted_id:
        response = {'success': True}
    else:
        response = {'success': False}
    return jsonify(response)

@app.route('/recruit-job-detail/<job_id>')
def recruiter_job_detail(job_id):
    collection = MongoDB('jobs')
    job = collection.find_one({'_id': ObjectId(job_id)})
    return render_template('recruiter_job_detail.html', job=job)

@app.route('/recruit-job-list')
def recruiter_job_list():
    collection = MongoDB('jobs')
    partjobs = collection.find({'job_mode': 'Part Time'})
    fulljobs = collection.find({'job_mode': 'Full Time'})
    conjobs = collection.find({'job_mode': 'Contract'})
    return render_template('recruitor-job.html', partjobs = partjobs,fulljobs = fulljobs,conjobs = conjobs)

@app.route('/notification')
def notification():
    collection = MongoDB('shortlisted')
    collection_jobs = MongoDB('jobs')
    notif = collection.find({'user_id': session['user_id']})
    print(session['user_id'])
    job_info_list = []
    for shortlisted_job in notif:
        job_id = shortlisted_job.get('job_id')
        print(job_id)
        job_info = collection_jobs.find_one({'_id': ObjectId(job_id)})
        if job_info:
            job_info_list.append(job_info)
    return render_template('notification.html', job_info_list=job_info_list)

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

@app.route('/del_notif')
def del_notif():
    collection = MongoDB('shortlisted')
    result = collection.find_one_and_delete({'user_id': session['user_id'],'job_id': session['jobid']})
    if result:
        response = {'success': True}
    else:
        response = {'success': False}
    return jsonify(response)

@app.route('/get_data')
def getdata():
    job_id = session['jobid']
    j_collection = MongoDB('jobs')
    job = j_collection.find_one({'_id': ObjectId(job_id)})
    job_q = job.get('job_questions')
    print(job_q)
    return jsonify(job_q)

@app.route('/interview/<job_id>')
def interview(job_id):
    session['jobid'] = job_id
    j_collection = MongoDB('jobs')
    job = j_collection.find_one({'_id': ObjectId(job_id)})
    job_q = job.get('job_questions')
    print(type(job_q))
    collection = MongoDB('applicant')
    image_data = collection.find_one({"_id": ObjectId(session['user_id'])})
    if image_data:
        image_binary = image_data["profile_image"]
        saved_image_path = "uploads/image.jpg"
        with open(saved_image_path, "wb") as f:
            f.write(image_binary)
        img= EncodeGen.cv2.imread("uploads/image.jpg")
        enc=EncodeGen.Encode(img)
        EncodeGen.SaveEnc(enc)
    return render_template('interview.html',job_q=job_q)

@app.route('/face_rec',methods=['POST'])
def face_rec():
    models = [
    "VGG-Face", 
    "Facenet", 
    "Facenet512", 
    "OpenFace", 
    "DeepFace", 
    "DeepID", 
    "ArcFace", 
    "Dlib", 
    "SFace",
    ]
    backends = [
    'opencv', 
    'ssd', 
    'dlib', 
    'mtcnn', 
    'retinaface', 
    'mediapipe',
    'yolov8',
    'yunet',
    ]
    metrics = ["cosine", "euclidean", "euclidean_l2"]
    
    frame_data = request.form.get('frame-data')
    if frame_data:
        image_data = base64.b64decode(frame_data.split(',')[1])
        save_path = os.path.join('uploads/', 'captured_frame.jpg')
        with open(save_path, 'wb') as f:
            f.write(image_data)
    result = DeepFace.verify(img1_path = "uploads/captured_frame.jpg", img2_path = "uploads/image.jpg", model_name= models[2], distance_metric=metrics[2])
    print(result['verified'])
    if result['verified']:
        response = {'success': True}
    else:
        response = {'success': False}
    return jsonify(response)

@app.route('/resume-parser', methods=['POST'])
def run_script():
    collection = MongoDB('applicant')
    user = collection.find_one({'_id': ObjectId(session['user_id'])})
    uploaded_file = request.files['file']
    job_id = request.form.get('job')
    req_skills ={}
    collection = MongoDB('jobs')
    job = collection.find_one({'_id': ObjectId(job_id)})
    required_skills = job.get('required_skills', [])
    for skill in required_skills:
        skill_name = skill.get('name')
        skill_weight = skill.get('weight')
        req_skills[skill_name] = int(skill_weight)
    if uploaded_file and uploaded_file.filename.endswith('.pdf') or uploaded_file.filename.endswith('.docx'):
        file_path = os.path.join('uploads', uploaded_file.filename)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        uploaded_file.save(file_path)
        converter = resume_parser.Convert2Text(file_path)
        resume_text = converter.convert_to_text()
        rank = resume_parser.cv_ranker2(resume_text,req_skills)
        print("Your Rank",rank)
        os.remove(file_path)
        threshold = 6
        if (rank> threshold):
            mail.send_mail(user.get('email'),1,user.get('first_name'),job.get('job_title'))
            new_record = {
            'user_id' : session['user_id'],
            'job_id'  : job_id,
            }
            
            collection = MongoDB('shortlisted')
            result = collection.insert_one(new_record)
            if result.inserted_id:
                return jsonify({'success': True})
            else:
                mail.send_mail(user.get('email'),2,user.get('first_name'),job.get('job_title'))

        response = {'success': True}
        return jsonify(response)
    else:
        return jsonify({'error': 'Invalid file format'})

if __name__ == "__main__":
    app.run(debug=True, port=5000)