const userCamera = document.getElementById("user-camera");
const toggleCameraButton = document.getElementById("toggle-camera");
const toggleMicButton = document.getElementById("toggle-mic");
const questionsList = document.getElementById("questions-list");

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    userCamera.srcObject = stream;
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
}

function toggleCamera() {
  if (userCamera.srcObject) {
    userCamera.srcObject.getTracks().forEach(track => track.stop());
    userCamera.srcObject = null;
  } else {
    startCamera();
  }
}

function toggleMicrophone() {
  // Add microphone toggle logic here
}

function displayQuestions() {
  const interviewQuestions = [
    "Tell me about yourself.",
    "What is your experience with HTML, CSS, and JavaScript?",
    "Explain the concept of closures in JavaScript.",
    // Add more questions
  ];

  interviewQuestions.forEach(question => {
    const li = document.createElement("li");
    li.textContent = question;
    questionsList.appendChild(li);
  });
}

toggleCameraButton.addEventListener("click", toggleCamera);
toggleMicButton.addEventListener("click", toggleMicrophone);

// Display interview questions on page load
displayQuestions();
