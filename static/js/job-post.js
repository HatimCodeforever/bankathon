const salaryRange = document.getElementById("salaryRange");
const rangeValue = document.getElementById("rangeValue");

salaryRange.addEventListener("input", function () {
  rangeValue.textContent = salaryRange.value;
});

const jobForm = document.getElementById("jobForm");
const postedJobs = document.getElementById("postedJobs");

jobForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const jobTitle = document.getElementById("jobTitle").value;
  const jobDescription = document.getElementById("jobDescription").value;
  const jobMode = document.getElementById("jobMode").value;

  const jobCard = document.createElement("div");
  jobCard.classList.add("job-card");
  jobCard.innerHTML = `
    <h2>${jobTitle}</h2>
    <p>${jobDescription}</p>
    <p>Job Mode: ${jobMode}</p>
    <p>Salary Range: $${salaryRange.value}</p>
    <h3>Required Skills:</h3>
    ${getSkillsHTML()}
  `;

  postedJobs.appendChild(jobCard);
});

function getSkillsHTML() {
  const skillInputs = document.querySelectorAll(".skill-input");
  let skillsHTML = "<ul>";

  skillInputs.forEach((skillInput) => {
    const skillName = skillInput.querySelector(".skill-name").value;
    const skillWeight = skillInput.querySelector(".skill-weight").value;
    skillsHTML += `<li>${skillName} (Weight: ${skillWeight})</li>`;
  });

  skillsHTML += "</ul>";
  return skillsHTML;
}

function addSkillInput() {
  const skillsSection = document.getElementById("skillsSection");
  const skillInputDiv = document.createElement("div");
  skillInputDiv.className = "skill-input";
  
  const skillNameInput = document.createElement("input");
  skillNameInput.type = "text";
  skillNameInput.className = "skill-name form-style";
  skillNameInput.placeholder = "Enter Skill Name";
  
  const skillWeightInput = document.createElement("select");
  skillWeightInput.className = "skill-weight form-style";
  for (let i = 1; i <= 5; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    skillWeightInput.appendChild(option);
  }
  
  const removeButton = document.createElement("button");
  removeButton.className = "remove-button";
  removeButton.textContent = "X";
  removeButton.onclick = function() {
    skillInputDiv.remove();
  };
  
  skillInputDiv.appendChild(skillNameInput);
  skillInputDiv.appendChild(skillWeightInput);
  skillInputDiv.appendChild(removeButton);
  
  skillsSection.appendChild(skillInputDiv);
}

// Add a default skill input when the page loads
window.onload = function() {
  addSkillInput();
};

function clearSkills() {
  const skillsSection = document.getElementById("skillsSection");
  skillsSection.innerHTML = ""; // Clear skills section
}


