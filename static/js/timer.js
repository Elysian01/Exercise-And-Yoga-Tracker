var sec = 0;
var min = 0;
var stopStatus = false;

var x;
const startTimer = () => {
    x = setInterval(function() {
        sec++;
        $('.timer').text(min + ' : ' + sec);
        if (stopStatus === false) {
            if(sec === 59){
                sec = -1;
                min++;
                
            }
        }else {
            clearInterval(x);
            startTimer();   
        }   
    }, 1000);
}

const stopTimer = () => {
    console.log("stop timer");
    stopStatus = true;
    clearInterval(x);
}

const resetTimer = () => {
    console.log("reset timer");
    
    if(sessionStorage.getItem('exerciseDuration')){
        let val = sessionStorage.getItem('exerciseDuration');
        console.log(val.excercise + ' ' + val.duration);
    }else{
        let excerciseName = "dog";
        sessionStorage.setItem('exerciseDuration', {
            "excercise" : excerciseName,
            "duration" : min + " : " + sec
        });
    }

    stopStatus = true;
    clearInterval(x);
    sec = 0;
    min = 0;
    $('.timer').text(min + ' : ' + sec);
}
