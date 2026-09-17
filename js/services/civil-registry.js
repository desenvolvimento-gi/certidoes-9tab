let civilRegistryCities = {};
let civilRegistryOffices = {};

async function loadCivilRegistryData() {
  const [citiesResponse, officesResponse] = await Promise.all([
    fetch("data/cidades_crc.json"),
    fetch("data/cartorios_crc.json")
  ]);

  if (!citiesResponse.ok || !officesResponse.ok) {
    throw new Error("Não foi possível carregar os dados de Registro Civil.");
  }

  civilRegistryCities = await citiesResponse.json();
  civilRegistryOffices = await officesResponse.json();
}

function getCivilCities(uf) {
  return civilRegistryCities[uf] || [];
}

function getCivilRegistryOffices(uf, city) {
  return civilRegistryOffices[uf]?.[city] || [];
}