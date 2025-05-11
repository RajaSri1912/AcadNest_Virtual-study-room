// quiz.js
document.addEventListener('DOMContentLoaded', function() {
    // Quiz database - sample questions for each subject
    const quizData = {
        matrices: {
            title: "Matrices and Calculus Quiz",
            questions: [
                {
                    question: "What is the determinant of a 2×2 matrix [[a,b],[c,d]]?",
                    options: ["a+d", "a-d", "ad-bc", "ac+bd"],
                    correctAnswer: 2
                },
                {
                    question: "Which of the following is a property of identity matrix?",
                    options: ["All elements are 1", "Diagonal elements are 1, others are 0", "All elements are 0", "Matrix is not invertible"],
                    correctAnswer: 1
                },
                // Add 8 more questions for a total of 10
                {
                    question: "The derivative of sin(x) is:",
                    options: ["cos(x)", "-sin(x)", "tan(x)", "-cos(x)"],
                    correctAnswer: 0
                },
                {
                    question: "The integral of x² is:",
                    options: ["x³", "2x", "x³/3 + C", "2x²"],
                    correctAnswer: 2
                },
                {
                    question: "What is the rank of a zero matrix?",
                    options: ["0", "1", "Undefined", "Depends on the dimension"],
                    correctAnswer: 0
                },
                {
                    question: "If A is a square matrix and |A| = 0, then A is:",
                    options: ["Invertible", "Singular", "Identity matrix", "Diagonal matrix"],
                    correctAnswer: 1
                },
                {
                    question: "The chain rule is used for finding the derivative of:",
                    options: ["Sum of functions", "Product of functions", "Quotient of functions", "Composite functions"],
                    correctAnswer: 3
                },
                {
                    question: "What is the limit of sin(x)/x as x approaches 0?",
                    options: ["0", "1", "∞", "Undefined"],
                    correctAnswer: 1
                },
                {
                    question: "A matrix with all elements as zero is called:",
                    options: ["Unit matrix", "Scalar matrix", "Null matrix", "Diagonal matrix"],
                    correctAnswer: 2
                },
                {
                    question: "Which test is used to check the convergence of series with positive terms?",
                    options: ["Ratio test", "Root test", "Both A and B", "Neither A nor B"],
                    correctAnswer: 2
                }
            ]
        },
        chemistry: {
            title: "Engineering Chemistry Quiz",
            questions: [
                {
                    question: "What is the pH of a neutral solution at 25°C?",
                    options: ["0", "7", "14", "1"],
                    correctAnswer: 1
                },
                {
                    question: "Which of the following is a Lewis acid?",
                    options: ["NH3", "BF3", "H2O", "OH-"],
                    correctAnswer: 1
                },
                // Add 8 more questions
                {
                    question: "The process of removing hardness from water is called:",
                    options: ["Filtration", "Sedimentation", "Water softening", "Purification"],
                    correctAnswer: 2
                },
                {
                    question: "Which of the following polymers is used in making non-stick cookware?",
                    options: ["PVC", "Teflon", "Nylon", "Bakelite"],
                    correctAnswer: 1
                },
                {
                    question: "Corrosion of iron is an example of:",
                    options: ["Reduction reaction", "Redox reaction", "Decomposition reaction", "Substitution reaction"],
                    correctAnswer: 1
                },
                {
                    question: "Which of the following is not a fossil fuel?",
                    options: ["Coal", "Natural gas", "Biomass", "Petroleum"],
                    correctAnswer: 2
                },
                {
                    question: "The main component of natural gas is:",
                    options: ["Ethane", "Methane", "Propane", "Butane"],
                    correctAnswer: 1
                },
                {
                    question: "Which property of water makes it suitable as a coolant?",
                    options: ["High specific heat", "High viscosity", "Low density", "Low boiling point"],
                    correctAnswer: 0
                },
                {
                    question: "The most electronegative element is:",
                    options: ["Oxygen", "Chlorine", "Fluorine", "Nitrogen"],
                    correctAnswer: 2
                },
                {
                    question: "Which type of battery is commonly used in automobiles?",
                    options: ["Lithium-ion", "Nickel-cadmium", "Lead-acid", "Mercury"],
                    correctAnswer: 2
                }
            ]
        },
        programming: {
            title: "Programming for Problem Solving Quiz",
            questions: [
                {
                    question: "Which data structure follows Last In First Out principle?",
                    options: ["Queue", "Stack", "Linked List", "Array"],
                    correctAnswer: 1
                },
                {
                    question: "What is the time complexity of binary search?",
                    options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"],
                    correctAnswer: 2
                },
                // Add 8 more questions
                {
                    question: "Which of the following is not a programming paradigm?",
                    options: ["Procedural", "Object-oriented", "Functional", "Sequential"],
                    correctAnswer: 3
                },
                {
                    question: "In C programming, printf() and scanf() functions are defined in which header file?",
                    options: ["stdlib.h", "stdio.h", "string.h", "conio.h"],
                    correctAnswer: 1
                },
                {
                    question: "Which is not a looping structure in most programming languages?",
                    options: ["for", "while", "do-while", "goto"],
                    correctAnswer: 3
                },
                {
                    question: "What does SQL stand for?",
                    options: ["Structured Query Language", "Sequential Query Language", "Simple Query Language", "Standard Query Language"],
                    correctAnswer: 0
                },
                {
                    question: "Which of the following is not a valid variable name in most programming languages?",
                    options: ["user_name", "_count", "2values", "myVariable"],
                    correctAnswer: 2
                },
                {
                    question: "What is recursion in programming?",
                    options: ["Repeating a set of instructions with a for loop", "A function calling itself", "Iterating through an array", "Using multiple inheritance"],
                    correctAnswer: 1
                },
                {
                    question: "Which data structure is used to implement priority queue?",
                    options: ["Stack", "Linked List", "Heap", "Array"],
                    correctAnswer: 2
                },
                {
                    question: "Which sorting algorithm has the worst case time complexity of O(n²)?",
                    options: ["Merge sort", "Quick sort", "Heap sort", "Bubble sort"],
                    correctAnswer: 3
                }
            ]
        }
        // Add more subjects with their questions as needed
    };
    
    let currentSubject = null;
    let userAnswers = [];
    
    // Get DOM elements
    const quizBtns = document.querySelectorAll('.quiz-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const quizTitle = document.getElementById('quiz-title');
    const quizQuestions = document.getElementById('quiz-questions');
    const submitBtn = document.getElementById('submit-quiz');
    const scoreDisplay = document.getElementById('score-display');
    const retakeBtn = document.getElementById('retake-quiz');
    const backBtn = document.getElementById('back-to-subjects');
    
    // Add event listeners to quiz buttons
    quizBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            startQuiz(subject);
        });
    });
    
    // Submit quiz
    submitBtn.addEventListener('click', function() {
        showResults();
    });
    
    // Retake quiz
    retakeBtn.addEventListener('click', function() {
        startQuiz(currentSubject);
    });
    
    // Back to subjects
    backBtn.addEventListener('click', function() {
        showWelcomeScreen();
    });
    
    // Start quiz function
    function startQuiz(subject) {
        if (!quizData[subject]) {
            alert('Quiz for this subject is not available yet.');
            return;
        }
        
        currentSubject = subject;
        userAnswers = new Array(quizData[subject].questions.length).fill(-1);
        
        // Set quiz title
        quizTitle.textContent = quizData[subject].title;
        
        // Generate quiz questions
        generateQuestions(subject);
        
        // Show quiz screen
        welcomeScreen.style.display = 'none';
        resultsScreen.style.display = 'none';
        quizScreen.style.display = 'block';
    }
    
    // Generate questions function
    function generateQuestions(subject) {
        const questions = quizData[subject].questions;
        quizQuestions.innerHTML = '';
        
        questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-item';
            
            // Question text
            const questionText = document.createElement('div');
            questionText.className = 'question-text';
            questionText.textContent = `${index + 1}. ${q.question}`;
            questionDiv.appendChild(questionText);
            
            // Options
            const optionsList = document.createElement('ul');
            optionsList.className = 'options-list';
            
            q.options.forEach((option, optionIndex) => {
                const optionItem = document.createElement('li');
                optionItem.className = 'option-item';
                optionItem.textContent = option;
                optionItem.setAttribute('data-question', index);
                optionItem.setAttribute('data-option', optionIndex);
                
                // Add click event
                optionItem.addEventListener('click', function() {
                    selectOption(this, index, optionIndex);
                });
                
                optionsList.appendChild(optionItem);
            });
            
            questionDiv.appendChild(optionsList);
            quizQuestions.appendChild(questionDiv);
        });
    }
    
    // Select option function
    function selectOption(element, questionIndex, optionIndex) {
        // Remove selected class from all options of this question
        const questionOptions = document.querySelectorAll(`[data-question="${questionIndex}"]`);
        questionOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selected class to clicked option
        element.classList.add('selected');
        
        // Store user's answer
        userAnswers[questionIndex] = optionIndex;
    }
    
    // Show results function
    function showResults() {
        // Calculate score
        let score = 0;
        const questions = quizData[currentSubject].questions;
        
        userAnswers.forEach((answer, index) => {
            if (answer === questions[index].correctAnswer) {
                score++;
            }
        });
        
        // Display score
        scoreDisplay.innerHTML = `
            <h3>You scored ${score} out of ${questions.length}</h3>
            <p>Percentage: ${(score / questions.length * 100).toFixed(2)}%</p>
        `;
        
        // Show results screen
        quizScreen.style.display = 'none';
        resultsScreen.style.display = 'block';
    }
    
    // Show welcome screen
    function showWelcomeScreen() {
        welcomeScreen.style.display = 'block';
        quizScreen.style.display = 'none';
        resultsScreen.style.display = 'none';
    }
});
