//-----------------
//récupération des API
//*****************

// const fetchCategory = () => {
fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((dataCategories) => console.log(dataCategories));

// };

// const fetchWork = () => {
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((dataWork) => console.log(dataWork));

// };
