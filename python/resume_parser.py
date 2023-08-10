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

# Chatgpt model to extract skills
# openai.api_key = os.getenv('OPEN_AI_API_KEY')

# def skills(resume_text):
#     response = openai.ChatCompletion.create(
#     model="gpt-3.5-turbo",
#     messages=[
#         {"role": "system", "content": "As a member of the HR team, your task is to extract a python list of skills from the resumes of candidates applying for a job. Your goal is to provide a concise and focused list of skills (techinical and non-technical skills) without any elaboration or irrelevant information. Your prompt should ensure that the list of skills extracted accurately reflects the candidate's relevant expertise and qualifications. Avoid including any additional details or explanations in the list. Your prompt should guide the AI model to provide a straightforward and precise python list of skills from the candidate's resume. All the extracted skills should strictly be in lower case by default. NOTE - PLEASE MAKE SURE EACH ELEMENT IN THE LIST is a STRING LITERAL. Template - ```AI: [Python list of skills]``` " },
#         {"role": "user", "content": f"{resume_text}"}
#     ]
#     )
#     return response

# # Ranking CV

def cv_ranker(applicant_skills, required_skills):
    print('Applicant skills',applicant_skills)
    print('Required skills',required_skills)
    skillset = []
    extra_skills = []
    total_score = 0
    actual_total_weight = 0
    required_skills_lower = {key.lower(): value for key, value in required_skills.items()}
    for key, value in required_skills.items():
        actual_total_weight += required_skills[key]
    print('total weight', actual_total_weight)

    for skill in applicant_skills:
        if skill.lower() in required_skills_lower:
            skillset.append(skill)
            total_score += required_skills_lower[skill.lower()]
        else:
            extra_skills.append(skill)
    print('Total',total_score)
    final_rank = (total_score/ actual_total_weight) *10
    return final_rank


def cv_ranker2(resume_text, required_skills):
  print('Required skills:',required_skills)
  skillset=[]
  my_weight = 0
  actual_total_weight=0
  required_skills_list = [key.lower() for key, value in required_skills.items()]
  required_skills_lower = {key.lower():value for key, value in required_skills.items()}
  for key, value in required_skills.items():
        actual_total_weight += required_skills[key]
  print('Total Weight:', actual_total_weight)

  for skill in required_skills_list:
    if skill in resume_text.lower():
      skillset.append(skill)
      my_weight += required_skills_lower[skill]

  print('Applicant skills:',skillset)
  final_rank = (my_weight/ actual_total_weight) *10

  return final_rank


# threshold = 8
# >>>>>>> c4c762c05964ac8c0454b76530a1abb8059a5aa7

# if (fr> threshold):
#     print('YAYYYY! You are shortlisted')
# else:
#     print('Haha loser')
