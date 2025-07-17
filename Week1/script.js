// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const dobInput = document.getElementById("dob");
  const ageOutput = document.getElementById("ageOutput");
  const calcBtn = document.getElementById("calculateAge");
  const form = document.getElementById("registrationForm");
  const formOutput = document.getElementById("formOutput");
  const outputSection = document.getElementById("outputSection");

  // Utility: Calculate age in days
  function calculateAgeInDays(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    if (isNaN(birthDate)) return null;

    const diffTime = today - birthDate;
    const ageInDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return ageInDays;
  }

  // Utility: Check if day is singular or plural
  function formatDaysDisplay(days) {
    return `You have lived ${days.toLocaleString()} ${
      days > 1 ? "days" : "day"
    }`;
  }

  // Show age dynamically, just in we will get of button
  function updateAgeDisplay() {
    const dob = dobInput.value;
    const days = calculateAgeInDays(dob);
    if (days !== null && days >= 0) {
      ageOutput.textContent = formatDaysDisplay(days);
    } else {
      ageOutput.textContent = "";
    }
  }

  // Event: Calculate age on input change
  dobInput.addEventListener("input", updateAgeDisplay);
  calcBtn.addEventListener("click", updateAgeDisplay);

  // Event: Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      firstName: document.getElementById("firstName").value.trim(),
      secondName: document.getElementById("secondName").value.trim(),
      surname: document.getElementById("surname").value.trim(),
      idNumber: document.getElementById("idNumber").value.trim(),
      dob: document.getElementById("dob").value,
      state: document.getElementById("state").value,
    };

    // Simple validation
    if (
      !data.firstName ||
      !data.secondName ||
      !data.surname ||
      !data.idNumber ||
      !data.dob ||
      !data.state
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const daysLived = calculateAgeInDays(data.dob);
    const outputText = `
Full Name: ${data.firstName} ${data.secondName} ${data.surname}
ID Number: ${data.idNumber}
Date of Birth: ${data.dob}
State of Origin: ${data.state}
You have lived ${formatDaysDisplay(daysLived)}.
    `.trim();

    formOutput.textContent = outputText;
    outputSection.classList.remove("hidden");
  });
});
