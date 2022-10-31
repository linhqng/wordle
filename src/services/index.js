const API_ENDPOINT = "https://wordle.votee.dev:8000";

const fetchApi = async (endpoint) => {
  try {
    let response = await fetch(`${API_ENDPOINT}/${endpoint}`);
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const guessRandom = ({ guess, seed }) => {
  return fetchApi(`random?guess=${guess}&seed=${seed}`);
};
