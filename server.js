const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors');

app.use(bodyParser.json());

const corsOptions = {
    // origin: 'https://6637372d2788c4a2601f42b8--tubular-sprite-5720d1.netlify.app', // Specify the origin of your React app
	
    origin: 'https://code-editor-a4676.web.app',
    methods: ['GET', 'POST'], // Specify allowed methods
    allowedHeaders: ['Content-Type'], // Specify allowed headers
    credentials: true // Allow cookies to be sent with requests
};
app.use(cors(corsOptions));

app.post('/compile', async (req, res) => {
	console.log('Received request body:', req.body);

    const { code, language, input } = req.body;

    // Ensure all parameters are defined
    if (!code || !language) {
        return res.status(400).json({ error: 'Missing required parameters: code and language' });
    }

    const apiData = {
        language,
        version: 'latest',
        code,
        input: input || ''
    };

    const apiOptions = {
        method: 'POST',
        url: 'https://online-code-compiler.p.rapidapi.com/v1/',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '481021cf74mshc8dbdb72c05247dp15d0bbjsn60d86d5939dc', // Replace this with your actual RapidAPI Key
            'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
        },
        data: apiData
    };

    try {
        const response = await axios(apiOptions);

        // Return the output from the API
        res.json({ output: response.data.output });
    } catch (error) {
        console.error('Error making API request:', error);
        // Return a meaningful error message
        res.status(500).json({
            error: 'Error communicating with the API: ' + error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
