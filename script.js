document.querySelector("#search").addEventListener("click", getPokemon);

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getPokemon();
  }
});

function getPokemon(e) {
  const name = convertToSearch(document.querySelector("#pokemonName").value);
  fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then((response) => response.json())
    .then((data) => {
      document.querySelector(".pokemonBox").innerHTML = `
      <div>
      <img 
          src="${data.sprites.other["official-artwork"].front_default}" 
          alt="${data.name}"
        />
      </div>
      <div class="pokemonInfo">
        <h1>${toTitleCase(data.name)} </h1>
        <p>Weight: ${data.weight}</p>
        <p>Pokemon ID: ${data.id}</p>
      </div>
      `;
    })
    .catch((err) => {
      console.log("Pokemon not found", err);
    });

  // e.preventDefault();
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
