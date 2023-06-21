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

const mailInput = document.getElementById("email");
// console.log(mailInput);
const passwordInput = document.getElementById("password");
// console.log(passwordInput);
const submitLog = document.querySelector('input[type="submit"');
const errorDisplay = document.getElementById("notFound");
// console.log(submitLog);
// console.log(errorDisplay);

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

mailInput.addEventListener("input", (e) => {
  console.log(e.target.value);
  emailCheker(e.target.value); // fonction pour vérifier la forme de l'émail.
});

//----------------------------------------------------

passwordInput.addEventListener("input", (e) => {
  console.log(e.target.value);
});

// test de l'identifiant + mot de passe
submitLog.addEventListener("click", (e) => {
  e.preventDefault();
  stockEmail = mailInput.value;
  stockPassword = passwordInput.value;
  requestLogin()
    .then((Response) => Response.json())
    .then((login) => {
      console.log(login); //envoie le UserID et le token lorsque l'identifiant est bon.
      if (login.token) {
        localStorage.setItem("token", login.token); //stock le token dans le localStorage
        window.location.href = "./index.html"; // renvoie a la page index.html
        console.log("Utilisateur connécté");
      } else {
        console.error(" token introuvable");
        errorDisplay.textContent = "Identifiant ou Mot de passe incorrect";
        errorDisplay.classList.add("notFound");
      }
    });
});
