const userCamera = document.getElementById("user-camera");
const toggleCameraButton = document.getElementById("toggle-camera");
// const toggleMicButton = document.getElementById("toggle-mic");
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
                    if (userCamera.srcObject) {
                      userCamera.srcObject.getTracks().forEach(track => track.stop());
                      userCamera.srcObject = null;
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
    captureFrame();
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
startCamera();

toggleCameraButton.addEventListener("click", toggleCamera);
// toggleMicButton.addEventListener("click", toggleMicrophone);

displayQuestions();

// navigator.mediaDevices.getUserMedia({ video: true })
//   .then((stream) => {
//     video.srcObject = stream;
//   })
//   .catch((error) => {
//     console.error('Error accessing the camera:', error);
//   });

