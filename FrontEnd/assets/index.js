let categories = [];
let work = [];
const galery = document.querySelector(".gallery");

//-----------------
//récupération des API
//*****************

const fetchCategory = async () => {
  await fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((dataCategories) => (categories = dataCategories));

  console.log(categories);
};

const fetchWork = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
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
