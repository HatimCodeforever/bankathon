



const prompt = "";

// Make a request to the completions endpoint
openai.Completions.create({
  engine: "davinci",
  prompt: prompt,
  max_tokens: 10,
  temperature: 0.8,
  stop: "\n"
}).then((response) => {
  // Print the response object
  console.log(response);
});


// const questionRegex = /\d+\.\s(.*\?)/g;

// // Extract and store the questions in an array
// const questionsArray = [];
// let match;
// while ((match = questionRegex.exec(response)) !== null) {
//   questionsArray.push(match[1]);
// }

// console.log(questionsArray);