import os
from email.message import EmailMessage
import smtplib, ssl


def send_mail(rec,t,name,job):

    send="codeomega11@gmail.com"
    pas="gqnknjdlvmtedqzt"
    print(name,job)
    
    if t==1:
        sub=f"Congratulations! You've Been Selected for the Interview - Round 1 Bankathon"
        body=f"""
        Dear {name},

    I hope this email finds you well. We are thrilled to inform you that your application for the {job} position at Axis Bank has been successful, and you have been selected to move forward to the interview stage.

    Your qualifications and experiences have truly impressed us, and we believe you could be an excellent fit for our team. We were particularly impressed by your [mention specific strengths or achievements from their application], and we are excited to learn more about your skills and aspirations.

    The next step in our hiring process will be the interview, where we will have the opportunity to discuss your background, experiences, and how you envision contributing to our company. Our team is looking forward to getting to know you better.

    Our hiring team will be in touch shortly to schedule the interview. In the meantime, please feel free to reach out if you have any questions or if there is any additional information you would like to provide.

    Congratulations once again on making it to the next round! We appreciate your interest in joining [Company Name] and look forward to meeting you in person.

Best regards,

CodeOmega
HR Team
        """
    elif t==2:
        sub=f"Update on Your Application for {job} - Round 1 Bankathon"
        body=f"""
        Dear {name},

    I trust this message finds you well. I want to personally extend my gratitude for your interest in the {job} position at Axis Bank. We truly appreciate the time and effort you invested in your application.

    After careful review of all applications received, I regret to inform you that we have proceeded with other candidates for the interview stage of the hiring process. While your qualifications and experiences are impressive, we had an overwhelming response and had to make some difficult decisions.

    Please understand that this decision was not a reflection of your skills or potential. We were fortunate to have a pool of highly qualified applicants, and the selection process was undoubtedly challenging. Your application stood out, and we appreciate your interest in joining our team.

    We are always on the lookout for talented individuals, and your profile has captured our attention. We encourage you to keep an eye on our career page for future opportunities that match your skills and aspirations. Our organization continues to grow, and we would welcome the chance to connect with you again.

    Thank you once again for considering Axis Bank as a potential employer. We wish you all the best in your career endeavors and hope to cross paths in the future.

Warm regards,

Vedant
HR Team
Axis Bank






        
        regards,
        Ved
        """
    elif t==3:
        sub=f"The candidates have been selected - Bankathon"
        body=f"""
        To the HR Team,
        The candidate selection list has been processed. Please check the website for the same.
        the link is: [LINK NEEDED GUYSSSSSS]
        
        regards,
        Ved
        """


    em=EmailMessage()
    em['From']=send
    em['To']=rec
    em['Subject']=sub
    em.set_content(body)

    context=ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com",465,context=context) as server:
        server.login(send,pas)
        server.send_message(em)
        print("Mail Sent")

# rec="kamblivedant50@gmail.com,haadirakhangi@gmail.com, hatmsb11@gmail.com, mehekjain28@gmail.com"
# Name="Random Dude"
# job="Random Job"

# for n in range (1,4):
#     send_mail(rec,n,Name,job)