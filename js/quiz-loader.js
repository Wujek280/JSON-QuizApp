///////////////////////////////////////
/////////    VANILLA JS
//////////////////////////////////////

'use strict';

//////////////////////////////////////
/////////   OBTAINING QUIZ FROM URL
/////////////////////////////////////

var path = 'https://cdn.rawgit.com/kdzwinel/cd08d08002995675f10d065985257416/raw/811ad96a0567648ff858b4f14d0096ba241f28ef/quiz-data.json';

   //////////////////////////////////
   //
   // (•_•)
   //<)   )╯ 'Cause I just wanna copy and paste
   // /    \
   //  (•_•)
   // <(   (>   copy and paste
   //  /    \
   //    (•_•)        (•_•)
   //  <)   (>  uh    <)   (>     huh
   //   /    \        /    \
   //
   ///////////////////////////////////


function readJSON(file) {
    var request = new XMLHttpRequest();
    request.open('GET', file, false);
    request.send(null);
    if (request.status == 200)
        return request.responseText;
};

var quiz = JSON.parse(readJSON(path));

var quizNoOfQuestions = quiz.questions.length;
var questionsLeft = quizNoOfQuestions -1; 

/////////////////////////////////
////////       VARIABLES
/////////////////////////////////

   var userAnswerID;      //
   var questionAnswerID; // compare ID's
   var userAnswer; 
   var questionAnswer; 
   var userScored;
   var totalScore = 0;

   var currentQuestionID = 0; 
   var endTime;

   var timeLeft;

//////////////////////////////////
////////       USER STATS
//////////////////////////////////

//ARRAY OF USER ANSWERS
var answers = [];

//ANSWER OBJECT DEFINITION
var Answer = function(id, question, correctAns, userAns, scored){
   this.id = id;
   this.question = question;
   this.correctAnswer = correctAns || ' . . . ';
   this.userAnswer = userAns || ' ... ';
   this.userScored = scored || '-';
};

//////////////////////////////////
////////     SETUP FUNCTION
//////////////////////////////////

function setUp() {
   
   //////  INVOKE FIRST QUESTION
   showQuestion(currentQuestionID);
   

   /////   START COUNTING THETIME
   var date = new Date();
   
   var startTime = date.getTime();
   
   endTime = startTime + 60*1000;
   //(quiz.time_seconds+1)
   timeLeft = date.getTime() - endTime;
   
   timer();
      
}

function timer(){   

   //// USES GLOBAL TIMELEFT
   if(timeLeft){
      var timer = setInterval(function(){
            var date = new Date();
            var currentTime = date.getTime();

            timeLeft = parseInt((endTime - currentTime )/1000);

            var quizTimeMinutes = parseInt(timeLeft / 60);
            var quizTimeSeconds = parseInt(timeLeft % 60);
         
            if (quizTimeSeconds < 10) {
               quizTimeSeconds = '0'+quizTimeSeconds;
            }
         
            var timeToShow = 'pozostało : '+quizTimeMinutes+'m '+quizTimeSeconds+'s ';

        /////////////////////////////////
            if (!timeLeft){
               clearInterval(timer);
               endOfQuiz();            
            }else{
               document.getElementsByClassName('quiz-status-time')[0].innerHTML = timeToShow;
            }
        /////////////////////////////////

         }, 1000)    
   }
}
///////////////////////////
/////////   FUNCTIONS  ///
//////////////////////////

function showQuestion(n) {
   
   if(currentQuestionID != quizNoOfQuestions)
      {
         
        //////////////////////////////////
       /////////  ONCE FOR QUESTION  /////
      ///////////////////////////////////   

         //////// UPDATE ID
         //////////////////
         var quizStatusID = 
             'ID : '+(currentQuestionID+1)+'/'+quizNoOfQuestions;
         document.getElementsByClassName('quiz-status-id')[0].innerHTML = quizStatusID;



         var createQuestion;
            createQuestion = document.createElement('h3');
            createQuestion.id = "quiz-question-anchor";
            createQuestion.className = "quiz-question quiz-bar";
            createQuestion.innerHTML = quiz.questions[n].question;

         document.getElementById('quiz').appendChild(createQuestion);

         document.getElementById("quiz-submit-label").className = "quiz-submit quiz-bar quiz-submit--default";
       ////////////////////////////////
      /////////LOOP FOR EACH ANSWER///
      ///////////////////////////////

         quiz.questions[n].answers.forEach(function(element, i){

            //CREATE ANSWER NODES//
            var createAnswer = document.createElement('input')
               i++;
               createAnswer.type = 'radio';
               createAnswer.setAttribute('name','answer');
               createAnswer.id = 'ans_'+i;


            var createLabelForAnswer = document.createElement('label');
               createLabelForAnswer.setAttribute('for','ans_'+i );
               createLabelForAnswer.className = "quiz-bar-answer quiz-bar";   
               createLabelForAnswer.innerHTML = element.answer;

            //APPEND THEM//
            document.getElementById('quiz').appendChild(createAnswer);   
            document.getElementById('quiz').appendChild(createLabelForAnswer);   

            //ADD PROPER ONCLICK LISTENER FOR EACH BUTTON//
            document.getElementById('ans_'+i).addEventListener('click',function(){
               console.log(i);
               userAnswerID = i;
               userAnswer = document.getElementsByTagName('label')[userAnswerID-1].innerHTML;
               document.getElementById("quiz-submit-label").className = "quiz-submit quiz-bar quiz-submit--answer";
            });

            //SAVE CORRECT ANSWER ID and TXT FOR STATS
            if(element.correct === true){
               
               questionAnswerID = element.id ;
               console.log("Correct answer : "+element.answer);
               }      
         });
   }else{
      /////INVOKE END OF QUIZ///
      endOfQuiz();
      /////////////////////////
   }
   
}


