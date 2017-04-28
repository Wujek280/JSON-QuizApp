'use strict';

/////////OBTAINING QUIZ FROM URL
////////////////////////////////

var path = 'https://cdn.rawgit.com/kdzwinel/cd08d08002995675f10d065985257416/raw/811ad96a0567648ff858b4f14d0096ba241f28ef/quiz-data.json';

/* STACK OVERFLOW */ 

function readJSON(file) {
    var request = new XMLHttpRequest();
    request.open('GET', file, false);
    request.send(null);
    if (request.status == 200)
        return request.responseText;
};

var quiz = JSON.parse(readJSON(path));

/*     ***     */

/////////NUMBERS FOR MAIN PAGE 
//////////////////////////////

var quizNoOfQuestions = quiz.questions.length;
var quizTimeMinutes = parseInt(quiz.time_seconds / 60);
var quizTimeSeconds = parseInt(quiz.time_seconds % 60);

console.log();

