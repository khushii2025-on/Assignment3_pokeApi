const form = document.getElementById('search-form');
const input = document.getElementById('pokemon-input');
const statusMessage = document.getElementById('status-message');
const resultDiv = document.getElementById('result');
const randomBtn = document.getElementById('random-btn');

const API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

async function fetchPokemon(searchValue) {
  const trimmed = String(searchValue).trim().toLowerCase();
  if (!trimmed) return;

  
  statusMessage.textContent = 'Loading Pokémon data...';
  resultDiv.innerHTML = '';

  try {
    
    const response = await fetch(`${API_BASE_URL}${trimmed}`);

    //  To check if the Pokémon exists
    if (!response.ok) {
      statusMessage.textContent = 'Pokémon not found. Try another name or ID.';
      resultDiv.innerHTML = '';
      return;
    }

    // Convert response stream to JSON
    const data = await response.json();

    
    const name = data.name;
    const id = data.id;
    const spriteUrl = data.sprites.front_default;
    const types = data.types.map(t => t.type.name);
    const height = data.height; // in decimetres
    const weight = data.weight; // in hectograms
    const baseExperience = data.base_experience;
    const abilities = data.abilities.map(a => a.ability.name);
    const stats = data.stats.map(statObj => ({
      name: statObj.stat.name,
      value: statObj.base_stat
    }));

    
    const typeBadges = types
      .map(type => `<span class="badge type">${type}</span>`)
      .join(' ');

    const abilityBadges = abilities
      .map(ability => `<span class="badge">${ability}</span>`)
      .join(' ');

    const statsList = stats
      .map(stat => `<li>${stat.name}: ${stat.value}</li>`)
      .join('');

    // Unit conversion
    const heightMeters = (height / 10).toFixed(1); // decimetres -> metres
    const weightKg = (weight / 10).toFixed(1);     // hectograms -> kg

    
    resultDiv.innerHTML = `
      <article class="pokemon-card">
        <div class="pokemon-image">
          ${
            spriteUrl
              ? `<img src="${spriteUrl}" alt="${name} sprite">`
              : '<p>No image available.</p>'
          }
        </div>
        <div class="pokemon-main-info">
          <h2>${name.toUpperCase()} (#${id})</h2>

          <div class="tag-row">
            <span class="tag-label">Type:</span>
            ${typeBadges}
          </div>

          <div class="tag-row">
            <span class="tag-label">Abilities:</span>
            ${abilityBadges}
          </div>

          <div class="extra-info">
            <h3>Basic Info</h3>
            <ul>
              <li><strong>Height:</strong> ${heightMeters} m</li>
              <li><strong>Weight:</strong> ${weightKg} kg</li>
              <li><strong>Base Experience:</strong> ${baseExperience}</li>
            </ul>
          </div>

          <div class="stats">
            <h3>Base Stats</h3>
            <ul>
              ${statsList}
            </ul>
          </div>
        </div>
      </article>
    `;

    statusMessage.textContent = 'Pokémon data loaded successfully.';

  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    statusMessage.textContent =
      'Something went wrong while contacting the API. Please try again later.';
    resultDiv.innerHTML = '';
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault(); // stop the page from refreshing
  const value = input.value;
  fetchPokemon(value);
});

