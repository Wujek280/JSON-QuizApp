///////////////////////////////////////
/////////    VANILLA JS
//////////////////////////////////////
'use strict';


function interFace() {
   readJSON;
   setUp;
   showQuestion;
   answerQuestion;
   endOfQuiz;
}
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


function readJSON(fileURL) {
    var request = new XMLHttpRequest();
    request.open('GET', fileURL, false);
    request.send(null);
    if (request.status == 200)
        return request.responseText;
};

var quiz = JSON.parse(readJSON(path));

var quizNoOfQuestions = quiz.questions.length;

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
var timer; // ASSIGN TIMER ID TO IT (setInterval() in seUp() )

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
   createQuizDOM();
   showQuestion(0);
   setTimer();
}
///////////////////////////
/////////   FUNCTIONS  ///
//////////////////////////

function showQuestion(n) { 
 
 if(currentQuestionID != quizNoOfQuestions){
         
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
      
         ///////////////////////////////
         /////////LOOP FOR EACH ANSWER//
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
      
      ///SAVE USER ANSWER TO OBJECT
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
      document.getElementById("quiz-submit-label").
      className = "quiz-submit quiz-bar quiz-submit--default";
      
      ///UPDATE PROGRESS BAR
      var progress = currentQuestionID/quizNoOfQuestions ;
      document.getElementsByTagName('progress')[0].
      setAttribute('value', progress);
      
      ///CLEAR QUIZ AND SHOW NEXT
      document.getElementById('quiz').innerHTML = '';
      showQuestion(currentQuestionID);

      /////////////////////////////////////////////////
      /////////////////////////////////////////////////
      /// PUSH AS NEW OBJECT IN ANSWER ARRAY //////////
      ///                                    //////////
      answers.push( new Answer(              //////////     
         currentQuestionID,                  //////////   
         quiz.questions[n].question,         //////////  
         questionAnswer,                     //////////
         userAnswer.answer,                  //////////
         userScored                          //////////     
      ));                                    ////////// 
      ///                                    //////////
      ///                                    //////////
      /////////////////////////////////////////////////
      /////////////////////////////////////////////////
      
   }

   if ((userAnswerID == null )&&( currentQuestionID != 0 )){
      ///CHANGE STYLE OF SUBMIT BUTTON IF NO ANSWER WERE GIVEN AND RESET AFTER 500ms
      document.getElementById("quiz-submit-label").className = "quiz-submit quiz-bar quiz-submit--noanswer";
      setTimeout(function(){
         document.getElementById("quiz-submit-label").className = "quiz-submit quiz-bar quiz-submit--default";
      },500)
   }   
}


//////////////////////
/////SET TIMER ///////
//////////////////////
function setTimer(){
   /////   START COUNTING THETIME
   var date = new Date();
   
   var startTime = date.getTime();
   
   endTime = startTime + (quiz.time_seconds+1)*1000;

   timeLeft = date.getTime() - endTime;
   
            timer = setInterval(function(){
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
            if (timeLeft == 0){
               endOfQuiz();  
            }else{
               document.getElementsByClassName('quiz-status-time')[0].innerHTML = timeToShow;
            }
         }, 1000)
   }



function endOfQuiz(){
   
   clearInterval(timer);
   
   ///QUIZ DETATCH
   /////////////////////////////////////////////////////
   document.getElementById("quiz").innerHTML = '';
   document.getElementById("quiz-submit-label").outerHTML = '';

   var Container = document.getElementById("quiz-box");
   Container.innerHTML = '';
   
   /////////////////////////////////////////////////////
   ///////FEEDBACK      SCREEEN             ////////////
   /////////////////////////////////////////////////////
   var div = document.createElement('div');
   div.className = 'feedback feedback-header';

   //// CALCULATE HOW MUCH TIME LEFT
   var secondsLeft = parseInt(timeLeft % 60);
   var minutesLeft = parseInt(timeLeft / 60);

   if(secondsLeft < 10) secondsLeft = '0'+secondsLeft;

   div.innerHTML = '<h1>TIMELEFT<h1> <br> <h2>'
                     +minutesLeft+':'
                     +secondsLeft+' min'
                     +'</h2>';
   
   Container.appendChild(div);

   var currentDiv = document.getElementsByTagName('div')[0];
   var totPoints = document.createElement('p');
   totPoints.className = 'feedback-points';
   totPoints.innerHTML = totalScore+'/'+quizNoOfQuestions;
   currentDiv.appendChild(totPoints);

   currentDiv.appendChild(totPoints);

   //// CHECKS ARE THERE ANY UNANSWERED QUESTIONS IF YOU GOT TIMELEFT



   if(timeLeft == 0){
      // HERE YOU CAN OBTAIN TIMELEFT
   }else{
      timeLeft = 0;
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
         var currentDiv = Container.getElementsByTagName('div')[index +1]; ///offset by 1, becouse of first header div

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
                  
         //// SET OF APPENDS IN FEEDBACK
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



   function createQuizDOM(){

      //// CLEAN OUT QUIZ AND INDEX HEADER BOX STUFF
      document.getElementById('index-header-container').innerHTML = '';

      var Container = document.getElementById("quiz-box");
      Container.innerHTML = '';

      ///create menu elements
      var nav = document.createElement('nav');
      nav.className = "quiz-status";
      Container.appendChild(nav);

      var div = document.createElement('div');
      div.id = "quiz";
      Container.appendChild(div);

         var navBar = document.getElementsByTagName('nav')[0];

         var progressBar = document.createElement('progress');
         progressBar.className = "quiz-status-progress";
         navBar.appendChild(progressBar);

         var H4_time = document.createElement('h4');
         H4_time.className = "quiz-status-time";
         H4_time.innerHTML = 'timeleft '
         navBar.appendChild(H4_time);

         var H4_id = document.createElement('h4');
         H4_id.className = "quiz-status-id";
         H4_id.innerHTML = 'ID : '
         navBar.appendChild(H4_id);

         navBar.appendChild(document.createElement('br'));

      var submitBarInputLabel = document.createElement('label');

      submitBarInputLabel.className = "quiz-submit quiz-bar";
      submitBarInputLabel.id = "quiz-submit-label";
      Container.appendChild(submitBarInputLabel);

      var submitBarInput = document.createElement('input');
      submitBarInput.id = 'submit-button';
      submitBarInput.value = ' ';
      submitBarInput.name = 'submit';
      submitBarInput.type = 'button';
      var label = document.getElementById('quiz-submit-label');

      ///EVENT LISTENER
      document.getElementById('quiz-submit-label').addEventListener('click', function(){
         answerQuestion(currentQuestionID);
      });
            
   }
