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

//////// DYNAMIC VARIABLES
///////////////////////////////
   var askedQuestion;       //CLR AFTER SUBMIT
   var userAnswerID;    
   var questionAnswerID;

////////       USER STATS
//////////////////////////////

   var userAnswersTEXT = [];  
   var correctAnswersTEXT = [];

   var userAnswersID = [];
   var correctAnswersID = [];

   var askedQuestions = []; 
   var userScored = [];

   var currentQuestionID = 0; 

////////     FUNCTIONS
//////////////////////////////


function showQuestion(n) {
      
   /////////ONCE FOR QUESTION
   /////////////////////////////
   

   
   //////// UPDATE ID
   var quizStatusID = 'ID : '+(currentQuestionID+1)+'/'+quizNoOfQuestions;
   document.getElementsByClassName('quiz-status-id')[0].innerHTML = quizStatusID;
   
   /////// PUSH FOR STATS
   askedQuestion = quiz.questions[n].question;
   askedQuestions.push(askedQuestion);
   
   var createQuestion;
      createQuestion = document.createElement('h3');
      createQuestion.id = "quiz-question-anchor";
      createQuestion.className = "quiz-question quiz-bar";
      createQuestion.innerHTML = quiz.questions[n].question;
   
   document.getElementById('quiz').appendChild(createQuestion);
   
   document.getElementById("quiz-submit-label").className = "quiz-submit quiz-bar quiz-submit--default";
   
   /////////LOOP FOR EACH ANSWER
   /////////////////////////////
   
   quiz.questions[n].answers.forEach(function(element, i){
   
      //CREATE ANSWER NODES
      var createAnswer;
         i++;
         createAnswer = document.createElement('input');
         createAnswer.type = 'radio';
         createAnswer.setAttribute('name','answer');
         createAnswer.id = 'ans_'+i;
      

      var createLabelForAnswer;
         createLabelForAnswer = document.createElement('label');
         createLabelForAnswer.setAttribute('for','ans_'+i );
         createLabelForAnswer.className = "quiz-bar-answer quiz-bar";   
         createLabelForAnswer.innerHTML = element.answer;
      
      //APPEND THEM
      document.getElementById('quiz').appendChild(createAnswer);   
      document.getElementById('quiz').appendChild(createLabelForAnswer);   
      
      //ADD PROPER ONCLICK LISTENER
      document.getElementById('ans_'+i).addEventListener('click',function(){
         console.log(i);
         userAnswerID = i;
         document.getElementById("quiz-submit-label").className = "quiz-submit quiz-bar quiz-submit--answer";
      });
      
      //SAVE CORRECT ANSWER FOR STATS
      if(element.correct === true){
            correctAnswersTEXT.push(element.answer);
            questionAnswerID = element.id;     correctAnswersID.push(element.id);  
            console.log("Correct answer : "+element.id);
         }      
   });
      
}



function answerQuestion (n){
   
   //////// CHECK IF USER CLICKED ANY ANSWER
   /////////////////////////////////////////////////
   
   if(userAnswerID != null){
      
      ///// PUSH ID TO ARRAY
      userAnswersID.push(userAnswerID);
      
      ///// PUSH IF YOU SCORED OR NOT
      if(userAnswerID == questionAnswerID)
      {
         userScored.push('+');
      }else{
         userScored.push('-');
      }
      
      ///// PUSH TEXT YOU ANSWERED
      var useranswer = document.getElementsByTagName('label')[userAnswerID-1].innerHTML;
      userAnswersTEXT.push(useranswer);
         
            
      ////////  CLEAR BOX 
      ////////  RESET AnswerNo 
      ////////  ID++
      ////////  set Submit bar to default CSS
      ////////  update progress bar
      ////////  Show nextquestion
      ///////////////////////////////

      document.getElementById('quiz').innerHTML = '';
      userAnswerID = null;
      currentQuestionID++;
      
      document.getElementById("quiz-submit-label").className = "quiz-submit quiz-bar quiz-submit--default";
      
      var progress = currentQuestionID/quizNoOfQuestions ;
      document.getElementsByTagName('progress')[0].setAttribute('value',progress);
      
      showQuestion(currentQuestionID);
      
   }else{
      //CHANGE STYLE OF SUBMIT BUTTON
      document.getElementById("quiz-submit-label").className = "quiz-submit quiz-bar quiz-submit--noanswer";     
   }
   
  
}
























