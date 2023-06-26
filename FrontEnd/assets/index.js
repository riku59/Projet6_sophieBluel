const galery = document.querySelector(".gallery");
const portFolio = document.getElementById("portfolio");
const token = localStorage.getItem("token");
const modalBody = document.querySelector(".modal-body");
const titleGalery = document.getElementById("modal-title");
const returnModal = document.querySelector(".return-modal");
const modifPortfolio = document.querySelector(".modif-portfolio");
const formAddPicture = document.querySelector(".modal-footer");
// console.log(buttonLog);
// console.log(token);

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
  const works = await fetchWork();
  console.log("coucou");
  console.log(createWorkElement(works[0]));
  // console.log(categories);

  // au click sur le bouton "tous" , affiche moi toute la gallerie.
  // addButton.addEventListener("click", () => {
  //   display();
  // });

  categories.unshift({ id: -1, name: "Tous" });
  console.log(categories);
  //***********************************
  //création bouton "filters"

  categories.forEach((categorie) => {
    const addButtonFilter = document.createElement("button");
    categoriesFilter.appendChild(addButtonFilter);
    addButtonFilter.classList.add("button_form");
    addButtonFilter.textContent = categorie.name;
    console.log(categorie);
    addButtonFilter.setAttribute("id", categorie.name);
    addButtonFilter.addEventListener("click", (event) => {
      console.log(event);
      const idCategorie = event.target.id;

      let objetWork = null;
      if (idCategorie == "Tous") {
        objetWork = works;
      } else {
        objetWork = works.filter(function (objet) {
          return objet.category.name == idCategorie;
        });
      }

      galery.innerHTML = "";
      objetWork.forEach((work, index) => {
        const workElement = createWorkElement(work);

        galery.appendChild(workElement);
      });
    });
    categoriesFilter.appendChild(addButtonFilter);
  });
};

//******************** */
//-------------------------
//recupération API work ( pour les images du projet)
const fetchWork = async () => {
  const work = await fetch("http://localhost:5678/api/works");
  console.log(work);
  const workDecoded = await work.json();
  console.log(workDecoded);
  return workDecoded;
};

//--------------------- */

// modelage de la partie gallery
const displayWorks = async () => {
  const works = await fetchWork();
  works.forEach((work, index) => {
    const workElement = createWorkElement(work);
    galery.appendChild(workElement);
  });
};

const createWorkElement = (work) => {
  const figureElement = document.createElement("figure");
  const imgElement = document.createElement("img");
  const figCaptionElement = document.createElement("figcaption");
  imgElement.setAttribute("src", work.imageUrl);
  imgElement.setAttribute("alt", work.title);
  figCaptionElement.textContent = work.title;
  figureElement.appendChild(imgElement);
  figureElement.appendChild(figCaptionElement);
  return figureElement;
};

//------------------------------ */
// ajout du Logout et de la mise en page
//------------------------------ */

const admin = () => {
  if (token) {
    const buttonLog = document.getElementById("buttonLog");
    const header = document.querySelector("header");
    const adminHead = document.querySelector(".admin-header");
    const modifIntro = document.querySelector(".modif-intro");
    document.getElementById("categoriesFilter").style.display = "none";
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
// -----------------------------------
// fonction modal
//-------------------------------------

const openGalerieModal = () => {
  document.querySelector(".overlay").style.display = "block";
  document.querySelector(".modal").style.display = "block";
  formAddPicture.style.display = "none";
  titleGalery.textContent = "Galerie photo";
  modalBody.innerHTML = galery.innerHTML;
  const modalFigCaptions = modalBody.querySelectorAll("figcaption");
  returnModal.style.display = "none";
  modalFigCaptions.forEach((figcaption, index) => {
    figcaption.textContent = "éditer ";
  });
  const modalFigures = modalBody.querySelectorAll("figure");
  modalFigures.forEach((figure) => {
    const divIconDelete = document.createElement("div");
    const iconDelete = document.createElement("i");
    iconDelete.classList.add("fa-regular", "fa-trash-can", "deleteFigure");
    figure.appendChild(divIconDelete);
    divIconDelete.appendChild(iconDelete);
    divIconDelete.classList.add("divDeleteFigure");
  });

  overlay.addEventListener("click", closeGalerieModal);
};

const openAddphotoModal = () => {
  returnModal.addEventListener("click", () => {
    openGalerieModal();
  });
  const buttonAddPhoto = document.getElementById("add_photo");
  buttonAddPhoto.addEventListener("click", async () => {
    const createContainerAddPhoto = document.createElement("div");
    const createiconeImg = document.createElement("i");
    const createInputFile = document.createElement("input");
    const createPara = document.createElement("p");
    const createLabel = document.createElement("label");

    createInputFile.setAttribute("type", "file");

    createInputFile.style.display = "none";
    formAddPicture.style.display = "block";
    titleGalery.textContent = "Ajout photo";
    createPara.textContent = "jpg,png : 4mo max";
    createLabel.textContent = "+ Ajouter photo ";
    createiconeImg.classList.add("fa-regular", "fa-image", "icone-img");
    createContainerAddPhoto.classList.add("ContainerAddPhoto");
    createPara.classList.add("info-add-picture");
    createLabel.classList.add("button-add-picture");

    createLabel.addEventListener("click", () => {
      createInputFile.click(); // Simuler le clic sur l'input
    });

    modalBody.innerHTML = "";
    modalBody.appendChild(createContainerAddPhoto);
    createContainerAddPhoto.appendChild(createiconeImg);
    createContainerAddPhoto.appendChild(createInputFile);
    createContainerAddPhoto.appendChild(createLabel);
    createContainerAddPhoto.appendChild(createPara);

    returnModal.style.display = "block";
  });
};

modifPortfolio.addEventListener("click", openGalerieModal);

const overlay = document.querySelector(".overlay");
const closeGalerieModal = () => {
  overlay.style.display = "none";
  document.querySelector(".modal").style.display = "none";
};
const closeModifPortfolio = document.querySelector(".fa-xmark");
closeModifPortfolio.addEventListener("click", () => {
  closeGalerieModal();
});

(function Main() {
  displayCategories();

  admin();
  displayWorks();
  openAddphotoModal();
})();
