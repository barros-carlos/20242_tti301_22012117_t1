const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(express.json());

const {
    SERVER_PORT, PROTOCOL, BASE_URL_COORDS, BASE_URL_WEATHER, API_KEY, WEATHER_UNITS, LANG_API, LIMIT_COORDS
} = process.env;

app.route('/coords')
    .get(async (req, res) => {
        const cidade = req.query.cidade;

        if (!cidade) {
            return res.status(400).send(`
              <h1>400 Bad Request</h1>
              <p>O nome da cidade é obrigatório</p>
              <img src="https://http.cat/400" alt="400 Bad Request">
            `);
        }

        try {
            const url = `${PROTOCOL}://${BASE_URL_COORDS}?q=${cidade}&limit=${LIMIT_COORDS}&appid=${API_KEY}`;
            const response = await axios.get(url);

            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                return res.json({ cidade, latitude: lat, longitude: lon });
            } else {
                return res.status(404).send(`
                  <h1>404 Not Found</h1>
                  <p>Nenhuma coordenada encontrada para a cidade: ${cidade}</p>
                  <img src="https://http.cat/404" alt="404 Not Found">
                `);
            }
        } catch (error) {
            console.error(`Erro ao buscar coordenadas: ${error}`);
            return res.status(500).send(`
              <h1>500 Internal Server Error</h1>
              <p>Erro ao buscar coordenadas</p>
              <img src="https://http.cat/500" alt="500 Internal Server Error">
            `);
        }
    })
    .all((req, res) => {
        res.status(405).send(`
          <h1>405 Method Not Allowed</h1>
          <img src="https://http.cat/405" alt="405 Method Not Allowed">
        `);
    });


app.use((req, res) => {
    res.status(404).send(`
      <h1>404 Not Found</h1>
      <img src="https://http.cat/404" alt="404 Not Found">
    `);
});

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).send(`
      <h1>${statusCode} Error</h1>
      <p>${err.message || 'Ocorreu um erro inesperado.'}</p>
      <img src="https://http.cat/${statusCode}" alt="${statusCode} Error">
    `);
});

app.listen(SERVER_PORT || 3000, () => {
    console.log(`Servidor rodando na porta ${SERVER_PORT || 3000}`);
});