function answerQuestion(n){
   
   ///PROCEED IF USER GAVE ANY ANSWER
   if(userAnswerID != null){
      
      
      ///SCAN FOR CORRECT ANSWER AND SAVE
      //////////////////////////////////
      quiz.questions[n].answers.forEach(function(element){
            if(element.correct == true){
               questionAnswer = element.answer;
            }
      });
      
      ///SAVE USER ANSWER AS STRING 
      var userAnswer = quiz.questions[n].answers[userAnswerID-1];
   
      ///// IF USER SCORED +/- THEN RESET TO null
      if(userAnswer.correct)
      {
         userScored = '+';
         totalScore++;
      }else{
         userScored = '-';
      }
      userAnswerID = null;
      
      
      ///ROLL QUESTIONS
      currentQuestionID++;
      
      ///UPDATE CLASS OF BAR TO DEFAULT
      document.getElementById("quiz-submit-label").className = "quiz-submit quiz-bar quiz-submit--default";
      
      ///UPDATE PROGRESS BAR
      var progress = currentQuestionID/quizNoOfQuestions ;
      document.getElementsByTagName('progress')[0].setAttribute('value', progress);
      
      ///CLEAR QUIZ AND SHOW NEXT
      document.getElementById('quiz').innerHTML = '';
      showQuestion(currentQuestionID);
      
   }else{
      ///CHANGE STYLE OF SUBMIT BUTTON IF NO ANSWER WERE GIVEN
      document.getElementById("quiz-submit-label").className = "quiz-submit quiz-bar quiz-submit--noanswer";
   }   
   
   //////////////////////////////////////////////////////////////////////////////////////////////
   /// PUSH AS NEW OBJECT IN ANSWER ARRAY 
   
   var ans = new Answer(
      currentQuestionID,
      quiz.questions[n].question,
      questionAnswer,
      userAnswer.answer,
      userScored
   );
   answers.push(ans);
   
   ////
   //////////////////////////////////////////////////////////////////////////////////////////////

}

function endOfQuiz(timeLeft){
   

   ///QUIZ DETATCH
   ////////////////
   document.getElementById("quiz").innerHTML = '';
   
   ///SUBMIT OFF
   ///////////////
   document.getElementById("quiz-submit-label").outerHTML = '';
   
   ////CREATE TABLE
   ////////////////////////
   var table = document.createElement('table');
   table.className = 'quiz-table';
    
   var Container = document.getElementById("quiz-box");
   Container.innerHTML = '';
   
   /////////////////////////////////////////////////////
   ///////FEEDBACK      SCREEEN             ////////////
   /////////////////////////////////////////////////////

   var div = document.createElement('div');
   div.className = 'feedback feedback-header';
   div.innerHTML = '<h1>TIMELEFT<h1> <br> <h2>'
                     +parseInt(timeLeft / 60);
                     +parseInt(timeLeft % 60);
                     +'</h2>';
   
   Container.appendChild(div);

   var currentDiv = document.getElementsByTagName('div')[0];
   var totPoints = document.createElement('p');
   totPoints.className = 'feedback-points';
   totPoints.innerHTML = totalScore+'/'+quizNoOfQuestions;
   currentDiv.appendChild(totPoints);

   currentDiv.appendChild(totPoints);

   //// CHECKS ARE THERE ANY UNANSWERED QUESTIONS IF YOU GOT TIMELEFT
   if(!timeLeft){

   }else{
      timeLeft = 0
   }
       
   /////////////////////////////////////////////////////
   /////////////////////        ////////////////////////
   ///////////////                   ///////////////////
   answers.forEach(function(element, index){
   
      //// CREATE DIV FOR EACH QUESTION 
      var div = document.createElement('div');

      //// ADD PROPER CSS CLASS
      if(element.userScored == '+'){
         div.className = 'feedback feedback-answer--good';         
      }else{
         div.className = 'feedback feedback-answer--bad';
      }

      //// APPEND DIV AND CHOOSE CURRENT DIV
      Container.appendChild(div);
      var currentDiv = Container.getElementsByTagName('div')[index +1];

      //// CREATE PARAGRAPHS FOR FEEDBACK DIV
      var parQuestion = document.createElement('p');
      var parPoints = document.createElement('p');
      var parUserAnswer = document.createElement('li');
      var parCorrectAnswer = document.createElement('li');
      
      //// ASSIGN VALUES 
      parQuestion.innerHTML = element.id+'. '+element.question ;
      parPoints.innerHTML = '0';
      parUserAnswer.innerHTML = ' '+element.userAnswer;
      parCorrectAnswer.innerHTML = ' '+element.correctAnswer;
      
      
      //// SET OF APPENDS
      
      if(element.userScored == '-'){

         parUserAnswer.className = 'feedback-p--crossed';
         parPoints.className = 'feedback-points feedback-points--bad';
         currentDiv.appendChild(parPoints);
         currentDiv.appendChild(parQuestion);
         currentDiv.appendChild(parUserAnswer);         
         currentDiv.appendChild(parCorrectAnswer);

      }else{

         parPoints.innerHTML = '+1';
         parPoints.className = 'feedback-points feedback-points--good';

         currentDiv.appendChild(parPoints);
         currentDiv.appendChild(parQuestion);
         currentDiv.appendChild(parUserAnswer);
      }
      
   });
   ///////////////                 ////////////////////
   ////////////////////      //////////////////////////
   ////////////////////////////////////////////////////
   
  
}


































