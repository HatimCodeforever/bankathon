from flask import Flask, render_template,request,jsonify,json,redirect,session
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson.binary import Binary
from bson import ObjectId
from datetime import datetime


load_dotenv()

app = Flask(__name__)

passw = os.getenv("passw")
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
connection_string = f"mongodb+srv://codeomega:{passw}@cluster0.hbwdy3p.mongodb.net/"
def MongoDB(collection_name):
    client = MongoClient(connection_string)
    db = client.get_database('bankathon')
    collection = db.get_collection(collection_name)
    return collection

@app.route('/')
def landing_page():
    return render_template('landingPage.html')

@app.route('/home')
def home():
    return render_template('index.html')

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
    stored_object_id = ObjectId(session['user_id'])
    current_date = datetime.now().date()
    formatted_date = current_date.strftime('%Y-%m-%d')
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
        'required_skills': [],
    }

    skills = request.form.getlist('skills[]')
    for skill in skills:
        skill_name, skill_weight = skill.split(',')
        job_data['required_skills'].append({'name': skill_name, 'weight': skill_weight})
    
    collection = MongoDB('jobs')
    result = collection.insert_one(job_data)
    
    if result.inserted_id:
        response = {'success': True}
    else:
        response = {'success': False}
    return jsonify(response)

@app.route('/recruit-job-detail')
def recruiter_job_detail():
    return render_template('recruiter_job_detail.html')

@app.route('/recruit-job-list')
def recruiter_job_list():
    collection = MongoDB('jobs')
    partjobs = collection.find({'job_mode': 'Part Time'})
    fulljobs = collection.find({'job_mode': 'Full Time'})
    conjobs = collection.find({'job_mode': 'Contract'})
    return render_template('recruitor-job.html', partjobs = partjobs,fulljobs = fulljobs,conjobs = conjobs)

@app.route('/notification')
def notification():
    return render_template('notification.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

@app.route('/interview')
def interview():
    return render_template('interview.html')

if __name__ == "__main__":
    app.run(debug=True, port=5000)