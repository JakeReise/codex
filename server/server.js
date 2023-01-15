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

let apiKeyTest = process.env.OPENAI_API_KEY;
let apiCallType = "";
var openaiAPICallTamplate = "";
//console.log(`apiKeyTest is ${apiKeyTest}`);


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

function stringParser(str) {
	if (str.startsWith('parsedata')) {
        var apiCommand = `model: "text-davinci-003",\n        prompt: \`${prompt}\`,\n        temperature: 0,\n        max_tokens: 3000,\n        top_p: 1,\n        frequency_penalty: 0,\n        presence_penalty: 0,`;
        /*
        model: "text-davinci-003",
        prompt: `${prompt}`,
        temperature: 0,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        */
    } else {
        var apiCpmmand = `model: "text-davinci-002",\n        prompt: \`${prompt}\`,\n        temperature: 0,\n        max_tokens: 3000,\n        top_p: 1,\n        frequency_penalty: 0,\n        presence_penalty: 0,\n        stop_sequence: """,`;
        /*
        model: "text-davinci-002",
        prompt: `${prompt}`,
        temperature: 0,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
        stop_sequence: """,
        */
    }
};

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
    const prompt = req.body.prompt;
    let apiCommand = stringParser(prompt);
    //const responseString = "createCompletion";
    try {
        
        const response = await openai.createCompletion({
            apiCallType
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