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
}

async function getFilms(filmsUrls) {
  if (filmsUrls.length > 0) {
    const filmsTitles = [];
    for (const url of filmsUrls) {
      const filmId = url.match(/\/([0-9]*)\/$/)[1];
      const filmsData = await starWars.getFilmsById(filmId);
      filmsTitles.push(filmsData.title);
    }
    return filmsTitles;
  } else {
    return "Unknown";
  }
}

async function getCharacters(charactersUrls) {
  if (charactersUrls.length > 0) {
    const charactersNames = [];
    for (const url of charactersUrls) {
      const characterId = url.match(/\/([0-9]*)\/$/)[1];
      const characterData = await starWars.getCharactersById(characterId);
      charactersNames.push(characterData.name);
    }
    return charactersNames;
  } else {
    return "Unknown";
  }
}

async function getPlanet(planetUrl) {
  if (planetUrl.length > 0) {
    const planetId = planetUrl.match(/\/([0-9]*)\/$/)[1];
    const planetData = await starWars.getPlanetsById(planetId);
    return planetData.name;
  } else {
    return "Unknown";
  }
}

async function getSpecies(speciesUrl) {
  if (speciesUrl.length > 0) {
    const speciesId = speciesUrl[0].match(/\/([0-9]*)\/$/)[1];
    const speciesData = await starWars.getSpeciesById(speciesId);
    return speciesData.name;
  } else {
    return "Unknown";
  }
}

