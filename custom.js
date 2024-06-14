const apiurl =
  "https://opentdb.com/api.php?amount=25&category=15&difficulty=easy";

let currentQuestionIndex = 0;
let questions = [];
let userAnswers = []; // Initialize to store user answers
let userFeedback = []; // Initialize to store feedback for each question
let score = 0;

document.addEventListener("DOMContentLoaded", () => {
  fetchQuestions();
});

let fetchQuestions = () => {
  fetch(apiurl)
    .then((response) => response.json())
    .then((data) => {
      questions = data.results;
      userAnswers = Array(questions.length).fill(null); // Initialize userAnswers with null
      userFeedback = Array(questions.length).fill(""); // Initialize userFeedback with empty string
      displayQuestions();
      generateQuestionNumbers(); // Generate question numbers
    })
    .catch((error) => console.error("Error fetching questions", error));
};

let displayQuestions = () => {
  if (currentQuestionIndex >= questions.length) {
    showResult();
    return;
  }

  // Selecting the HTML elements
  const questionContainer = document.querySelector(".question_container");
  const questionElement = document.querySelector(".question");
  const optionsElement = document.querySelector(".options");
  const feedbackElement = document.querySelector(".feedback");
  const submitButton = document.querySelector(".submit_btn");
  const nextButton = document.querySelector(".next_btn");
  const prevButton = document.querySelector(".prev_btn");

  // Clear previous questions and feedback element
  optionsElement.innerHTML = "";
  feedbackElement.innerHTML = userFeedback[currentQuestionIndex]; // Show previous feedback

  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = `${currentQuestionIndex + 1}. ${
    currentQuestion.question
  }`;
  console.log(questionElement.innerText);

  const options = [
    ...currentQuestion.incorrect_answers,
    currentQuestion.correct_answer,
  ];
  console.log(options);

  shuffleArray(options).forEach((option, index) => {
    const optionElement = document.createElement("li");
    optionElement.classList.add("option");

    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "answer";
    radioInput.value = option;
    radioInput.id = `option${index}`;

    const label = document.createElement("label");
    label.htmlFor = `option${index}`;
    label.innerHTML = option;

    optionElement.appendChild(radioInput);
    optionElement.appendChild(label);
    optionsElement.appendChild(optionElement);
  });

  // Show previously selected answer if available
  if (userAnswers[currentQuestionIndex] !== null) {
    document.querySelector(
      `input[name='answer'][value='${userAnswers[currentQuestionIndex]}']`
    ).checked = true;
  }

  submitButton.style.display = "block";
  nextButton.style.display =
    currentQuestionIndex === questions.length - 1 ? "none" : "block";
  prevButton.style.display = currentQuestionIndex > 0 ? "block" : "none";
};

let submitAnswer = () => {
  const selectedOption = document.querySelector("input[name='answer']:checked");
  const feedbackElement = document.querySelector(".feedback");
  const submitButton = document.querySelector(".submit_btn");
  const nextButton = document.querySelector(".next_btn");
  const prevButton = document.querySelector(".prev_btn");

  if (!selectedOption) {
    feedbackElement.innerText = "Please select an answer!";
    return;
  }

  const correctOption = questions[currentQuestionIndex].correct_answer;
  userAnswers[currentQuestionIndex] = selectedOption.value; // Store user answer

  if (selectedOption.value === correctOption) {
    score++;
    userFeedback[currentQuestionIndex] = "Correct!";
    feedbackElement.style.color = "green";
  } else {
    userFeedback[
      currentQuestionIndex
    ] = `Wrong! The correct answer is ${correctOption}`;
    feedbackElement.style.color = "red";
  }
  feedbackElement.innerText = userFeedback[currentQuestionIndex]; // Show feedback
  console.log(`Correct answer: ${correctOption}`);

  updateQuestionNumberColor(currentQuestionIndex); // Update the color of the question number button

  submitButton.style.display = "block";
  nextButton.style.display =
    currentQuestionIndex === questions.length - 1 ? "none" : "block";
  prevButton.style.display = currentQuestionIndex > 0 ? "block" : "none";

  checkAllQuestionsAnswered(); // Check if all questions are answered after submitting
};

let nextQuestion = () => {
  currentQuestionIndex++;
  displayQuestions();
};

let prevQuestion = () => {
  currentQuestionIndex--;
  displayQuestions();
};

let goToQuestion = (index) => {
  currentQuestionIndex = index;
  displayQuestions();
};

let generateQuestionNumbers = () => {
  const questionNumbersContainer = document.querySelector(".question_numbers");
  questionNumbersContainer.innerHTML = "";
  questions.forEach((_, index) => {
    const questionNumberElement = document.createElement("button");
    questionNumberElement.classList.add("question_number");
    questionNumberElement.classList.add(
      userAnswers[index] === null ? "not_answered" : "answered"
    );
    questionNumberElement.innerText = index + 1;
    questionNumberElement.addEventListener("click", () => goToQuestion(index));
    questionNumbersContainer.appendChild(questionNumberElement);
  });
};

let updateQuestionNumberColor = (index) => {
  const questionNumbersContainer = document.querySelector(".question_numbers");
  const questionNumberElement = questionNumbersContainer.children[index];
  questionNumberElement.classList.remove("not_answered");
  questionNumberElement.classList.add("answered");
};

let checkAllQuestionsAnswered = () => {
  const allAnswered = userAnswers.every((answer) => answer !== null);
  if (allAnswered) {
    showResult();
  }
};

function showResult() {
  const resultElement = document.querySelector(".result");
  resultElement.innerHTML = `You scored ${score} out of ${questions.length}`;
  document.querySelector(".question_container").style.display = "none";
  document.querySelector(".submit_btn").style.display = "none";
  document.querySelector(".next_btn").style.display = "none";
  document.querySelector(".prev_btn").style.display = "none";
  document.querySelector(".feedback").style.display = "none";
  document.querySelector(".question_numbers").style.display = "none";
}

let shuffleArray = (array) => {
  for (let i = 0; i < array.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};
