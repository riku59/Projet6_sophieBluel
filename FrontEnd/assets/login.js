const mailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitLog = document.querySelector('input[type="submit"');
const errorDisplay = document.getElementById("notFound");

function requestLogin() {
  return fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      // transforme en json
      email: stockEmail,
      password: stockPassword,
    }),
    credentials: "same-origin",
  });
}

//-------------------------------
// Vérification de l'e-mail
//-------------------------------
const emailCheker = (value) => {
  const errorMail = document.querySelector(".log_form span");

  if (
    !value.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)
  ) {
    errorMail.classList.add("errorEmail");
    errorMail.textContent = "Email incorrect";
  } else {
    errorMail.classList.remove("errorEmail");
    errorMail.textContent = "";
  }
};
const emailInput = () => {
  mailInput.addEventListener("input", (e) => {
    emailCheker(e.target.value); // fonction pour vérifier la forme de l'émail.
  });
};
//----------------------------------------------------

// test de l'identifiant + mot de passe
const verifEmailAndPassword = () => {
  submitLog.addEventListener("click", (e) => {
    e.preventDefault();
    stockEmail = mailInput.value;
    stockPassword = passwordInput.value;
    requestLogin()
      .then((Response) => Response.json())
      .then((login) => {
        // si le token est ok,
        if (login.token) {
          localStorage.setItem("token", login.token); //stock le token dans le localStorage
          window.location.href = "./index.html"; // renvoie a la page index.html
        } else {
          errorDisplay.textContent = "Identifiant ou Mot de passe incorrect";
          errorDisplay.classList.add("notFound");
        }
      });
  });
};
emailInput();
verifEmailAndPassword();
