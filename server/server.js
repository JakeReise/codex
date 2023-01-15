import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from "openai";
import fs from 'fs';
import { check } from 'tcp-port-used';
import { execSync } from 'child_process';
import pkg from 'tcp-port-used';

dotenv.config();

let port = 5000;
/* const checkPort = async () => {
    let inUse = true;
    while (inUse) {
        inUse = await check(port, '127.0.0.1');
        if (inUse) {
            console.log(`Port 5000 is in use`);
            } else {
                console.log(`Server listening on port ${port}`);
                app.listen(port, () => console.log(`Server is running on port http://localhost:${port}`));
        }
    };
}
 */
//checkPort();

//let apiKey = fs.readFileSync(process.env.OPENAI_API_KEY);


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);


function generateUniqueID() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
  
    return `id-${timestamp}-${hexadecimalString}`;
  }

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from CodeX',
    })
});

app.post('/', async (req, res) =>{
    const uniqueId = generateUniqueID();
    console.log(`Posting for request#${uniqueId}`);
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({error});
    }
})

app.listen(port, () => console.log(`Server is running on port http://localhost:${port}`));