async function searchCharacter(query) {
  try {
    showSpinner();
    resultContainer.style.visibility = "hidden";
    messageHeader.innerHTML = "";
    contentBlock.innerHTML = "";

    const data = await starWars.searchCharacters(query);

    if (data.results && data.results.length > 0) {
      const character = data.results[0];

      // Получаем название планеты
      const planetName = await getPlanet(character.homeworld);
      character.homeworld = planetName;

      // Получаем вид персонажа
      const speciesName = await getSpecies(character.species);
      character.species = speciesName;

      // Получаем названия фильмов
      const filmsTitles = await getFilms(character.films);
      character.films = filmsTitles;

      // Создаем HTML-разметку для отображения персонажа
      const characterInfoHTML = `
        <p>Name: ${character.name}</p>
        <p>Height: ${character.height}</p>
        <p>Mass: ${character.mass}</p>
        <p>Hair Color: ${character.hair_color}</p>
        <p>Skin Color: ${character.skin_color}</p>
        <p>Eye Color: ${character.eye_color}</p>
        <p>Birth Year: ${character.birth_year}</p>
        <p>Gender: ${character.gender}</p>
        <p>Homeworld: ${character.homeworld}</p>
        <p>Species: ${character.species}</p>
        <p>Films:</p>
        <ul>
          ${filmsTitles.map((film) => `<li>${film}</li>`).join("")}
        </ul>
        <p>Created: ${new Date(character.created).toLocaleString()}</p>
        <p>Edited: ${new Date(character.edited).toLocaleString()}</p>
      `;

      // Выводим форматированный результат
      resultContainer.style.visibility = "visible";
      messageHeader.innerHTML = `${character.name}`;
      contentBlock.innerHTML = characterInfoHTML;
    } else {
      resultContainer.style.visibility = "visible";
      contentBlock.innerHTML = `<p>Character not found</p>`;
    }
  } catch (error) {
    messageHeader.innerHTML = `Error: ${error.name}`;
    contentBlock.innerHTML = `<p>${error.message}</p>`;
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

    if (data.results && data.results.length > 0) {
      const planet = data.results[0];

      const charactersNames = await getCharacters(planet.residents);
      planet.residents = charactersNames;

      const filmsTitles = await getFilms(planet.films);
      planet.films = filmsTitles;

      const planetInfoHTML = `
        <p>Name: ${planet.name}</p>
        <p>Rotation period: ${planet.rotation_period}</p>
        <p>Orbital period: ${planet.orbital_period}</p>
        <p>Diameter: ${planet.diameter}</p>
        <p>Climate: ${planet.climate}</p>
        <p>Gravity: ${planet.gravity}</p>
        <p>Terrain: ${planet.terrain}</p>
        <p>Surface water: ${planet.surface_water}</p>
        <p>Population: ${planet.population}</p>
        <p>Residents:</p>
        <ul> 
          ${charactersNames
            .map((character) => `<li>${character}</li>`)
            .join("")}
        </ul> 
        <p>Films:</p>
        <ul>
          ${filmsTitles.map((film) => `<li>${film}</li>`).join("")}
        </ul>
        <p>Created: ${new Date(planet.created).toLocaleString()}</p>
        <p>Edited: ${new Date(planet.edited).toLocaleString()}</p>
        `;

      resultContainer.style.visibility = "visible";
      messageHeader.innerHTML = `${planet.name}`;
      contentBlock.innerHTML = planetInfoHTML;
    } else {
      resultContainer.style.visibility = "visible";
      contentBlock.innerHTML = `<p>Planet not found</p>`;
    }
  } catch (error) {
    messageHeader.innerHTML = `Error: ${error.name}`;
    contentBlock.innerHTML = `<p>${error.message}</p>`;
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

    if (data.results && data.results.length > 0) {
      const species = data.results[0];

      const filmsTitles = await getFilms(species.films);
      species.films = filmsTitles;

      const charactersNames = await getCharacters(species.people);
      species.people = charactersNames;

      const planetName = await getPlanet(species.homeworld);
      species.homeworld = planetName;

      const speciesInfoHTML = `
      <p>Name: ${species.name}</p>
      <p>classification: ${species.classification} </p>
      <p>designation: ${species.designation}</p>
      <p>average_height: ${species.average_height}</p>
      <p>skin_colors: ${species.skin_colors}</p>
      <p>hair_colors: ${species.hair_colors}</p>
      <p>eye_colors: ${species.eye_colors}</p>
      <p>average_lifespan: ${species.average_lifespan}</p>
      <p>homeworld: ${species.homeworld}</p>
      <p>language: ${species.language}</p>
      <p>people: </p>
        <ul>
          ${charactersNames
            .map((character) => `<li>${character}</li>`)
            .join("")}
        </ul>
      <p>films: </p>
        <ul>
          ${filmsTitles.map((film) => `<li>${film}</li>`).join("")}
        </ul>
      <p>created: ${new Date(species.created).toLocaleString()}</p>
      <p>edited: ${new Date(species.edited).toLocaleString()}</p>
      `;

      resultContainer.style.visibility = "visible";
      messageHeader.innerHTML = `${species.name}`;
      contentBlock.innerHTML = speciesInfoHTML;
    } else {
      resultContainer.style.visibility = "visible";
      contentBlock.innerHTML = `<p>Species not found</p>`;
    }
  } catch (error) {
    resultContainer.style.visibility = "visible";
    messageHeader.innerHTML = `Error: ${error.name}`;
    contentBlock.innerHTML = `${error.message}`;
    console.log(error);
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

    // Получаем название планеты
    const planetName = await getPlanet(character.homeworld);
    character.homeworld = planetName;

    // Получаем вид персонажа
    const speciesName = await getSpecies(character.species);
    character.species = speciesName;

    // Получаем названия фильмов
    const filmsTitles = await getFilms(character.films);
    character.films = filmsTitles;

    // Создаем HTML-разметку для отображения персонажа
    const characterInfoHTML = `
        <p>Name: ${character.name}</p>
        <p>Height: ${character.height}</p>
        <p>Mass: ${character.mass}</p>
        <p>Hair Color: ${character.hair_color}</p>
        <p>Skin Color: ${character.skin_color}</p>
        <p>Eye Color: ${character.eye_color}</p>
        <p>Birth Year: ${character.birth_year}</p>
        <p>Gender: ${character.gender}</p>
        <p>Homeworld: ${character.homeworld}</p>
        <p>Species: ${character.species}</p>
        <p>Films:</p>
        <ul>
          ${filmsTitles.map((film) => `<li>${film}</li>`).join("")}
        </ul>
        <p>Created: ${new Date(character.created).toLocaleString()}</p>
        <p>Edited: ${new Date(character.edited).toLocaleString()}</p>
      `;

    // Выводим форматированный результат
    resultContainer.style.visibility = "visible";
    messageHeader.innerHTML = `${character.name}`;
    contentBlock.innerHTML = characterInfoHTML;
  } catch (error) {
    messageHeader.innerHTML = `Error: ${error.name}`;
    contentBlock.innerHTML = `<p>${error.message}</p>`;
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

    const charactersNames = await getCharacters(planet.residents);
    planet.residents = charactersNames;

    const filmsTitles = await getFilms(planet.films);
    planet.films = filmsTitles;

    const planetInfoHTML = `
        <p>Name: ${planet.name}</p>
        <p>Rotation period: ${planet.rotation_period}</p>
        <p>Orbital period: ${planet.orbital_period}</p>
        <p>Diameter: ${planet.diameter}</p>
        <p>Climate: ${planet.climate}</p>
        <p>Gravity: ${planet.gravity}</p>
        <p>Terrain: ${planet.terrain}</p>
        <p>Surface water: ${planet.surface_water}</p>
        <p>Population: ${planet.population}</p>
        <p>Residents:</p>
        <ul> 
          ${charactersNames
            .map((character) => `<li>${character}</li>`)
            .join("")}
        </ul> 
        <p>Films:</p>
        <ul>
          ${filmsTitles.map((film) => `<li>${film}</li>`).join("")}
        </ul>
        <p>Created: ${new Date(planet.created).toLocaleString()}</p>
        <p>Edited: ${new Date(planet.edited).toLocaleString()}</p>
        `;

    resultContainer.style.visibility = "visible";
    messageHeader.innerHTML = `${planet.name}`;
    contentBlock.innerHTML = planetInfoHTML;
  } catch (error) {
    messageHeader.innerHTML = `Error: ${error.name}`;
    contentBlock.innerHTML = `<p>${error.message}</p>`;
  } finally {
    hideSpinner();
  }
}

