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
    // console.log(categorie);
    addButtonFilter.setAttribute("id", categorie.name);
    // console.log(addButtonFilter);
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
  const imageInput = document.getElementById("file");

  const title = titleInput.value;
  const category = categoryInput.value;
  const image = imageInput.files[0];

  console.log(title);
  console.log(category);
  console.log(image.name);

  if (!title || !category || !image) {
    alert("Veuillez remplir tous les champs pour ajouter un nouveau projet.");
    return;
  }

  const formData = new FormData();
  formData.append("image", image, image.name);
  formData.append("title", title);
  formData.append("category", category);

  console.log([...formData]);
  // await fetchAddPhoto(formData);
  const token = localStorage.getItem(`token`);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log("La photo a été ajoutée avec succès.");

      titleInput.value = "";
      categoryInput.value = "";
      imageInput.value = "";

      displayWorks();
    } else {
      if (response.status === 401) {
        console.error("Erreur : Unauthorized");
        alert("Erreur : Unauthorized");
      } else if (response.status === 400) {
        try {
          const errorData = await response.json();
          console.error("Erreur 400 :", errorData);
          alert(`Erreur : ${errorData.error.message}`);
        } catch (error) {
          console.error(
            "Erreur lors de la conversion de la réponse en JSON :",
            error
          );
          alert("Une erreur s'est produite lors de l'ajout de la photo.");
        }
      } else {
        console.error(
          "Une erreur s'est produite lors de l'ajout de la photo. Code de statut :",
          response.status
        );
        alert("Une erreur s'est produite lors de l'ajout de la photo.");
      }
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors de la requête API :", error);
  }
};

const submitForm = document.querySelector(".formAddPicture");
submitForm.addEventListener("submit", addNewPicture);
// const fetchAddPhoto = async (formData) => {
//   const response = await fetch("http://localhost:5678/api/works", {
//     method: "POST",
//     body: formData,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   if (response.ok) {
//     console.log("La photo a été ajoutée avec succès.");
//   } else {
//     console.error("Une erreur s'est produite lors de l'ajout de la photo.");
//   }
//   return;
// };

const openAddphotoModal = () => {
  returnModal.addEventListener("click", () => {
    const buttonAddPhoto = document.getElementById("add_photo");

    buttonAddPhoto.style.display = "block";
    buttonValid.style.display = "none";
    openGalerieModal();
  });

  const buttonAddPhoto = document.getElementById("add_photo");
  const buttonValid = document.getElementById("valid");
  const suppAllGalery = document.getElementById("DeleteAllGalerie");

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
  const inputCategory = document.getElementById("categorie");
  const valid = document.getElementById("valid");
  const picture = document.getElementById("file");

  // valid.addEventListener("click", () => {
  if (picture.files.length === 0) {
    // alert("Veuillez selectionner une photo.");
    return false;
  }
  if (inputTitlePicture.value.trim() === "") {
    // alert("Veuillez ajouter un titre a la photo.");
    return false;
  }

  if (inputCategory.value === "") {
    // alert("veuillez choisir une des catégories.");
    return false;
  }

  // si tous est ok :
  return true;
  // });
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
  checkerAddWork();
  // addPictureDisplay;
})();
