import "./styles/style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /*html*/ `
    <div class="mobile-container">
      <header>
        <input type="text" class="text" placeholder="Search your Meal" />
        <button id="search"><i class="bx bx-search"></i></button>
      </header>
      <div class="fav-container">
        <h3>Favorite Meal</h3>
        <ul class="fav-meals" id="fav-meals">
   
        </ul>
      </div>
      <div class="meals" id="meals">
        
        
      </div>
    </div>

`;

const meals = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals");

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
      removeMealLS(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addMealLS(mealData.idMeal);
      btn.classList.add("active");
    }
    
  });


  meals.appendChild(meal);
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

  return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
  const mealIds = getMealsLS();

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    const meal = await getMealById(mealId);

    addMealFav(meal);
  }

  // add them to the screen
}

function addMealFav(mealData) {
  const favMeal = document.createElement("li");
  
  favMeal.innerHTML = /*html*/ `
  <img
    src="${mealData.strMealThumb}"
    alt="${mealData.strMeal}"
  /><span>${mealData.strMeal}</span>
 
  `;

  favoriteContainer.appendChild(meal);
}
