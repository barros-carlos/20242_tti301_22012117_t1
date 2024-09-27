const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(express.json());

const API_KEY = process.env.API_KEY;

app.post('/obterCordenadas', async (req, res) => {
    const { cidade } = req.body;
    
    if (!cidade) {
        return res.status(400).json({ error: 'O nome da cidade é obrigatório' });
    }
    
    try {
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
        const response = await axios.get(url);
        
        if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return res.json({ city, latitude: lat, longitude: lon });
        } else {
            return res.status(404).json({ error: `Nenhuma coordenada encontrada para a cidade: ${city}` });
        }
    } catch (error) {
        console.error(`Erro ao buscar coordenadas: ${error}`);
        return res.status(500).json({ error: 'Erro ao buscar coordenadas' });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
