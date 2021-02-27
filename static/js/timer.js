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

