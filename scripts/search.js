// Методы, которые могут пригодиться:
// starWars.searchCharacters(query)
// starWars.searchPlanets(query)
// starWars.searchSpecies(query)
// starWars.getFilmsById(id)
// starWars.getPlanetsById(id)
// starWars.getCharactersById(id)
// starWars.getSpeciesById(id)

// Тут ваш код.

const searchInput = document.querySelector(".input");
const searchInputId = document.querySelector(".inputId");

const searchButton = document.querySelector("#byQueryBtn");
const searchButtonById = document.querySelector("#byQueryId");

const deleteButton = document.querySelector(".delete");

const resultContainer = document.querySelector("#result-container");
const messageHeader = document.querySelector(".message-header > p");
const contentBlock = document.querySelector("#content");

const spinner = document.querySelector(".spinner");

const searchType = document.querySelector("#searchType");
const searchTypeId = document.querySelector("#searchTypeId");

function showSpinner() {
  spinner.style.visibility = "visible";
}

function hideSpinner() {
  spinner.style.visibility = "hidden";
}

function closeResultContainer() {
  resultContainer.style.visibility = "hidden";
  searchInput.value = null;
  searchInputId.value = null;
}

function handleError(error) {
  messageHeader.innerHTML = `Error: ${error.name}`;
  contentBlock.innerHTML = `<p>${error.message}</p>`;
}

function validateArray(array) {
  return Array.isArray(array) && array.length > 0;
}

async function getFilms(filmsUrls) {
  if (validateArray(filmsUrls)) {
    const filmsTitles = [];
    for (const url of filmsUrls) {
      const filmId = url.match(/\/([0-9]*)\/$/)[1];
      const filmsData = await starWars.getFilmsById(filmId);
      filmsTitles.push(filmsData.title);
    }
    return filmsTitles;
  }
}

async function getCharacters(charactersUrls) {
  if (validateArray(charactersUrls)) {
    const charactersNames = [];
    for (const url of charactersUrls) {
      const characterId = url.match(/\/([0-9]*)\/$/)[1];
      const characterData = await starWars.getCharactersById(characterId);
      charactersNames.push(characterData.name);
    }
    return charactersNames;
  }
}

async function getPlanet(planetUrl) {
  if (planetUrl) {
    const planetId = planetUrl.match(/\/([0-9]*)\/$/)[1];
    const planetData = await starWars.getPlanetsById(planetId);
    return planetData.name;
  } else {
    return "Unknown";
  }
}

async function getSpecies(speciesUrl) {
  if (validateArray(speciesUrl)) {
    const speciesId = speciesUrl[0].match(/\/([0-9]*)\/$/)[1];
    const speciesData = await starWars.getSpeciesById(speciesId);
    return speciesData.name;
  } else {
    return "Unknown";
  }
}