async function searchRacesById(query) {
  try {
    showSpinner();
    resultContainer.style.visibility = "hidden";
    messageHeader.innerHTML = "";
    contentBlock.innerHTML = "";

    const species = await starWars.getSpeciesById(query);

    if (!species || species.detail === "Not found") {
      // Проверка на случай, если API возвращает объект с деталью "Not found"
      resultContainer.style.visibility = "visible";
      contentBlock.innerHTML = `<p>Species not found</p>`;
      return;
    }

    const filmsTitles = await getFilms(species.films);
    species.films = filmsTitles;

    const charactersNames = await getCharacters(species.people);
    species.people = charactersNames;

    const planetName = await getPlanet(species.homeworld);
    species.homeworld = planetName;

    const speciesInfoHTML = `
      <p>Name: ${species.name}</p>
      <p>classification: ${species.classification} </p>
      <p>designation: ${species.designation}</p>
      <p>average_height: ${species.average_height}</p>
      <p>skin_colors: ${species.skin_colors}</p>
      <p>hair_colors: ${species.hair_colors}</p>
      <p>eye_colors: ${species.eye_colors}</p>
      <p>average_lifespan: ${species.average_lifespan}</p>
      <p>homeworld: ${species.homeworld}</p>
      <p>language: ${species.language}</p>
      <p>people: </p>
        <ul>
          ${charactersNames
            .map((character) => `<li>${character}</li>`)
            .join("")}
        </ul>
      <p>films: </p>
        <ul>
          ${filmsTitles.map((film) => `<li>${film}</li>`).join("")}
        </ul>
      <p>created: ${new Date(species.created).toLocaleString()}</p>
      <p>edited: ${new Date(species.edited).toLocaleString()}</p>
      `;

    resultContainer.style.visibility = "visible";
    messageHeader.innerHTML = `${species.name}`;
    contentBlock.innerHTML = speciesInfoHTML;
  } catch (error) {
    resultContainer.style.visibility = "visible";
    messageHeader.innerHTML = `Error: ${error.name}`;
    contentBlock.innerHTML = `${error.message}`;
    console.log(error);
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
