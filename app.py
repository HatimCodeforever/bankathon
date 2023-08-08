from flask import Flask, render_template,request,jsonify,json
from pymongo import MongoClient
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

passw = os.getenv("passw")
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
connection_string = f"mongodb+srv://codeomega:{passw}@cluster0.hbwdy3p.mongodb.net/"
def MongoDB():
  client = MongoClient(connection_string)
  db = client.get_database('bankathon')
  records = db.applicant
  return records

records = MongoDB()
@app.route('/')
def hello_world():
    return 'Hello, World!'

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

@app.route('/job-detail')
def job_detail():
    return render_template('job-detail.html')

@app.route('/job-list')
def job_list():
    return render_template('job-list.html')

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
    return render_template('Login.html')

@app.route('/register-post',methods=['POST'])
def registerpost():
    new_record = {
    'first_name' : request.form.get('firstName'),
    'last_name' : request.form.get('lastName'),
    'birthday' : request.form.get('birthdayDate'),
    'gender' : request.form.get('gender'),
    'password' : request.form.get('password'),
    'email' : request.form.get('emailAddress'),
    'phone_number' : request.form.get('phoneNumber')
    }
    existing_user = MongoDB().find_one({'email': new_record['email']})
    if existing_user:
      response = {'message': 'exists'}
      return jsonify(response)
    
    result = MongoDB().insert_one(new_record)
    
    if result.inserted_id:
        return render_template('index.html')
    else:
        response = {'message': 'failed'}
        return jsonify(response)


@app.route('/dashboard')
def dashboard():
    return render_template('dash.html')

@app.route('/jobpost')
def jobpost():
    return render_template('job-post.html')

@app.route('/recruit-job-detail')
def recruiter_job_detail():
    return render_template('recruiter_job_detail.html')


if __name__ == "__main__":
    app.run(debug=True, port=5000)