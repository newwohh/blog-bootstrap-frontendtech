const form = document.forms["form-name"];
const alertMessage = document.querySelector(".alert");
const msg = document.querySelector("#alertMsg");

const nameInput = document.getElementById("name");
const passwordInput = document.getElementById("password");
const repeatedPasswordInput = document.getElementById("password-repeat");
const emailInput = document.getElementById("email");

alertMessage.style.display = "none";

form.addEventListener("submit", (e) => {
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

  for (let i = 0; i < 3; i++) {
    if (regex[i].test(inputs[i].value) == false) {
      inputs[i].style.borderColor = "red";
      alertMessage.style.display = "block";
      msg.textContent = message[i];
    } else {
      inputs[i].style.borderColor = "green";
      alertMessage.style.display = "none";
    }
  }

  if (
    passwordInput.value == repeatedPasswordInput.value &&
    passwordInput.value.length != 0
  ) {
    window.alert("Hola Amigo!");
  }
});
