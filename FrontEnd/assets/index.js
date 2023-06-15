const galery = document.querySelector(".gallery");
const portFolio = document.getElementById("portfolio");
let categories = [];
let work = [];

//-----------------
//récupération des API
//*****************

const fetchCategory = async () => {
  await fetch("http://localhost:5678/api/categories")
    .then((response) => response.json()) //Méthode .json() => méthode qui renvoie le body de la requête.
    .then((dataCategories) => (categories = dataCategories));

  console.log(categories);
  const buttonDiv = document.createElement("div");
  const addButton = document.createElement("button");
  addButton.classList.add("button_form");
  buttonDiv.classList.add("button_div");
  addButton.textContent = " Tous";

  portFolio.appendChild(buttonDiv);
  categories.forEach((categorie) => {
    const addButton = document.createElement("button");
    buttonDiv.appendChild(addButton);
    addButton.classList.add("button_form");
    addButton.textContent = categorie.name;
    buttonDiv.classList.add("button_div");
  });
  buttonDiv.appendChild(addButton);
};

const fetchWork = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json()) //Méthode .json() => méthode qui renvoie le body de la requête.
    .then((dataWork) => (work = dataWork));

  console.log(work);
};

const display = async () => {
  await fetchCategory();
  await fetchWork();
  galery.innerHTML = work
    .map(
      (projet) =>
        `
      <figure>
        <img src=${projet.imageUrl} alt="photo de ${projet.title}">
        <figcaption>${projet.title}</figcaption>
      </figure>
  `
    )
    .join("");
};
display();
