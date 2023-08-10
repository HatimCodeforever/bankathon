import openai
import re


prompt='''You are an interviewer and you are supposed to ask questions to a candidate who has applied for the job. Your task is to ask questions on the topics specified to you by the HR team. The HR team will provide you a dictionary of topics and their corresponding weightages. The maximum weightage that can be assigned to a topic is 5. The difficulty and importance of the question should depend upon the weightage of that topic. Refrain from adding any irrelevant information or details besides the questions.
Template - 
" {Questions on all the topics in a list}"

{'Java':5,'Python':4,'Machine Learning':3}
'''

openai.api_key='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'

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
            "content": '''{'Java':5,'Python':4,'Machine Learning':3}'''
        }
    ],
    max_tokens=450,
    frequency_penalty=0,
    presence_penalty=0

)
print(response,"\n")
rep=response.choices[0].message.content
print("REPPPP::::::::::",rep)
# Regular expression to match the question lines
question_regex = r"\d+\.\s(.*\?)"

# Find all matches of the question regex in the text
questions = re.findall(question_regex, rep)

print(questions)