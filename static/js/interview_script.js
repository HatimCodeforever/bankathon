const userCamera = document.getElementById("user-camera");
const toggleCameraButton = document.getElementById("toggle-camera");
const toggleMicButton = document.getElementById("toggle-mic");
const questionsList = document.getElementById("questions-list");
const questionsection = document.getElementById("interview-questions");
toggleMicButton.style.display = 'none';
questionsection.style.display = 'none';
const nextButton = document.getElementById("next-button");
const endButton = document.getElementById("end-button");
nextButton.style.display = 'none';

let answer = [];
endButton.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }

  Swal.fire({
    title: "Interview Completed",
    text: "You will be notified about the results from us shortly! Thank you!",
    icon: "success",
    confirmButtonText: "OK",
  }).then((result) => {
    const requestData = {
      questions: interviewQuestions,
      answers: answer
    };
    if (result.isConfirmed) {
      fetch('/del_notif', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      }).then(response => response.json())
    .then(data => {
      window.location.href = "/home";
      
    })
    .catch(error => console.error('Error fetching data:', error));
      
    }
  });
});

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    userCamera.srcObject = stream;
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
}

var interviewQuestions = []
   
let currentQuestionIndex = 0;

const speak = (text) => {
  let msg = new SpeechSynthesisUtterance();
  msg.text = text;
  window.speechSynthesis.speak(msg);
};

function displayQuestion(index) {
  questionsList.innerHTML = "";
  if (index >= 0 && index < interviewQuestions.length) {
    const li = document.createElement("li");
    li.textContent = interviewQuestions[index];
    questionsList.appendChild(li);
    const questionText = interviewQuestions[index];
    speak(questionText)

    if (index === interviewQuestions.length - 1) {
      nextButton.style.display = "none";
      endButton.style.display = "block";
    } else {
      nextButton.style.display = "block";
      endButton.style.display = "none";
    }
  }
}

function toggleCamera() {
  const video = document.getElementById('user-camera');
  const frameDataInput = document.getElementById('frame-data');
  let capturing = false;
  if (!capturing) {
    capturing = true;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const captureFrame = () => {
      if (capturing) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        frameDataInput.value = imageData;
        fetch('/face_rec', {
          method: 'POST',
          body: new FormData(document.getElementById('camera-form')),
        }).then(response => response.json()) // Parse response as JSON
          .then(result => {
            if (result.success === true) {
              Swal.fire({
                title: 'Success!',
                text: 'You are verified!!',
                icon: 'success',
                confirmButtonText: 'Okay'
              }).then((result) => {
                if (result.isConfirmed) {
                  userCamera.classList.toggle('bottom-right');
                  userCamera.classList.remove('user-camera');
                  toggleCameraButton.style.display = 'none';
                  toggleMicButton.style.display = 'block';
                  questionsection.style.display = 'block';
                  displayQuestion(currentQuestionIndex);
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                    document.getElementById("footer").style.display = 'none';
                    document.getElementById("navbar").style.display = 'none';
                  }
                }
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'Face does not Match!1, try again',
                icon: 'error',
                confirmButtonText: 'Okay'
              });
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    };
    fetch('/get_data', {
      method: 'GET',
    }).then(response => response.json())
  .then(data => {
    interviewQuestions = data;
    captureFrame();
  })
  .catch(error => console.error('Error fetching data:', error));
  }
}



let recognition;
let f_transcript = "";
function toggleMicrophone() {
  if (!recognition) {
    f_transcript = "";
    toggleMicButton.textContent = "Click to save the answer";
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("Listening...");
    };

    recognition.onresult = (event) => {
      const interimTranscript = event.results[event.results.length - 1][0].transcript;
      f_transcript += interimTranscript + " ";
    };

    recognition.onerror = (event) => {
      console.error("Error:", event.error);
    };

    recognition.onend = () => {
      console.log("Stopped listening.");
      console.log("Final answer:- ",f_transcript)
    };

    recognition.start();
  } else {
    toggleMicButton.textContent = "Speak Answer";
    recognition.stop();
    recognition = null;
  }
}




nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  answer.push(f_transcript); 
  f_transcript = "";
  displayQuestion(currentQuestionIndex);
});

startCamera();

toggleCameraButton.addEventListener("click", toggleCamera);
toggleMicButton.addEventListener("click", toggleMicrophone);
