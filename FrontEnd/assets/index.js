const galery = document.querySelector(".gallery");
const portFolio = document.getElementById("portfolio");
const token = localStorage.getItem("token");
const modalBody = document.querySelector(".modal-body");
const titleGalery = document.getElementById("modal-title");
const returnModal = document.querySelector(".return-modal");
const modifPortfolio = document.querySelector(".modif-portfolio");
const formAddPicture = document.querySelector(".formAddPicture");

//-----------------
//récupération API Categories (pour les filtres)
//*****************
const fetchCategories = async () => {
  const categories = await fetch("http://localhost:5678/api/categories");
  const categoriesDecoded = await categories.json();
  return categoriesDecoded;
};
//-------------------------------- */

//Création des boutons
// création bouton "tous"
const displayCategories = async () => {
  const categoriesFilter = document.getElementById("categoriesFilter");
  const categories = await fetchCategories();
  const works = await fetchWork();

  categories.unshift({ id: -1, name: "Tous" });
  //***********************************
  //création bouton "filters"

  categories.forEach((categorie) => {
    const addButtonFilter = document.createElement("button");
    categoriesFilter.appendChild(addButtonFilter);
    addButtonFilter.classList.add("button_form");
    addButtonFilter.textContent = categorie.name;
    addButtonFilter.setAttribute("id", categorie.id);
    addButtonFilter.addEventListener("click", (event) => {
      const idCategorie = event.target.id;
      let objetWork = null;

      if (idCategorie == -1) {
        objetWork = works;
      } else {
        objetWork = works.filter(function (objet) {
          return objet.category.id == idCategorie;
        });
      }
      // vide la galerie pour empécher qu'il se rajoute.
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
  const workDecoded = await work.json();

  return workDecoded;
};

//--------------------- */

// récupération et affichage des projet
const displayWorks = async () => {
  const works = await fetchWork();
  galery.innerHTML = "";
  works.forEach((work, index) => {
    const workElement = createWorkElement(work);
    galery.appendChild(workElement);
  });
};
// modélage de la partie gallery et modal
const createWorkElement = (work, modal = false) => {
  const viewElement = document.createElement("figure");
  const image = document.createElement("img");
  const figCaption = document.createElement("figcaption");

  if (work === undefined) {
    return;
  }
  viewElement.setAttribute("id", work.id);
  image.setAttribute("src", work.imageUrl);
  image.setAttribute("alt", work.title);
  image.setAttribute("data-id", work.id);

  // si on est sur la modal :
  if (modal) {
    figCaption.innerText = "éditer";
    const divIconDelete = document.createElement("div");
    const iconDelete = document.createElement("i");

    divIconDelete.classList.add("divDeleteFigure");
    iconDelete.classList.add("fas", "fa-trash-can", "deleteFigure");
    iconDelete.setAttribute("id", `${work.id}`);

    viewElement.appendChild(divIconDelete);
    divIconDelete.appendChild(iconDelete);

    // sur la page principal :
  } else {
    figCaption.innerText = work.title;
  }

  viewElement.appendChild(image);
  viewElement.appendChild(figCaption);
  return viewElement;
};

//------------------------------ */
// ajout du Logout et de la mise en page
//------------------------------ */

// mise en forme de la page d'acceuil si on est log
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
// lors du clique sur "lougout" , tu supprime le token si il existe
buttonLog.addEventListener("click", () => {
  if (token) {
    localStorage.removeItem("token");
  }
});
// -----------------------------------
// fonction modal
//-------------------------------------

const openGalerieModal = async () => {
  const works = await fetchWork();

  document.querySelector(".overlay").style.display = "block";
  document.querySelector(".modal").style.display = "block";
  formAddPicture.style.display = "none";
  titleGalery.textContent = "Galerie photo";
  modalBody.innerHTML = "";

  works.forEach((work) => {
    const workElement = createWorkElement(work, true);
    modalBody.appendChild(workElement);
  });

  returnModal.style.display = "none";

  // ferme la modal si on clique en dehors de la modal.
  const overlay = document.querySelector(".overlay");

  overlay.addEventListener("click", closeGalerieModal);
};
modifPortfolio.addEventListener("click", openGalerieModal);

const deleteProjet = () => {
  const galeryModal = document.querySelector(".modal-body");
  galeryModal.addEventListener("click", async (e) => {
    if (e.target.classList.contains("fa-trash-can")) {
      e.preventDefault();
      const selectedPicture =
        e.target.parentNode.parentNode.querySelector("img");
      const pictureId = selectedPicture.getAttribute("data-id");
      selectedPicture.parentNode.parentNode.removeChild(
        selectedPicture.parentNode
      );
      await fetchDeletePhoto(pictureId);
    }
  });
};

const fetchDeletePhoto = async (photoId) => {
  const response = await fetch(`http://localhost:5678/api/works/${photoId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    await displayWorks();
  } 
  return;
};

const addNewPicture = async (event) => {
  event.preventDefault();

  const titleInput = document.getElementById("titleNewPicture");
  const categoryInput = document.getElementById("categorie");
  const selectedIndex = categoryInput.selectedIndex;
  const selectedcategory = categoryInput.options[selectedIndex];
  const imageInput = document.getElementById("file");
  const title = titleInput.value;
  const category = selectedcategory.id;
  const image = imageInput.files[0];

  if (!title || !category || !image) {
    alert("Veuillez remplir tous les champs pour ajouter un nouveau projet.");
    return;
  }

  const formData = new FormData();
  formData.append("image", image, image.name);
  formData.append("title", title);
  formData.append("category", category);

  await fetchAddPhoto(formData);
  window.location.href = "index.html";
};

const submitForm = document.querySelector(".formAddPicture");
submitForm.addEventListener("submit", addNewPicture);

const fetchAddPhoto = async (formData) => {
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    await displayWorks();
    alert("La photo a été ajoutée avec succès");
  } else {
    alert("Une erreur s'est produite lors de l'ajout de la photo.");
  }
  return;
};

const openAddphotoModal = async () => {
  const buttonValid = document.getElementById("valid");
  const inputTitlePicture = document.getElementById("titleNewPicture");
  const selectCategory = document.getElementById("categorie");
  const inputFile = document.getElementById("file");

  returnToDeleteProject(); // renvoie vers la modale pour supprimer un projet
  modalAddPictureBuild(); // mise en forme de la modal pour ajouter un projet

  // vérifie que les 3 demande (photo , titre et categorie sont ok
  inputTitlePicture.addEventListener("input", updateValidButton);
  selectCategory.addEventListener("change", updateValidButton);
  inputFile.addEventListener("input", updateValidButton);
  //---------------------------------------------------------------------
  // essaye d'ajouter un nouveau projet au click sur le bouton valider.
  buttonValid.addEventListener("click", addNewPicture);
};

const createCategoryForAddPicture = async () => {
  const categories = await fetchCategories();
  const categoryInput = document.getElementById("categorie");

  categories.forEach((cat) => {
    const option = document.createElement("option");

    option.value = "";
    option.text = cat.name;
    option.setAttribute("id", cat.id);
    categoryInput.appendChild(option);
  });
};

const returnToDeleteProject = () => {
  returnModal.addEventListener("click", () => {
    const buttonValid = document.getElementById("valid");
    const buttonAddPhoto = document.getElementById("add_photo");
    const image = document.getElementById("img-preview");
    const inputTitlePicture = document.getElementById("titleNewPicture");
    const categoryInput = document.getElementById("categorie");
    const picture = document.getElementById("file");
    const pictureSelected = picture.files[0];
    const icone = document.querySelector(".icone-img");

    image.style.display = "none";
    inputTitlePicture.value = "";
    categoryInput.selectedIndex = 0;
    icone.classList.add("display-flex");
    image.classList.remove("image-preview");
    buttonAddPhoto.style.display = "block";
    buttonValid.style.display = "none";
    openGalerieModal();
  });
};

const modalAddPictureBuild = () => {
  const buttonAddPhoto = document.getElementById("add_photo");
  const suppAllGalery = document.getElementById("DeleteAllGalerie");
  const buttonValid = document.getElementById("valid");
  const categoryInput = document.getElementById("categorie");

  buttonAddPhoto.addEventListener("click", () => {
    buttonValid.style.background = "rgb(167, 167, 167)";
    formAddPicture.style.display = "flex";
    returnModal.style.display = "block";
    buttonValid.style.display = "block";
    buttonAddPhoto.style.display = "none";
    suppAllGalery.classList.add("display-none");
    titleGalery.textContent = "Ajout photo";
    modalBody.innerHTML = "";
    categoryInput.innerHTML = "";
    const option = document.createElement("option");
    option.value = "";
    option.text = "";
    categoryInput.appendChild(option);

    createCategoryForAddPicture();
    addPictureDisplay();
  });
};

const addPictureDisplay = () => {
  const inputFile = document.getElementById("file");
  const icone = document.querySelector(".icone-img");
  inputFile.addEventListener("change", (e) => {
    if (e.target.files.length == 0) {
      alert("veillez selectionner une photo");
      return false;
    }
    const imgPreview = document.getElementById("img-preview");
    const file = e.target.files[0];
    const urlFile = URL.createObjectURL(file);
    const buttonAddPhoto = document.querySelector(".button-add-picture");
    const infoPicture = document.getElementById("info-add-picture");
    imgPreview.setAttribute("src", urlFile);
    imgPreview.style.display = "flex";
    infoPicture.classList.add("display-none");
    icone.classList.add("display-none");
    icone.classList.remove("display-flex");
    imgPreview.classList.add("image-preview");
    buttonAddPhoto.style.marginTop = "10px";
  });
};

const closeGalerieModal = () => {
  const overlay = document.querySelector(".overlay");
  overlay.style.display = "none";

  document.querySelector(".modal").style.display = "none";
};
// cible la croix et appel closeGalerieModal si elle est cliqué
const closeModifPortfolio = document.querySelector(".fa-xmark");
closeModifPortfolio.addEventListener("click", () => {
  closeGalerieModal();
});

const checkerAddWork = () => {
  const inputTitlePicture = document.getElementById("titleNewPicture");
  const categoryInput = document.getElementById("categorie");
  const selectedIndex = categoryInput.selectedIndex;
  const selectedcategory = categoryInput.options[selectedIndex];
  const picture = document.getElementById("file");

  if (picture.files.length === 0) {
    return false;
  }
  if (inputTitlePicture.value.trim() === "") {
    return false;
  }

  if (selectedcategory.text === "") {
    return false;
  }

  // si tous est ok :
  return true;
};

// change la couleur du bouton valider en vert
const updateValidButton = () => {
  const validButton = document.getElementById("valid");
  const isValid = checkerAddWork();

  if (isValid) {
    validButton.style.background = "#1D6154";
  }
};

(function Main() {
  displayCategories();
  admin();
  displayWorks();
  openAddphotoModal();
  deleteProjet();
  createWorkElement();
})();
