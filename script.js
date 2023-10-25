const form = document.forms["form-name"];
const alertMessage = document.querySelector(".alert");
const msg = document.querySelector("#alertMsg");

const nameInput = document.getElementById("name");
const passwordInput = document.getElementById("password");
const repeatedPasswordInput = document.getElementById("password-repeat");
const emailInput = document.getElementById("email");

alertMessage.style.display = "none";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputs = [nameInput, emailInput, passwordInput, repeatedPasswordInput];

  const regex = [
    /^[a-zA-Z ]+$/,
    /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
    /^(?=.*\d)(?=(.*\W){2})(?=.*[a-zA-Z])(?!.*\s).{1,15}$/,
  ];

  const message = [
    "name field that will accept alphabets and only space character between words and total characters in the field should be in between 2 and 30.",
    "Oops! Enter a valid e-mail",
    "At least 1 digit At least 2 special characters At least 1 alphabetic character No blank space",
  ];

  let isValid = true;

  for (let i = 0; i < 3; i++) {
    if (regex[i].test(inputs[i].value) == false) {
      inputs[i].style.borderColor = "red";
      alertMessage.style.display = "block";
      msg.textContent = message[i];
      isValid = false;
    } else {
      inputs[i].style.borderColor = "green";
    }
  }

  if (
    passwordInput.value !== repeatedPasswordInput.value ||
    passwordInput.value.length === 0
  ) {
    alertMessage.style.display = "block";
    msg.textContent = "Passwords do not match.";
    isValid = false;
  }

  if (isValid) {
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName: name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alertMessage.textContent = "User registered successfully!";
      } else {
        alertMessage.textContent = data.error || "An error occurred.";
      }
    } catch (error) {
      console.error("Error:", error);
      alertMessage.textContent = "An error occurred.";
    }
  }
});
