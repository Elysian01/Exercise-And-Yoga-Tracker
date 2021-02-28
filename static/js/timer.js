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
    
    if(false){
        let val = sessionStorage.getItem('exerciseDuration');

        console.log(val.excercise + ' ' + val.duration);
    }else{
        let excerciseName = "dog";
        
        let arr;
        let time = "0: 10";
        arr.push({ excerciseName : time });
        
        for(let i = 0; i < arr.length; i++){
            arr[i] = JSON.stringify(arr[i]);
        }

        arr = JSON.stringify(arr);

        //save to session storage
        sessionStorage.setItem('excerciseDuration', arr);
        var y = sessionStorage.getItem('excerciseDuration');
        y = JSON.parse(y);

        y.forEach((item, index) => {
            console.log(item);
        });

    }

    stopStatus = true;
    clearInterval(x);
    sec = 0;
    min = 0;
    $('.timer').text(min + ' : ' + sec);
}
