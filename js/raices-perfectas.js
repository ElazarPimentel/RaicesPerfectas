"use strict";
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const introSection = document.getElementById('intro-section');
    const multiplicationSection = document.getElementById('multiplication-section');
    const squareRootSection = document.getElementById('square-root-section');
    const resultsSection = document.getElementById('results-section');
    const congratsSection = document.getElementById('congrats-section');
    
    const multiplicationQuestions = document.getElementById('multiplication-questions');
    const squareRootQuestions = document.getElementById('square-root-questions');
    const resultsContent = document.getElementById('results-content');
    
    const startBtn = document.getElementById('start-btn');
    const checkMultiplicationBtn = document.getElementById('check-multiplication-btn');
    const checkSquareRootBtn = document.getElementById('check-square-root-btn');
    const retryBtn = document.getElementById('retry-btn');
    const restartBtn = document.getElementById('restart-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    
    // Variables de estado
    let allQuestionsPairs = []; // Array con todos los pares de números a preguntar (2-12)
    let remainingQuestionPairs = []; // Array con los pares que faltan preguntar
    let currentPair = []; // Par actual de números que se está preguntando
    let incorrectAnswers = [];
    let isRetryMode = false;
    let currentQuestions = [];
    
    // Inicializar la aplicación
    startBtn.addEventListener('click', startGame);
    checkMultiplicationBtn.addEventListener('click', checkMultiplicationAnswers);
    checkSquareRootBtn.addEventListener('click', checkSquareRootAnswers);
    retryBtn.addEventListener('click', retryIncorrectAnswers);
    restartBtn.addEventListener('click', startGame);
    newGameBtn.addEventListener('click', startGame);
    
    // Función para iniciar el juego
    function startGame() {
        // Reiniciar variables
        incorrectAnswers = [];
        isRetryMode = false;
        
        // Inicializar todas las combinaciones de números del 2 al 12
        initializeAllQuestionPairs();
        
        // Seleccionar un par al azar para comenzar
        selectNextRandomPair();
        
        // Mostrar sección de multiplicaciones
        showSection(multiplicationSection);
        
        // Generar preguntas de multiplicación
        generateMultiplicationQuestions();
    }
    
    // Inicializar todos los pares de preguntas (2-12)
    function initializeAllQuestionPairs() {
        allQuestionsPairs = [];
        
        for (let i = 2; i <= 12; i++) {
            allQuestionsPairs.push(i);
        }
        
        // Copia para los pares restantes
        remainingQuestionPairs = [...allQuestionsPairs];
    }
    
    // Seleccionar siguiente par aleatorio
    function selectNextRandomPair() {
        if (remainingQuestionPairs.length === 0) {
            // Si no quedan pares, reiniciar con los incorrectos o mostrar felicitaciones
            if (incorrectAnswers.length > 0) {
                // Mostrar pantalla de resultados con errores
                showResults();
            } else {
                showCongratulations();
            }
            return;
        }
        
        // Seleccionar un número aleatorio de los restantes
        const randomIndex = Math.floor(Math.random() * remainingQuestionPairs.length);
        currentPair = [remainingQuestionPairs[randomIndex]];
        
        // Eliminar el número seleccionado de los restantes
        remainingQuestionPairs.splice(randomIndex, 1);
        
        // Mostrar la siguiente pregunta de multiplicación
        showSection(multiplicationSection);
        generateMultiplicationQuestions();
    }
    
    // Función para generar preguntas de multiplicación
    function generateMultiplicationQuestions() {
        multiplicationQuestions.innerHTML = '';
        currentQuestions = [];
        
        // Mostrar información de progreso
        const progressInfo = document.createElement('div');
        progressInfo.className = 'progress-info';
        progressInfo.textContent = isRetryMode ? 
            'Repasando respuestas incorrectas' : 
            `Progreso: ${allQuestionsPairs.length - remainingQuestionPairs.length}/${allQuestionsPairs.length}`;
        multiplicationQuestions.appendChild(progressInfo);
        
        // Si estamos en modo de reintento, usar solo las preguntas incorrectas
        if (isRetryMode) {
            incorrectAnswers.forEach(item => {
                if (item.type === 'multiplication') {
                    addMultiplicationQuestion(item.number, item.number);
                }
            });
        } else {
            // Generar preguntas para el número actual
            currentPair.forEach(number => {
                addMultiplicationQuestion(number, number);
            });
        }
    }
    
    // Función para añadir una pregunta de multiplicación
    function addMultiplicationQuestion(number, multiplier) {
        const questionId = `mult-${number}-${multiplier}`;
        currentQuestions.push({
            id: questionId,
            number: number,
            type: 'multiplication',
            correctAnswer: number * multiplier
        });
        
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container';
        questionContainer.innerHTML = `
            <div class="question-text">
                ¿Cuánto es ${number} x ${multiplier}?
                <input type="number" id="${questionId}" class="answer-input" min="0">
            </div>
            <div id="feedback-${questionId}" class="feedback"></div>
        `;
        
        multiplicationQuestions.appendChild(questionContainer);

        // Enfocar el primer input automáticamente
        const firstInput = questionContainer.querySelector('.answer-input');
        if (firstInput) {
            firstInput.focus();
        }
    }
    
    // Función para verificar respuestas de multiplicación
    function checkMultiplicationAnswers() {
        let allCorrect = true;
        
        currentQuestions.forEach(question => {
            const inputElement = document.getElementById(question.id);
            const feedbackElement = document.getElementById(`feedback-${question.id}`);
            
            const userAnswer = parseInt(inputElement.value);
            
            if (isNaN(userAnswer)) {
                feedbackElement.textContent = 'Por favor, ingresa un número.';
                feedbackElement.className = 'feedback incorrect';
                allCorrect = false;
                return;
            }
            
            if (userAnswer === question.correctAnswer) {
                feedbackElement.textContent = '¡Correcto!';
                feedbackElement.className = 'feedback correct';
                
                // Eliminar de incorrectAnswers si estaba allí
                incorrectAnswers = incorrectAnswers.filter(item => 
                    !(item.number === question.number && 
                      item.type === 'multiplication')
                );
            } else {
                feedbackElement.textContent = `Incorrecto. La respuesta correcta es ${question.correctAnswer}.`;
                feedbackElement.className = 'feedback incorrect';
                allCorrect = false;
                
                // Añadir a incorrectAnswers si no estamos en modo de reintento
                if (!isRetryMode) {
                    incorrectAnswers.push({
                        number: question.number,
                        type: 'multiplication',
                        correctAnswer: question.correctAnswer,
                        userAnswer: userAnswer
                    });
                }
            }
        });
        
        // Si todas son correctas, pasar a la siguiente sección
        if (allCorrect) {
            setTimeout(() => {
                showSection(squareRootSection);
                generateSquareRootQuestions();
            }, 1500);
        }
    }
    
    // Función para generar preguntas de raíz cuadrada
    function generateSquareRootQuestions() {
        squareRootQuestions.innerHTML = '';
        currentQuestions = [];
        
        // Mostrar información de progreso
        const progressInfo = document.createElement('div');
        progressInfo.className = 'progress-info';
        progressInfo.textContent = isRetryMode ? 
            'Repasando respuestas incorrectas' : 
            `Progreso: ${allQuestionsPairs.length - remainingQuestionPairs.length}/${allQuestionsPairs.length}`;
        squareRootQuestions.appendChild(progressInfo);
        
        // Si estamos en modo de reintento, usar solo las preguntas incorrectas
        if (isRetryMode) {
            incorrectAnswers.forEach(item => {
                if (item.type === 'squareRoot') {
                    addSquareRootQuestion(item.number);
                }
            });
        } else {
            // Generar preguntas de raíz cuadrada basadas en las multiplicaciones anteriores
            currentPair.forEach(number => {
                addSquareRootQuestion(number * number);
            });
        }
    }
    
    // Función para añadir una pregunta de raíz cuadrada
    function addSquareRootQuestion(number) {
        const questionId = `sqrt-${number}`;
        const correctAnswer = Math.sqrt(number);
        
        currentQuestions.push({
            id: questionId,
            number: number,
            type: 'squareRoot',
            correctAnswer: correctAnswer
        });
        
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container';
        questionContainer.innerHTML = `
            <div class="question-text">
                ¿Cuál es la raíz cuadrada de ${number}?
                <input type="number" id="${questionId}" class="answer-input" min="0">
            </div>
            <div id="feedback-${questionId}" class="feedback"></div>
        `;
        
        squareRootQuestions.appendChild(questionContainer);

        // Enfocar el primer input automáticamente
        const firstInput = questionContainer.querySelector('.answer-input');
        if (firstInput) {
            firstInput.focus();
        }
    }
    
    // Función para verificar respuestas de raíz cuadrada
    function checkSquareRootAnswers() {
        let allCorrect = true;
        
        currentQuestions.forEach(question => {
            const inputElement = document.getElementById(question.id);
            const feedbackElement = document.getElementById(`feedback-${question.id}`);
            
            const userAnswer = parseInt(inputElement.value);
            
            if (isNaN(userAnswer)) {
                feedbackElement.textContent = 'Por favor, ingresa un número.';
                feedbackElement.className = 'feedback incorrect';
                allCorrect = false;
                return;
            }
            
            if (userAnswer === question.correctAnswer) {
                feedbackElement.textContent = '¡Correcto!';
                feedbackElement.className = 'feedback correct';
                
                // Eliminar de incorrectAnswers si estaba allí
                incorrectAnswers = incorrectAnswers.filter(item => 
                    !(item.number === question.number && 
                      item.type === 'squareRoot')
                );
            } else {
                feedbackElement.textContent = `Incorrecto. La respuesta correcta es ${question.correctAnswer}.`;
                feedbackElement.className = 'feedback incorrect';
                allCorrect = false;
                
                // Añadir a incorrectAnswers si no estamos en modo de reintento
                if (!isRetryMode) {
                    incorrectAnswers.push({
                        number: question.number,
                        type: 'squareRoot',
                        correctAnswer: question.correctAnswer,
                        userAnswer: userAnswer
                    });
                }
            }
        });
        
        // Si todas son correctas, continuar con la siguiente pregunta o mostrar resultados
        if (allCorrect) {
            setTimeout(() => {
                if (isRetryMode) {
                    // Si estamos en modo reintento, verificar si hay más errores
                    if (incorrectAnswers.length > 0) {
                        retryIncorrectAnswers();
                    } else {
                        showCongratulations();
                    }
                } else {
                    // Continuar con la siguiente pregunta o mostrar resultados
                    selectNextRandomPair();
                }
            }, 1500);
        }
    }
    
    // Función para mostrar resultados
    function showResults() {
        resultsContent.innerHTML = '';
        
        if (incorrectAnswers.length > 0) {
            const resultTitle = document.createElement('h3');
            resultTitle.textContent = 'Respuestas incorrectas:';
            resultsContent.appendChild(resultTitle);
            
            const resultExplanation = document.createElement('p');
            resultExplanation.textContent = 'Repasemos las preguntas que se te hicieron difíciles:';
            resultsContent.appendChild(resultExplanation);
            
            incorrectAnswers.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                
                if (item.type === 'multiplication') {
                    resultItem.innerHTML = `
                        <p>${item.number} x ${item.number} = ${item.correctAnswer}</p>
                        <p>Tu respuesta: ${item.userAnswer}</p>
                    `;
                } else if (item.type === 'squareRoot') {
                    resultItem.innerHTML = `
                        <p>La raíz cuadrada de ${item.number} = ${item.correctAnswer}</p>
                        <p>Tu respuesta: ${item.userAnswer}</p>
                    `;
                }
                
                resultsContent.appendChild(resultItem);
            });
            
            // Mostrar el mensaje de que faltan números por aprender
            if (remainingQuestionPairs.length > 0) {
                const remainingInfo = document.createElement('p');
                remainingInfo.className = 'remaining-info';
                remainingInfo.textContent = `Aún quedan ${remainingQuestionPairs.length} raíces perfectas por aprender.`;
                resultsContent.appendChild(remainingInfo);
            }
            
            showSection(resultsSection);
        } else if (remainingQuestionPairs.length > 0) {
            // Si no hay errores pero quedan preguntas, continuar con la siguiente
            selectNextRandomPair();
        } else {
            // Si no hay errores ni quedan preguntas, mostrar felicitaciones
            showCongratulations();
        }
    }
    
    // Función para reintentar respuestas incorrectas
    function retryIncorrectAnswers() {
        isRetryMode = true;
        
        // Si hay errores de multiplicación, mostrar esas preguntas primero
        const hasMultiplicationErrors = incorrectAnswers.some(item => item.type === 'multiplication');
        
        if (hasMultiplicationErrors) {
            showSection(multiplicationSection);
            generateMultiplicationQuestions();
        } else {
            showSection(squareRootSection);
            generateSquareRootQuestions();
        }
    }
    
    // Función para mostrar felicitaciones
    function showCongratulations() {
        showSection(congratsSection);
    }
    
    // Función para mostrar una sección y ocultar las demás
    function showSection(sectionToShow) {
        // Ocultar todas las secciones
        introSection.classList.add('hidden');
        multiplicationSection.classList.add('hidden');
        squareRootSection.classList.add('hidden');
        resultsSection.classList.add('hidden');
        congratsSection.classList.add('hidden');
        
        // Mostrar la sección deseada
        sectionToShow.classList.remove('hidden');
    }

    // Función para manejar el evento de tecla presionada
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            if (!multiplicationSection.classList.contains('hidden')) {
                checkMultiplicationBtn.click();
            } else if (!squareRootSection.classList.contains('hidden')) {
                checkSquareRootBtn.click();
            }
        }
    }

    // Agregar el evento de teclado al documento
    document.addEventListener('keydown', handleKeyPress);
});