function createInfoHTML(data, type) {
  let html = "";

  if (type === "character") {
    html = `
        <p>Name: ${data.name}</p>
        <p>Height: ${data.height}</p>
        <p>Mass: ${data.mass}</p>
        <p>Hair Color: ${data.hair_color}</p>
        <p>Skin Color: ${data.skin_color}</p>
        <p>Eye Color: ${data.eye_color}</p>
        <p>Birth Year: ${data.birth_year}</p>
        <p>Gender: ${data.gender}</p>
        <p>Homeworld: ${data.homeworld}</p>
        <p>Species: ${data.species}</p>
        <p>Films:</p>
        <ul>
          ${
            Array.isArray(data.films)
              ? data.films.map((film) => `<li>${film}</li>`).join("")
              : "Unknown"
          }
        </ul>
        <p>Created: ${new Date(data.created).toLocaleString()}</p>
        <p>Edited: ${new Date(data.edited).toLocaleString()}</p>
      `;
  }
  if (type === "planet") {
    html = `
        <p>Name: ${data.name}</p>
        <p>Rotation period: ${data.rotation_period}</p>
        <p>Orbital period: ${data.orbital_period}</p>
        <p>Diameter: ${data.diameter}</p>
        <p>Climate: ${data.climate}</p>
        <p>Gravity: ${data.gravity}</p>
        <p>Terrain: ${data.terrain}</p>
        <p>Surface water: ${data.surface_water}</p>
        <p>Population: ${data.population}</p>
        <p>Residents:</p>
         <ul>
          ${
            Array.isArray(data.residents)
              ? data.residents.map((people) => `<li>${people}</li>`).join("")
              : "Unknown"
          }
        </ul>
        <p>Films:</p>
        <ul>
          ${
            Array.isArray(data.films)
              ? data.films.map((film) => `<li>${film}</li>`).join("")
              : "Unknown"
          }
        </ul>
        <p>Created: ${new Date(data.created).toLocaleString()}</p>
        <p>Edited: ${new Date(data.edited).toLocaleString()}</p>
        `;
  }

  if (type === "species") {
    html = `
      <p>Name: ${data.name}</p>
      <p>classification: ${data.classification} </p>
      <p>designation: ${data.designation}</p>
      <p>average_height: ${data.average_height}</p>
      <p>skin_colors: ${data.skin_colors}</p>
      <p>hair_colors: ${data.hair_colors}</p>
      <p>eye_colors: ${data.eye_colors}</p>
      <p>average_lifespan: ${data.average_lifespan}</p>
      <p>homeworld: ${data.homeworld}</p>
      <p>language: ${data.language}</p>
      <p>people: </p>
        <ul>
          ${
            Array.isArray(data.people)
              ? data.people.map((people) => `<li>${people}</li>`).join("")
              : "Unknown"
          }
        </ul>
      <p>films: </p>
        <ul>
          ${
            Array.isArray(data.films)
              ? data.films.map((film) => `<li>${film}</li>`).join("")
              : "Unknown"
          }
        </ul>
      <p>created: ${new Date(data.created).toLocaleString()}</p>
      <p>edited: ${new Date(data.edited).toLocaleString()}</p>
      `;
  }

  return html;
}

async function searchCharacter(query) {
  try {
    showSpinner();
    resultContainer.style.visibility = "hidden";
    messageHeader.innerHTML = "";
    contentBlock.innerHTML = "";

    const data = await starWars.searchCharacters(query);

    if (validateArray(data.results)) {
      const character = data.results[0];

      character.homeworld = await getPlanet(character.homeworld);

      character.species = await getSpecies(character.species);

      character.films = await getFilms(character.films);

      resultContainer.style.visibility = "visible";
      messageHeader.innerHTML = `${character.name}`;
      contentBlock.innerHTML = createInfoHTML(character, "character");
    } else {
      resultContainer.style.visibility = "visible";
      contentBlock.innerHTML = `<p>Character not found</p>`;
    }
  } catch (error) {
    handleError(error);
  } finally {
    hideSpinner();
  }
}

async function searchPlanet(query) {
  try {
    showSpinner();
    resultContainer.style.visibility = "hidden";
    messageHeader.innerHTML = "";
    contentBlock.innerHTML = "";

    const data = await starWars.searchPlanets(query);

    if (validateArray(data.results)) {
      const planet = data.results[0];

      planet.residents = await getCharacters(planet.residents);

      planet.films = await getFilms(planet.films);

      resultContainer.style.visibility = "visible";
      messageHeader.innerHTML = `${planet.name}`;
      contentBlock.innerHTML = createInfoHTML(planet, "planet");
    } else {
      resultContainer.style.visibility = "visible";
      contentBlock.innerHTML = `<p>Planet not found</p>`;
    }
  } catch (error) {
    handleError(error);
  } finally {
    hideSpinner();
  }
}

async function searchRaces(query) {
  try {
    showSpinner();
    resultContainer.style.visibility = "hidden";
    messageHeader.innerHTML = "";
    contentBlock.innerHTML = "";

    const data = await starWars.searchSpecies(query);

    if (validateArray(data.results)) {
      const species = data.results[0];

      species.films = await getFilms(species.films);

      species.people = await getCharacters(species.people);

      species.homeworld = await getPlanet(species.homeworld);

      resultContainer.style.visibility = "visible";
      messageHeader.innerHTML = `${species.name}`;
      contentBlock.innerHTML = createInfoHTML(species, "species");
    } else {
      resultContainer.style.visibility = "visible";
      contentBlock.innerHTML = `<p>Species not found</p>`;
    }
  } catch (error) {
    handleError(error);
  } finally {
    hideSpinner();
  }
}

