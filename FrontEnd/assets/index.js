const galery = document.querySelector(".gallery");
const portFolio = document.getElementById("portfolio");
const token = localStorage.getItem("token");
const modalBody = document.querySelector(".modal-body");
const titleGalery = document.getElementById("modal-title");
const returnModal = document.querySelector(".return-modal");
const modifPortfolio = document.querySelector(".modif-portfolio");
const formAddPicture = document.querySelector(".formAddPicture");
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
  // console.log(createWorkElement(works[0]));
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
    addButtonFilter.setAttribute("id", categorie.id);
    // console.log(addButtonFilter);
    addButtonFilter.addEventListener("click", (event) => {
      console.log(event);
      const idCategorie = event.target.id;

      let objetWork = null;
      if (idCategorie == -1) {
        console.log(idCategorie);
        objetWork = works;
      } else {
        objetWork = works.filter(function (objet) {
          console.log(idCategorie);
          return objet.category.id == idCategorie;
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
  // console.log(work);
  const workDecoded = await work.json();
  // console.log(workDecoded);
  return workDecoded;
};

//--------------------- */

// modelage de la partie gallery
const displayWorks = async () => {
  const works = await fetchWork();
  galery.innerHTML = "";
  works.forEach((work, index) => {
    const workElement = createWorkElement(work);
    galery.appendChild(workElement);
  });
};

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

  // console.log(work.id);
  if (modal) {
    // viewElement.classList.add("modal-work");
    figCaption.innerText = "éditer";

    const divIconDelete = document.createElement("div");
    const iconDelete = document.createElement("i");

    divIconDelete.classList.add("divDeleteFigure");
    iconDelete.classList.add("fas", "fa-trash-can", "deleteFigure");
    iconDelete.setAttribute("id", `${work.id}`);

    viewElement.appendChild(divIconDelete);
    divIconDelete.appendChild(iconDelete);

    console.log("modal");
  } else {
    figCaption.innerText = work.title;
    console.log("no-modal");
  }

  figCaption.textContent = work.title;

  viewElement.appendChild(image);
  viewElement.appendChild(figCaption);
  return viewElement;
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

const openGalerieModal = async () => {
  const works = await fetchWork();
  console.log(works);
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

  overlay.addEventListener("click", closeGalerieModal);
};

const deleteProjet = () => {
  const galeryModal = document.querySelector(".modal-body");
  galeryModal.addEventListener("click", async (e) => {
    if (e.target.classList.contains("fa-trash-can")) {
      e.preventDefault();
      const selectedPicture =
        e.target.parentNode.parentNode.querySelector("img");
      const pictureId = selectedPicture.getAttribute("data-id");
      console.log(pictureId);
      console.log(selectedPicture);
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
  console.log(response);
  if (response.ok) {
    console.log("La photo a été supprimée avec succès.");
    preventDefault();
  } else {
    console.error(
      "Une erreur s'est produite lors de la suppression de la photo."
    );
  }
  return;
};

const addNewPicture = async (event) => {
  event.preventDefault();

  const titleInput = document.getElementById("titleNewPicture");
  const categoryInput = document.getElementById("categorie");
  const selectedIndex = categoryInput.selectedIndex;
  const selectedcategory = categoryInput.options[selectedIndex];
  console.log(selectedIndex);
  console.log(selectedcategory);

  const imageInput = document.getElementById("file");
  const title = titleInput.value;
  const category = selectedcategory.id;
  const image = imageInput.files[0];

  console.log(imageInput.files);
  console.log(categoryInput);

  console.log(title);

  console.log(categoryInput);

  if (!title || !category || !image) {
    alert("Veuillez remplir tous les champs pour ajouter un nouveau projet.");
    return;
  }

  console.log(categoryInput);
  const formData = new FormData();
  formData.append("image", image, image.name);
  formData.append("title", title);
  formData.append("category", category);

  console.log([...formData]);
  await fetchAddPhoto(formData);
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
    console.log("La photo a été ajoutée avec succès.");
    alert("La photo a été ajoutée avec succès");
  } else {
    console.error("Une erreur s'est produite lors de l'ajout de la photo.");
    alert("Une erreur s'est produite lors de l'ajout de la photo.");
  }
  return;
};

const openAddphotoModal = async () => {
  returnModal.addEventListener("click", () => {
    const buttonAddPhoto = document.getElementById("add_photo");
    const image = document.getElementById("img-preview");
    const inputTitlePicture = document.getElementById("titleNewPicture");
    const categoryInput = document.getElementById("categorie");

    const picture = document.getElementById("file");
    const pictureSelected = picture.files[0];

    image.src = "";
    inputTitlePicture.value = "";
    categoryInput.selectedIndex = 0;
    console.log(pictureSelected);

    buttonAddPhoto.style.display = "block";
    buttonValid.style.display = "none";
    openGalerieModal();
  });
  const categories = await fetchCategories();
  const buttonAddPhoto = document.getElementById("add_photo");
  const buttonValid = document.getElementById("valid");
  const suppAllGalery = document.getElementById("DeleteAllGalerie");
  const categoryInput = document.getElementById("categorie");
  // renvoie vers la modale pour ajouter une photo
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

    categories.forEach((cat) => {
      console.log(cat);
      const option = document.createElement("option");
      option.value = "";
      option.text = cat.name;
      option.setAttribute("id", cat.id);
      categoryInput.appendChild(option);
      console.log(option);
    });
    const inputTitlePicture = document.getElementById("titleNewPicture");
    const selectCategory = document.getElementById("categorie");

    // vérifie que les 3 demande (photo , titre et categorie sont ok
    inputTitlePicture.addEventListener("input", updateValidButton);
    selectCategory.addEventListener("change", updateValidButton);
    inputFile.addEventListener("input", updateValidButton);

    buttonValid.addEventListener("click", addNewPicture);
  });
};

// const addPictureDisplay = () => {

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
  infoPicture.classList.add("display-none");
  icone.classList.add("display-none");
  imgPreview.classList.add("image-preview");
  buttonAddPhoto.style.marginTop = "10px";
});
// };

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

const checkerAddWork = () => {
  const inputTitlePicture = document.getElementById("titleNewPicture");
  const categoryInput = document.getElementById("categorie");
  const selectedIndex = categoryInput.selectedIndex;
  const selectedcategory = categoryInput.options[selectedIndex];
  const picture = document.getElementById("file");
  console.log(selectedcategory.text);

  if (picture.files.length === 0) {
    // alert("Veuillez selectionner une photo.");
    return false;
  }
  if (inputTitlePicture.value.trim() === "") {
    // alert("Veuillez ajouter un titre a la photo.");
    return false;
  }

  if (selectedcategory.text === "") {
    // alert("veuillez choisir une des catégories.");
    return false;
  }

  // si tous est ok :
  console.log("ok");
  return true;
};

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

  // addPictureDisplay;
})();
