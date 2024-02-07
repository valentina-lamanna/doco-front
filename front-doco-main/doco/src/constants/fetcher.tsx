const fetcher = async (url, options = {}) => {
  const response = await fetch(`${url}`, options);
  if (!response.ok) {
    throw new Error(
      `Error al realizar la solicitud: ${response.status} ${response.statusText}`
    );
  }
  const json = await response.json();
  return json.data;
};

export default fetcher;
