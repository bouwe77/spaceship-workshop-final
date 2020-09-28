import axios from "axios";

const url = "https://spaceship-server.herokuapp.com";
const urlSpaceships = `${url}/spaceships`;
const urlSpaceObjects = `${url}/spaceobjects`;

export async function getSpaceships() {
  try {
    const result = await axios.get(urlSpaceships);
    return result.data;
  } catch (error) {
    handle(error);
  }
}

export async function getSpaceship(spaceshipId) {
  try {
    const result = await axios.get(`${urlSpaceships}/${spaceshipId}`);
    return result.data;
  } catch (error) {
    handle(error);
  }
}

export async function getDefaultSpaceships() {
  const spaceships = await getSpaceships();
  const defaultSpaceships = spaceships.filter(
    (spaceship) => spaceship.isDefault
  );
  return defaultSpaceships;
}

export async function getSpaceObjects() {
  try {
    const result = await axios.get(urlSpaceObjects);
    const sorted = [...result.data].sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    return sorted;
  } catch (error) {
    handle(error);
  }
}

function handle(error) {
  console.log(error);
  if (error.response)
    console.log(error.response.status, error.response.data.Message);
  if (error.config) console.log(error.config.url, error.config.method);

  throw error;
}
