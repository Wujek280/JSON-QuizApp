/////////    VANILLA JS
////////////////////////////////

'use strict';

/////////OBTAINING QUIZ FROM URL
////////////////////////////////

var path = 'https://cdn.rawgit.com/kdzwinel/cd08d08002995675f10d065985257416/raw/811ad96a0567648ff858b4f14d0096ba241f28ef/quiz-data.json';


function readJSON(file) {
    var request = new XMLHttpRequest();
    request.open('GET', file, false);
    request.send(null);
    if (request.status == 200)
        return request.responseText;
};

var quiz = JSON.parse(readJSON(path));

/////////  STATS FOR HEADER 
//////////////////////////////
var quizNoOfQuestions = quiz.questions.length;
var quizTimeMinutes = parseInt(quiz.time_seconds / 60);
var quizTimeSeconds = parseInt(quiz.time_seconds % 60);

////////       USER STATS
//////////////////////////////

   var askedQuestion = [];      //CLR AFTER SUBMIT
   var possibleAnswers = [];    //CLR AFTER SUBMIT

   var userAnswersTEXT = [];  
   var correctAnswersTEXT = [];

   var userAnswersID = [];
   var correctAnswersID = [];

   var askedQuestions = []; 
   var userScored = [];

   var currentQuestionID = 0; 

////////     FUNCTIONS
//////////////////////////////


function loadQuestion (n){
      
   askedQuestion = quiz.questions[n].question;
   askedQuestions.push(askedQuestion); // assign question to temp array

   quiz.questions[n].answers.forEach(function(element){
      
      possibleAnswers.push(element.answer); // assign answers to temp array
      

      
   });
   
}

function showQuestion(n) {
      
   /////////ONCE FOR QUESTION
   /////////////////////////////
   
   var createQuestion;
      createQuestion = document.createElement('h3');
      createQuestion.id = "quiz-question-anchor";
      createQuestion.className = "quiz-question quiz-bar";
      createQuestion.innerHTML = quiz.questions[n].question;
   
   document.getElementById('quiz').appendChild(createQuestion);
   
   /////////LOOP FOR EACH ANSWER
   /////////////////////////////
   
   quiz.questions[n].answers.forEach(function(element, i){
   
      var createAnswer;
         i++;
         createAnswer = document.createElement('input');
         createAnswer.type = 'radio';
         createAnswer.setAttribute('name','answer');
         createAnswer.id = 'ans_'+i;
      document.getElementById('quiz').appendChild(createAnswer);   

      var createLabelForAnswer;
         createLabelForAnswer = document.createElement('label');
         createLabelForAnswer.setAttribute('for','ans_'+i );
         createLabelForAnswer.className = "quiz-bar-answer quiz-bar";   
         createLabelForAnswer.innerHTML = element.answer;
      document.getElementById('quiz').appendChild(createLabelForAnswer);   
      
         console.log(createAnswer);
         console.log(createLabelForAnswer);

      if(element.correct === true){
            correctAnswersTEXT.push(element.answer);
            correctAnswersID.push(element.id);  // save correct answer
            console.log("Correct answer : "+element.id);
         }
      

   });
   
}

showQuestion(1);
answerQuestion(1);


function answerQuestion (n){
   
   var answers  = document.getElementsByName('answer');
   console.log(answers);
}

console.log();