$(function() {
  // Initiate Slider
  $('#slider-range').slider({
    range: true,
    min: 5000,
    max: 200000,
    step: 100,
    values: [5000, 75000]
  });

  // Move the range wrapper into the generated divs
  $('.ui-slider-range').append($('.range-wrapper'));

  // Apply initial values to the range container
  $('.range').html('<span class="range-value"><sup>$</sup>' + $('#slider-range').slider("values", 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</span><span class="range-divider"></span><span class="range-value"><sup>$</sup>' + $("#slider-range").slider("values", 1).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</span>');

  // Show the gears on press of the handles
  $('.ui-slider-handle, .ui-slider-range').on('mousedown', function() {
    $('.gear-large').addClass('active');
  });

  // Hide the gears when the mouse is released
  // Done on document just incase the user hovers off of the handle
  $(document).on('mouseup', function() {
    if ($('.gear-large').hasClass('active')) {
      $('.gear-large').removeClass('active');
    }
  });

  // Rotate the gears
  var gearOneAngle = 0,
  gearTwoAngle = 0,
  rangeWidth = $('.ui-slider-range').css('width');

$('.gear-one').css('transform', 'rotate(' + gearOneAngle + 'deg)');
$('.gear-two').css('transform', 'rotate(' + gearTwoAngle + 'deg)');

$('#slider-range').slider({
  slide: function(event, ui) {

    // Update the range container values upon sliding
    $('.range').html('<span class="range-value"><sup>$</sup>' + ui.values[0].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</span><span class="range-divider"></span><span class="range-value"><sup>$</sup>' + ui.values[1].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</span>');

    // Get old value
    var previousVal = parseInt($(this).data('value'));

    // Save new value
    $(this).data({
      'value': parseInt(ui.value)
    });

    // Figure out which handle is being used
    if (ui.values[0] == ui.value) {

      // Left handle
      if (previousVal > parseInt(ui.value)) {
        // value decreased
        gearOneAngle -= 7;
        $('.gear-one').css('transform', 'rotate(' + gearOneAngle + 'deg)');
      } else {
        // value increased
        gearOneAngle += 7;
        $('.gear-one').css('transform', 'rotate(' + gearOneAngle + 'deg)');
      }

    } else {

      // Right handle
      if (previousVal > parseInt(ui.value)) {
        // value decreased
        gearOneAngle -= 7;
        $('.gear-two').css('transform', 'rotate(' + gearOneAngle + 'deg)');
      } else {
        // value increased
        gearOneAngle += 7;
        $('.gear-two').css('transform', 'rotate(' + gearOneAngle + 'deg)');
      }

    }

    if (ui.values[1] === 110000) {
      if (!$('.range-alert').hasClass('active')) {
        $('.range-alert').addClass('active');
      }
    } else {
      if ($('.range-alert').hasClass('active')) {
        $('.range-alert').removeClass('active');
      }
    }
  }
});

// Prevent the range container from moving the slider
$('.range, .range-alert').on('mousedown', function(event) {
  event.stopPropagation();
});

});


let names = ['CEO - Chief Executive Officer',
  'COO (Chief Operating Officer)',
  'CFO (Chief Financial Officer)',
  'CMO (Chief Marketing Officer)',
  'CTO (Chief Technology Officer)',
  'CIO (Chief Information Officer)',
  'CCO (Chief Communications Officer)',
  'CHRO (Chief Human Resources Officer)',
  
  'Vice President (VP)',
  'Director',
  'Manager',
  'Team Lead',
  'Supervisor',
  'Operations and Administration',
  
  'Operations Manager',
  'Office Manager',
  'Administrative Assistant',
  'Receptionist',
  'Facilities Manager',
  'Sales and Marketing',
  
  'Sales Representative',
  'Account Manager',
  'Marketing Manager',
  'Digital Marketing Specialist',
  'Brand Manager',
  'Finance and Accounting',
  
  'Accountant',
  'Financial Analyst',
  'Bookkeeper',
  'Payroll Specialist',
  'Tax Specialist',
  'Human Resources:',
  
  'HR Manager',
  'Talent Acquisition Specialist',
  'Training and Development Manager',
  'Compensation and Benefits Analyst',
  'Information Technology:',
  
  'IT Manager',
  'Network Administrator',
  'Software Engineer',
  'Data Analyst',
  'Systems Analyst',
  'Customer Service and Support:',
  
  'Customer Service Representative',
  'Technical Support Specialist',
  'Help Desk Analyst',
  'Customer Success Manager',
  'Research and Development:',
  
  'Research Scientist',
  'Product Development Engineer',
  'Research Analyst',
  'Legal and Compliance',
  
  'General Counsel',
  'Compliance Officer',
  'Paralegal',
  'Creative and Design',
  
  'Graphic Designer',
  'UX/UI Designer',
  'Art Director',
  'Copywriter',
  'Manufacturing and Operations',
  
  'Production Supervisor',
  'Quality Control Inspector',
  'Operations Analyst',
  'Healthcare and Medical',
  
  'Doctor',
  'Nurse',
  'Medical Technologist',
  'Health Administrator',
  'Education and Training',
  
  'Teacher',
  'Trainer',
  'Education Coordinator',
  'Logistics and Supply Chain',
  
  'Logistics Manager',
  'Supply Chain Analyst',
  'Warehouse Supervisor',
  'Public Relations and Communications',
  
  'Public Relations Specialist',
  'Communications Manager',
  'Media Relations Coordinator',
  'Environmental and Sustainability',
  
  'Environmental Scientist',
  'Sustainability Coordinator',
  'Research and Analytics',
  
  'Data Scientist',
  'Market Research Analyst',
  'Business Analyst',
  'Project Management',
  
  'Project Manager',
  'Scrum Master',
  'Agile Coach',
  'Consulting and Advisory',
  
  'Management Consultant',
  'Financial Advisor',
  'Strategy Analyst',
  'Software Developer',
  'DevOps Engineer',
  'Front-end Developer',
  'Back-end Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'QA Engineer (Quality Assurance)',
  'Systems Architect',
  'Database Administrator',
  'Cloud Engineer',
  'Mobile App Developer',
  'Data Engineer',
  'Machine Learning Engineer',
  'AI Specialist',
  'Security Engineer',
  'Network Engineer',
  'Systems Administrator',
  'Site Reliability Engineer (SRE)',
  'Embedded Software Engineer',
  'Game Developer',
  'Web Developer',
  'Integration Engineer',
  'Automation Engineer',
]

let sortNames = names.sort();

let input = document.getElementById("jobTitle");

input.addEventListener("click", (e) => {
  removeElements();
  for (let i of sortNames) {
    if (i.toLowerCase().startsWith(input.value.toLowerCase()) && input.value != "") {
      let listItem = document.createElement("li");
      listItem.classList.add("list-items");
      listItem.style.cursor = "pointer";
      listItem.setAttribute("onclick", "displayNames('" + i + "')");

      let word = "<b>" + i.substr(0, input.value.length) + "</b>";
      word += i.substr(input.value.length);

      listItem.innerHTML = word;
      document.querySelector(".list").appendChild(listItem);
    }
  }
});

function displayNames(value) {
  input.value = value;
  removeElements()
}

function removeElements() {
  let items = document.querySelectorAll(".list-items");
  items.forEach((item) => {
    item.remove();
  });
}