import "./styles/style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /*html*/ `
    <div class="mobile-container">
      <header>
        <input type="text" id="search-term" placeholder="search your meal" />
        <button id="search"><i class="bx bx-search"></i></button>
      </header>
      <div class="fav-container">
        <h3>Favorite Meal</h3>
        <ul class="fav-meals" id="fav-meals"></ul>
      </div>
      <div class="meals" id="meals"></div>
    </div>

`;

const mealsEl = document.getElementById("meals") as HTMLElement;
const favoriteContainer = document.getElementById("fav-meals") as HTMLElement;

const searchTerm = document.getElementById("search-term") as HTMLInputElement;
const searchBtn = document.getElementById("search") as HTMLButtonElement;

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );

  const respData = await resp.json();
  const randomMeal = respData.meals[0];

  console.log(randomMeal);

  addMeal(randomMeal, true);
}

async function getMealById(id: string) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );

  const respData = await resp.json();

  const meal = respData.meals[0];

  return meal;
}

async function getMealsBySearch(term: string) {
  const mealsResponse = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  const mealsData = await mealsResponse.json();
  const meals = mealsData.meals;

  return meals;
}

function addMeal(mealData: any, random = false) {
  const meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = /*html*/ `
  <div class="meal-header">
    ${random ? `<span class="random">Random Recipe</span>` : ``}
  
    <img
      src="${mealData.strMealThumb}"
      alt="${mealData.strMeal}"
    />
  </div>
  <div class="meal-body">
    <h4>${mealData.strMeal}</h4>
    <button class="fav-btn">
      <i class="bx bxs-heart"></i>
    </button>
  </div>
  `;
  const btn = meal.querySelector(".meal-body .fav-btn") as HTMLButtonElement;

  btn.addEventListener("click", () => {
    const mealId = mealData.idMeal;
    if (btn.classList.contains("active")) {
      removeMealLS(mealId);
      btn.classList.remove("active");
    } else {
      addMealLS(mealId);
      btn.classList.add("active");
    }

    // clean the container
    favoriteContainer.innerHTML = "";
    fetchFavMeals();
  });

  meal.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  mealsEl.appendChild(meal);
}

function addMealLS(mealId: string) {
  const mealIds = getMealsLS();

  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId: string) {
  const mealIds = getMealsLS();

  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id: string) => id !== mealId))
  );
}

function getMealsLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds") || "[]");

  return mealIds;
}

async function fetchFavMeals() {
  const mealIds = getMealsLS();

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    const meal = await getMealById(mealId);

    addMealFav(meal);
  }
}

function addMealFav(mealData: any) {
  const favMeal = document.createElement("li");

  favMeal.innerHTML = /*html*/ `
  <img
    src="${mealData.strMealThumb}"
    alt="${mealData.strMeal}"
  /><span>${mealData.strMeal}</span>
 
  `;

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-fav-btn");
  removeBtn.innerText = "Remove";

  removeBtn.addEventListener("click", () => {
    removeMealLS(mealData.idMeal);

    favMeal.remove();
  });

  favMeal.appendChild(removeBtn);
  favoriteContainer.appendChild(favMeal);
}

// clear
searchBtn.addEventListener("click", async () => {
  const search = searchTerm.value;
  const meals = await getMealsBySearch(search);

  if (meals) {
    mealsEl.innerHTML = "";
    meals.forEach((meal) => {
      addMeal(meal);
    });
  }
});
