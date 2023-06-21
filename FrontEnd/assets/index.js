const galery = document.querySelector(".gallery");
const portFolio = document.getElementById("portfolio");
const token = localStorage.getItem("token");
const buttonLog = document.getElementById("buttonLog");

console.log(buttonLog);
console.log(token);
let work = [];

//-----------------
//récupération API Categories (pour les filtres)
//*****************
const fetchCategories = async () => {
  const categories = await fetch("http://localhost:5678/api/categories");
  // console.log(categories);
  const categoriesDecoded = await categories.json();
  // console.log(categoriesDecoded);
  return categoriesDecoded;
};
//-------------------------------- */

//Création des boutons
// création bouton "tous"
const displayCategories = async () => {
  const categoriesFilter = document.getElementById("categoriesFilter");
  const categories = await fetchCategories();
  // console.log(categories);
  const addButton = document.createElement("button");
  categoriesFilter.appendChild(addButton);
  addButton.classList.add("button_form");
  addButton.classList.add("button_select");
  categoriesFilter.classList.add("portfolio_button");
  addButton.textContent = " Tous";
  // au click sur le bouton "tous" , affiche moi toute la gallerie.
  addButton.addEventListener("click", () => {
    display();
  });

  //***********************************
  //création bouton "filters"

  categories.forEach((categorie) => {
    const addButton = document.createElement("button");
    categoriesFilter.appendChild(addButton);
    addButton.classList.add("button_form");
    addButton.textContent = categorie.name;
    console.log(categorie);

    addButton.addEventListener("click", () => {
      console.log("click");

      if (categorie.name == "Hotels & restaurants") {
        console.log("Hotel !");
        displayHotel();
      }
      if (categorie.name == "Objets") {
        console.log("Objet!");
        displayObjet();
      }
      if (categorie.name == "Appartements") {
        console.log("Appart!");
        displayApartment();
      }
    });
  });
  categoriesFilter.appendChild(addButton);
};
//******************** */
//-------------------------
//recupération API work ( pour les images du projet)
const fetchWork = async () => {
  const work = await fetch("http://localhost:5678/api/works");
  console.log(work);
  const workDecoded = await work.json();
  console.log(workDecoded);
  displayWork = workDecoded;
  console.log(displayWork);
  displayWork.forEach((e) => {
    // récupere la catégory de l'oeuvre
    const categorieWork = e.category.name;
    console.log(categorieWork);
  });
  // filtre la catégorie appartement.
  //******************* */
  const apartmentWork = displayWork.filter(function (apartment) {
    return apartment.category.name == "Appartements";
  });
  // console.log(apartmentWork);
  displayfilterAp = apartmentWork;
  //************************* */

  // filtre la partie Objets
  //*********************** */
  const objetWork = displayWork.filter(function (objet) {
    return objet.category.name == "Objets";
  });
  displayFilterObjet = objetWork;
  // console.log(displayFilterObjet);
  //***************************** */

  // filtre la partie Hotels & restaurant
  //********************************** */
  const hotelWork = displayWork.filter(function (objet) {
    return objet.category.name == "Hotels & restaurants";
  });
  displayFilterHotel = hotelWork;
  // console.log(displayFilterHotel);
};

//--------------------- */

// modelage de la partie gallery
const display = async () => {
  await fetchCategories();
  await fetchWork();
  galery.innerHTML = displayWork
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

const displayApartment = async () => {
  galery.innerHTML = displayfilterAp
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

const displayObjet = async () => {
  galery.innerHTML = displayFilterObjet
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
const displayHotel = async () => {
  galery.innerHTML = displayFilterHotel
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

//------------------------------ */
// ajout du Logout et de la mise en page
//------------------------------ */

const admin = () => {
  if (token) {
    const header = document.querySelector("header");
    const adminHead = document.querySelector(".admin-header");
    const modifIntro = document.querySelector(".modif-intro");
    const modifPortfolio = document.querySelector(".modif-portfolio");
    buttonLog.textContent = "logout";
    adminHead.style.display = "flex";
    header.style.marginTop = "100px";
    modifIntro.style.display = "flex";
    modifPortfolio.style.display = "flex";
  }
};
buttonLog.addEventListener("click", () => {
  if (token) {
    localStorage.removeItem("token");
  }
});

admin();
display();
(function Main() {
  displayCategories();
})();
