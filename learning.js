```javascript
// ZUMAR WONDERLAND — LEARNING GARDEN 🌱

const learningQuestions = {
  English: [
    {
      question: "Which word is a noun?",
      answers: ["Quickly", "Beautiful", "Teacher", "Run"],
      correct: 2
    },
    {
      question: "What is the plural of 'child'?",
      answers: ["Childs", "Children", "Childes", "Childrens"],
      correct: 1
    },
    {
      question: "Choose the correct spelling.",
      answers: ["Frend", "Freind", "Friend", "Freiend"],
      correct: 2
    }
  ],

  Math: [
    {
      question: "What is 12 × 8?",
      answers: ["86", "96", "108", "88"],
      correct: 1
    },
    {
      question: "What is 144 ÷ 12?",
      answers: ["10", "11", "12", "14"],
      correct: 2
    },
    {
      question: "What is 25% of 200?",
      answers: ["25", "40", "50", "75"],
      correct: 2
    }
  ],

  Science: [
    {
      question: "Which planet is called the Red Planet?",
      answers: ["Venus", "Mars", "Jupiter", "Mercury"],
      correct: 1
    },
    {
      question: "What do plants absorb from the Sun?",
      answers: ["Sunlight energy", "Sand", "Plastic", "Metal"],
      correct: 0
    },
    {
      question: "Which organ pumps blood around the body?",
      answers: ["Lungs", "Brain", "Heart", "Stomach"],
      correct: 2
    }
  ],

  Geography: [
    {
      question: "What is the capital of France?",
      answers: ["Rome", "Paris", "Lisbon", "Berlin"],
      correct: 1
    },
    {
      question: "Which country is famous for the pyramids of Giza?",
      answers: ["Egypt", "Canada", "Japan", "Norway"],
      correct: 0
    },
    {
      question: "Which is the largest ocean?",
      answers: [
        "Atlantic Ocean",
        "Indian Ocean",
        "Arctic Ocean",
        "Pacific Ocean"
      ],
      correct: 3
    }
  ]
};

let currentSubject = "";
let currentQuestionIndex = 0;
let learningScore = 0;
let answeredCurrentQuestion = false;

function getLearningElement(id) {
  return document.getElementById(id);
}

function showLearningMessage(message) {
  const element = getLearningElement("quiz-feedback");
  if (element) element.textContent = message;
}

function startLearningQuiz(subject) {
  if (!learningQuestions[subject]) {
    showLearningMessage("Please choose a subject first! 🌱");
    return;
  }

  currentSubject = subject;
  currentQuestionIndex = 0;
  learningScore = 0;
  answeredCurrentQuestion = false;

  const title = getLearningElement("quiz-title");
  if (title) title.textContent = `${subject} Challenge 🌟`;

  const score = getLearningElement("quiz-score");
  if (score) score.textContent = "Points: 0";

  renderLearningQuestion();
}

function renderLearningQuestion() {
  const questionBox = getLearningElement("quiz-question");
  const answersBox = getLearningElement("quiz-answers");

  if (!questionBox || !answersBox) {
    showLearningMessage(
      "The quiz display needs quiz-question and quiz-answers elements in index.html."
    );
    return;
  }

  const questions = learningQuestions[currentSubject];

  if (currentQuestionIndex >= questions.length) {
    finishLearningQuiz();
    return;
  }

  const item = questions[currentQuestionIndex];
  answeredCurrentQuestion = false;

  questionBox.textContent =
    `Question ${currentQuestionIndex + 1} of ${questions.length}: ` +
    item.question;

  answersBox.innerHTML = "";

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = answer;

    button.style.cssText =
      "display:block;width:100%;margin:8px 0;padding:12px;" +
      "border-radius:12px;border:1px solid #a78bfa;" +
      "background:#24133f;color:white;cursor:pointer;font-size:16px;";

    button.addEventListener("click", () => {
      checkLearningAnswer(index);
    });

    answersBox.appendChild(button);
  });

  showLearningMessage("Choose your answer! 💡");
}

function checkLearningAnswer(answerIndex) {
  if (answeredCurrentQuestion) return;

  answeredCurrentQuestion = true;

  const item = learningQuestions[currentSubject][currentQuestionIndex];
  const buttons = getLearningElement("quiz-answers");

  if (answerIndex === item.correct) {
    learningScore += 10;
    showLearningMessage("Correct! Amazing work! 🎉 +10 points");
  } else {
    showLearningMessage(
      `Not quite! The correct answer is ${item.answers[item.correct]}. Keep learning! 💜`
    );
  }

  const score = getLearningElement("quiz-score");
  if (score) score.textContent = `Points: ${learningScore}`;

  if (buttons) {
    Array.from(buttons.children).forEach((button) => {
      button.disabled = true;
      button.style.opacity = "0.7";
    });

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.textContent =
      currentQuestionIndex ===
      learningQuestions[currentSubject].length - 1
        ? "See My Results 🏆"
        : "Next Question ➜";

    nextButton.style.cssText =
      "margin-top:12px;padding:12px 20px;border:0;" +
      "border-radius:12px;background:#22d3ee;color:#101020;" +
      "cursor:pointer;font-weight:bold;";

    nextButton.addEventListener("click", () => {
      currentQuestionIndex++;
      renderLearningQuestion();
    });

    buttons.appendChild(nextButton);
  }
}

function finishLearningQuiz() {
  const questionBox = getLearningElement("quiz-question");
  const answersBox = getLearningElement("quiz-answers");

  if (questionBox) {
    questionBox.textContent =
      `You finished the ${currentSubject} Challenge! 🏆`;
  }

  if (answersBox) answersBox.innerHTML = "";

  showLearningMessage(
    `Amazing! You earned ${learningScore} out of 30 points! ⭐`
  );

  const score = getLearningElement("quiz-score");
  if (score) score.textContent = `Final points: ${learningScore}`;
}

// Make the quiz function available to game.js.
window.startLearningQuiz = startLearningQuiz;
```
