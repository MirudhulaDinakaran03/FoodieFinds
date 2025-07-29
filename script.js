const recipeContainer = document.getElementById('recipe-container');
const modal = document.getElementById('recipe-modal');
const modalBody = document.getElementById('modal-body');

// Search Recipes (accepts default ingredient)
async function searchRecipes(defaultIngredient) {
  let query = defaultIngredient || document.getElementById('searchInput').value.trim();
  if (!query) query = "chicken";

  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`);
  const data = await res.json();
  recipeContainer.innerHTML = "";

  if (data.meals) {
    data.meals.forEach(meal => {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.innerHTML = `
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
        <button onclick="viewRecipe('${meal.idMeal}')">View Details</button>
      `;
      recipeContainer.appendChild(card);
    });
  } else {
    recipeContainer.innerHTML = `<p>No recipes found for <b>${query}</b>!</p>`;
  }
}

// Handle dropdown selection
function selectIngredient() {
  const ingredient = document.getElementById('ingredientDropdown').value;
  if (ingredient) {
    document.getElementById('searchInput').value = ingredient;
    searchRecipes(ingredient);
  }
}

// View Recipe Details
async function viewRecipe(id) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await res.json();
  const meal = data.meals[0];

  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
    }
  }

  modalBody.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}">
    <h3>Ingredients:</h3>
    <ul>${ingredients}</ul>
    <h3>Instructions:</h3>
    <p>${meal.strInstructions}</p>
    <button onclick="saveBookmark('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')">⭐ Save Recipe</button>
  `;
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

// Save Recipe to Bookmarks
function saveBookmark(id, name, img) {
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  if (!bookmarks.find(b => b.id === id)) {
    bookmarks.push({ id, name, img });
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    alert("Recipe saved!");
  } else {
    alert("Already saved!");
  }
}

// Display Bookmarks
function displayBookmarks() {
  const container = document.getElementById('bookmark-container');
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  container.innerHTML = "";

  if (bookmarks.length === 0) {
    container.innerHTML = "<p>No saved recipes yet!</p>";
    return;
  }

  bookmarks.forEach(b => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <img src="${b.img}">
      <h3>${b.name}</h3>
      <button onclick="viewRecipe('${b.id}')">View Details</button>
    `;
    container.appendChild(card);
  });
}
