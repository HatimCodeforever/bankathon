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


let voices = [];
window.speechSynthesis.onvoiceschanged = function() {
  voices = window.speechSynthesis.getVoices();
};

const speak = (text) => {
  let msg = new SpeechSynthesisUtterance();
  let chosenVoice = voices[82];
  msg.voice = chosenVoice;
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
                text: 'Face does not match! Try again',
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
    toggleMicButton.textContent = "Save Answer";
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

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 2700;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

startTimer();

function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}