async function searchCharacterById(id) {
  try {
    showSpinner();
    resultContainer.style.visibility = "hidden";
    messageHeader.innerHTML = "";
    contentBlock.innerHTML = "";

    const character = await starWars.getCharactersById(id);

    if (!character || character.detail === "Not found") {
      // Проверка на случай, если API возвращает объект с деталью "Not found"
      resultContainer.style.visibility = "visible";
      contentBlock.innerHTML = `<p>Character not found</p>`;
      return;
    }

    character.homeworld = await getPlanet(character.homeworld);

    character.species = await getSpecies(character.species);

    character.films = await getFilms(character.films);

    resultContainer.style.visibility = "visible";
    messageHeader.innerHTML = `${character.name}`;
    contentBlock.innerHTML = createInfoHTML(character, "character");
  } catch (error) {
    handleError(error);
  } finally {
    hideSpinner();
  }
}

async function searchPlanetById(id) {
  try {
    showSpinner();
    resultContainer.style.visibility = "hidden";
    messageHeader.innerHTML = "";
    contentBlock.innerHTML = "";

    const planet = await starWars.getPlanetsById(id);

    if (!planet || planet.detail === "Not found") {
      // Проверка на случай, если API возвращает объект с деталью "Not found"
      resultContainer.style.visibility = "visible";
      contentBlock.innerHTML = `<p>Planet not found</p>`;
      return;
    }

    planet.residents = await getCharacters(planet.residents);

    planet.films = await getFilms(planet.films);

    resultContainer.style.visibility = "visible";
    messageHeader.innerHTML = `${planet.name}`;
    contentBlock.innerHTML = createInfoHTML(planet, "planet");
  } catch (error) {
    handleError(error);
  } finally {
    hideSpinner();
  }
}

async function searchRacesById(id) {
  try {
    showSpinner();
    resultContainer.style.visibility = "hidden";
    messageHeader.innerHTML = "";
    contentBlock.innerHTML = "";

    const species = await starWars.getSpeciesById(id);

    if (!species || species.detail === "Not found") {
      // Проверка на случай, если API возвращает объект с деталью "Not found"
      resultContainer.style.visibility = "visible";
      contentBlock.innerHTML = `<p>Species not found</p>`;
      return;
    }

    species.films = await getFilms(species.films);

    species.people = await getCharacters(species.people);

    species.homeworld = await getPlanet(species.homeworld);

    resultContainer.style.visibility = "visible";
    messageHeader.innerHTML = `${species.name}`;
    contentBlock.innerHTML = createInfoHTML(species, "species");
  } catch (error) {
    handleError(error);
  } finally {
    hideSpinner();
  }
}

searchButton.addEventListener("click", () => {
  const searchTypeValue = searchType.value;
  const query = searchInput.value.trim();
  if (query) {
    if (searchTypeValue === "character") {
      searchCharacter(query);
    } else if (searchTypeValue === "planet") {
      searchPlanet(query);
    } else if (searchTypeValue === "species") {
      searchRaces(query);
    }
  } else {
    resultContainer.style.visibility = "visible";
    messageHeader.innerHTML = "Empty query";
    contentBlock.innerHTML = `<p>Please enter a search term</p>`;
  }
});

searchButtonById.addEventListener("click", () => {
  const searchTypeValueId = searchTypeId.value;
  const id = searchInputId.value.trim();
  if (id) {
    if (searchTypeValueId === "character") {
      searchCharacterById(id);
    } else if (searchTypeValueId === "planet") {
      searchPlanetById(id);
    } else if (searchTypeValueId === "species") {
      searchRacesById(id);
    }
  } else {
    resultContainer.style.visibility = "visible";
    messageHeader.innerHTML = "Empty query";
    contentBlock.innerHTML = `<p>Please enter a search term</p>`;
  }
});

deleteButton.addEventListener("click", () => {
  closeResultContainer();
});
