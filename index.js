#! /usr/bin/env node

import fetch from 'node-fetch';
import inquirer from 'inquirer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OpenAI API key not found. Please set it in the .env file.');
  process.exit(1);
}

async function generateText(prompt) {
  const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].text.trim();
}

async function main() {
  const answers = await inquirer.prompt([
    { message: "Enter your prompt:", type: "input", name: "userPrompt" },
    { 
      message: "Select creativity level:", 
      type: "list", 
      name: "creativity", 
      choices: ["Low", "Medium", "High"]
    },
  ]);

  let temperature;
  switch (answers.creativity) {
    case "Low":
      temperature = 0.3;
      break;
    case "Medium":
      temperature = 0.7;
      break;
    case "High":
      temperature = 1.0;
      break;
  }

  const text = await generateText(answers.userPrompt, temperature);
  console.log("Generated Text:", text);
}

main().catch(err => console.error(err));
