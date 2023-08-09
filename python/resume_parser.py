# pip install pypdf2
# pip install docx2txt
# pip install openai

import os
import docx2txt
from PyPDF2 import PdfReader
import openai
from dotenv import load_dotenv

load_dotenv()

#Converting resume from pdf or docx to text
<<<<<<< HEAD
# class Convert2Text:
#     def __init__(self, file_path):
#         self.file_path = file_path



def check_file_extension(self):
    _, file_extension = os.path.splitext(self.file_path)
    return file_extension.lower()

def convert_to_text(self):
    file_extension = self.check_file_extension()
    if file_extension == '.pdf':
        return self.pdftotext(self.file_path)
    elif file_extension == '.docx':
        return self.doctotext(self.file_path)
    else:
        raise ValueError(f"Unsupported file format: {file_extension}. Only .pdf and .docx files are supported.")

def doctotext(self, m):
    temp = docx2txt.process(m)
    resume_text = [line.replace('\t', ' ') for line in temp.split('\n') if line]
    text = ' '.join(resume_text)
    return text

def pdftotext(self, m):
    pdfFileObj = open(m, 'rb')
    pdfFileReader = PdfReader(pdfFileObj)
    num_pages = len(pdfFileReader.pages)
    currentPageNumber = 0
    text = ''
    while currentPageNumber < num_pages:
        pdfPage = pdfFileReader.pages[currentPageNumber]
        text = text + pdfPage.extract_text()
        currentPageNumber += 1
    pdfFileObj.close()
    return text



resume = 'Hack_Resume_25_7_23.pdf'

converter = Convert2Text(resume)

resume_text = converter.convert_to_text()
=======
class Convert2Text:
    def __init__(self, file_path):
        self.file_path = file_path

    def check_file_extension(self):
        _, file_extension = os.path.splitext(self.file_path)
        return file_extension.lower()

    def convert_to_text(self):
        file_extension = self.check_file_extension()
        if file_extension == '.pdf':
            return self.pdftotext(self.file_path)
        elif file_extension == '.docx':
            return self.doctotext(self.file_path)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}. Only .pdf and .docx files are supported.")

    def doctotext(self, m):
        temp = docx2txt.process(m)
        resume_text = [line.replace('\t', ' ') for line in temp.split('\n') if line]
        text = ' '.join(resume_text)
        return text

    def pdftotext(self, m):
        pdfFileObj = open(m, 'rb')
        pdfFileReader = PdfReader(pdfFileObj)
        num_pages = len(pdfFileReader.pages)
        currentPageNumber = 0
        text = ''
        while currentPageNumber < num_pages:
            pdfPage = pdfFileReader.pages[currentPageNumber]
            text = text + pdfPage.extract_text()
            currentPageNumber += 1
        pdfFileObj.close()
        return text
>>>>>>> c4c762c05964ac8c0454b76530a1abb8059a5aa7

# Chatgpt model to extract skills
openai.api_key = os.getenv("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")

def skills(resume_text):
    response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "As a member of the HR team, your task is to extract a python list of skills from the resumes of candidates applying for a job. Your goal is to provide a concise and focused list of skills (techinical and non-technical skills) without any elaboration or irrelevant information. Your prompt should ensure that the list of skills extracted accurately reflects the candidate's relevant expertise and qualifications. Avoid including any additional details or explanations in the list. Your prompt should guide the AI model to provide a straightforward and precise python list of skills from the candidate's resume. All the extracted skills should strictly be in lower case by default. Template - ```list of skills``` " },
        {"role": "user", "content": f"{resume_text}"}
    ]
    )
    return response

# # Ranking CV

def cv_ranker(applicant_skills, required_skills):
    skillset = []
    extra_skills = []
    total_score = 0
    actual_total_weight = 0
    for key, value in required_skills.items():
        actual_total_weight += required_skills[key]
    for skill in applicant_skills:
        if skill.lower() in required_skills:
            skillset.append(skill)
            total_score += required_skills[skill]
        else:
            extra_skills.append(skill)
    final_rank = (total_score/ actual_total_weight) *10
    return final_rank

<<<<<<< HEAD
fr = cv_ranker(applicant_skills, required_skills)
print(fr)
threshold = 8
=======
# threshold = 8
>>>>>>> c4c762c05964ac8c0454b76530a1abb8059a5aa7

# if (fr> threshold):
#     print('YAYYYY! You are shortlisted')
# else:
#     print('Haha loser')
