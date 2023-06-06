document.querySelector("#search").addEventListener("click", getPokemon);

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getPokemon();
  }
});

async function getPokemon() {
  loadingBox();
  const name = convertToSearch(document.querySelector("#pokemonName").value);
  try {
    // fetching pokemon ID through pokemon species bc the names there usually are correct, and then taking its ID to fetch from the regular pokemon website
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${name}`
    );
    const speciesId = await speciesResponse.json();
    const pokemonId = speciesId.id; // Correct pokemon id

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    const data = await response.json();

    // ADDING ELEMENTS TO HTML
    const pokemonContainer = document.createElement("div");
    pokemonContainer.className = "pokemonContainer";

    const imgElement = document.createElement("img");
    imgElement.src = data.sprites.other["official-artwork"].front_default;
    imgElement.alt = data.name;

    const infoContainer = document.createElement("div");
    infoContainer.className = "pokemonInfo";

    const nameElement = document.createElement("h1");
    nameElement.textContent = toTitleCase(data.name);

    const weightElement = document.createElement("p");
    weightElement.textContent = `Weight: ${data.weight}`;

    const idElement = document.createElement("p");
    idElement.textContent = `Pokemon ID: ${data.id}`;

    const descElement = document.createElement("p");
    descElement.className = "pokemonDescription";

    // CREATE SELECT

    const selectContainer = document.createElement("div");
    selectContainer.id = "select-container";
    const select = document.createElement("select");
    select.id = "my-select";
    const firstOption = document.createElement("option");
    firstOption.value = "none";
    firstOption.text = "Select version";
    select.appendChild(firstOption);
    const speciesData = await getPokemonSpecies(name);
    // console.log(speciesData);

    for (let i = 0; i < speciesData.length; i++) {
      const option = document.createElement("option");
      option.value = speciesData[i].version_name;
      option.text = speciesData[i].version_name;
      select.appendChild(option);
    }

    selectContainer.appendChild(select);

    // Append elements to container
    infoContainer.appendChild(nameElement);
    infoContainer.appendChild(weightElement);
    infoContainer.appendChild(idElement);
    infoContainer.appendChild(selectContainer);

    // Add event listener to the select element
    select.addEventListener("change", function () {
      const selectedOption = select.options[select.selectedIndex].text;
      if (selectedOption === "Select version") {
        descElement.textContent = ` `;
      } else {
        const selectedDesc = speciesData.find(
          (item) => item.version_name === selectedOption
        );

        if (selectedDesc) {
          descElement.textContent = `Description: ${selectedDesc.flavorText}`;
        } else {
          console.log("No description found for selected version");
        }
      }
      infoContainer.appendChild(descElement);
    });

    pokemonContainer.appendChild(imgElement);
    pokemonContainer.appendChild(infoContainer);

    // Replace existing content with new Pokemon container
    const resultsContainer = document.querySelector(".resultsContainer");
    resultsContainer.innerHTML = "";
    resultsContainer.appendChild(pokemonContainer);
  } catch (err) {
    const resultsContainer = document.querySelector(".resultsContainer");
    resultsContainer.innerHTML = "";
    window.alert("Pokemon not found!", err);
  }
}

async function getPokemonSpecies(name) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${name}`
    );
    const data = await response.json();
    const flavorTextAll = data.flavor_text_entries;
    const flavorTextEn = [];
    for (let i = 0; i < flavorTextAll.length; i++) {
      if (flavorTextAll[i].language.name === "en") {
        flavorTextEn.push({
          version_name: flavorTextAll[i].version.name,
          flavorText: convertToRead(flavorTextAll[i].flavor_text),
        });
      }
    }
    return flavorTextEn;
  } catch (err) {
    console.log("Error fetching Pokemon species data", err);
    throw err;
  }
}

function toTitleCase(str) {
  if (!str) {
    return "";
  }
  const strArr = str.split("-").map((word) => {
    return word[0].toUpperCase() + word.substring(1).toLowerCase();
  });
  return strArr.join(" ");
}

function convertToSearch(str) {
  if (!str) {
    return "";
  }
  // This code was adapted from the 'toTitleCase';
  // It transforms the text to lowercase and changes " " into "-"
  const strArr = str.split(" ").map((word) => {
    return word.toLowerCase();
  });
  return strArr.join("-");
}

// This code was adapted from the 'toTitleCase';
// It transforms the "\n" and "\f" to " " using REGEX. Also capitalizes the first letter in the sentence.
function convertToRead(str) {
  // console.log("Converting this flavor text:", str);

  const cleaned = str
    .replace(/[\n|\f]/g, " ")
    .replace(/POKéMON/g, "Pokémon")
    .replace(/\s/g, " ");

  // console.log("This flavor text was converted:", str);
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function loadingBox() {
  var string = `<img src="img/loading.gif" id="loadingGif">`;

  // Replace existing content with new Pokemon container
  const resultsContainer = document.querySelector(".resultsContainer");
  resultsContainer.innerHTML = string;
}
