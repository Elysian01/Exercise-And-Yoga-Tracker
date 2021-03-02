const advDisAdv = {
    dog : {
      adv : ["Tones the arms and legs; opens and strengthens the shoulders in flexion", "lengthens the hamstrings and stretches the calves", "prepares the body for heating inversion"],
      disAdv : [" Be careful if there is an existing wrist or shoulder injury", "high blood pressure or headache should modify with support for the head (bolster or blankets)", "late-term pregnancy"]
    },
    tree : {
      adv : ["physical and mental steadiness", "Tree Pose improves focus and concentration while calming your mind.", "Tree Pose stretches the thighs, groins, torso, and shoulders. It builds strength in the ankles and calves, and tones the abdominal muscles"],
      disAdv : ["experiencing headaches, insomnia, low blood pressure, or if you are lightheaded and/or dizzy.Those with high blood pressure should not raise their arms overhead in the pose"]
    },
    mountain : {
      adv : ["Abdomen, back, legs", "prepares the body for heat extraction"],
      disAdv : [" Be careful if there is an existing wrist or shoulder injury"]
    },
    warrior1 : {
      adv : [" Stretches the chest and lungs, shoulders and neck, belly, groins (psoas)", "Strengthens the shoulders and arms, and the muscles of the back", "Strengthens and stretches the thighs, calves, and ankles"],
      disAdv : [" High blood pressure", "Heart problems", "Students with shoulder problems should keep their raised arms parallel (or slightly wider than parallel) to each other", "Students with neck problems should keep their heads in a neutral position and not look up at the hands."]
    },
    warrior2 : {
      adv : ["Strengthens and stretches the legs and ankles", "Stretches the groins, chest and lungs, shoulders", "Stimulates abdominal organs","Increases stamina", "Relieves backaches, especially through the second trimester of pregnancy", "Therapeutic for carpal tunnel syndrome, flat feet, infertility, osteoporosis, and sciatica"],
      disAdv : ["Diarrhea"," High blood pressure" ,"Neck problems", "Don’t turn your head to look over the front hand"]
    },
    goddess : {
      adv : [" major hip-opening, lower back, hamstrings, knees, pelvic, quadriceps benefits", "recommended during pregnancy", "help improve balance, focus, and concentration,"],
      disAdv : [" Be careful if there is an existing wrist or shoulder injury", "high blood pressure or headache should modify with support for the head (bolster or blankets)", "late-term pregnancy"]
    }
  }

  console.log(pred_index + 'fdv');
  var pose = "tree";
  document.getElementById('pose').innerHTML = pose;

  if(pose === "dog"){
    let advantages = advDisAdv.dog.adv;
    var advs = "";
    advantages.forEach((item, index) => {
      advs += item + " " + "<br><br>";
    }) 
    document.getElementById("adv").innerHTML = advs;

    let disAdvantages = advDisAdv.dog.disAdv;
    var disAd = "";
    disAdvantages.forEach((item, index) => {
      disAd += item + " " + "<br><br>";
    }) 
    document.getElementById("disAdv").innerHTML = disAd;
  }
  else if(pose === "tree"){
    let advantages = advDisAdv.tree.adv;
    var advs = "";
    advantages.forEach((item, index) => {
      advs += item + " " + "<br><br>";
    }) 
    document.getElementById("adv").innerHTML = advs;

    let disAdvantages = advDisAdv.tree.disAdv;
    var disAd = "";
    disAdvantages.forEach((item, index) => {
      disAd += item + " " + "<br><br>";
    }) 
    document.getElementById("disAdv").innerHTML = disAd;

  } else if(pose === "mountain"){
    let advantages = advDisAdv.mountain.adv;
    var advs = "";
    advantages.forEach((item, index) => {
      advs += item + " " + "<br><br>";
    }) 
    document.getElementById("adv").innerHTML = advs;

    let disAdvantages = advDisAdv.mountain.disAdv;
    var disAd = "";
    disAdvantages.forEach((item, index) => {
      disAd += item + " " + "<br><br>";
    }) 
    document.getElementById("disAdv").innerHTML = disAd;

  } else if(pose === "warrior1"){
    let advantages = advDisAdv.warrior1.adv;
    var advs = "";
    advantages.forEach((item, index) => {
      advs += item + " " + "<br><br>";
    }) 
    document.getElementById("adv").innerHTML = advs;

    let disAdvantages = advDisAdv.warrior1.disAdv;
    var disAd = "";
    disAdvantages.forEach((item, index) => {
      disAd += item + " " + "<br><br>";
    }) 
    document.getElementById("disAdv").innerHTML = disAd;

  } else if(pose === "warrior2"){
    let advantages = advDisAdv.warrior2.adv;
    var advs = "";
    advantages.forEach((item, index) => {
      advs += item + " " + "<br><br>";
    }) 
    document.getElementById("adv").innerHTML = advs;

    let disAdvantages = advDisAdv.warrior2.disAdv;
    var disAd = "";
    disAdvantages.forEach((item, index) => {
      disAd += item + " " + "<br><br>";
    }) 
    document.getElementById("disAdv").innerHTML = disAd;

  } else if(pose === "goddess"){
    let advantages = advDisAdv.goddess.adv;
    var advs = "";
    advantages.forEach((item, index) => {
      advs += item + " " + "<br><br>";
    }) 
    document.getElementById("adv").innerHTML = advs;

    let disAdvantages = advDisAdv.goddess.disAdv;
    var disAd = "";
    disAdvantages.forEach((item, index) => {
      disAd += item + " " + "<br><br>";
    }) 
    document.getElementById("disAdv").innerHTML = disAd;

  }



var sec = 0;
var min = 0;
var stopStatus = false;

var x;
const startTimer = () => {
    x = setInterval(function() {
        sec++;
        $('.timer').text(min + ' : ' + sec);
        if (stopStatus === false) {
            if (sec === 59) {
                sec = -1;
                min++;

            }
        } else {
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

    let time = min + " : " + sec;
    if (sessionStorage.getItem("excerciseDuration") === null) {
        
        var arr = new Array();
        arr[0]= { "excerciseName" : time };
        for (let i = 0; i < arr.length; i++) {
          arr[i] = JSON.stringify(arr[i]);
        }

        arr = JSON.stringify(arr);

        //save to session storage
        sessionStorage.setItem('excerciseDuration', arr);
        var y = sessionStorage.getItem('excerciseDuration');
        y = JSON.parse(y);
        y.forEach((item, index) => {
          y[index] = JSON.parse(item);
        });
        location.reload();

    } else {
      var y = sessionStorage.getItem('excerciseDuration');
      y = JSON.parse(y);
      y.forEach((item, index) => {
        y[index] = JSON.parse(item);
      });

      y.push({ "excerciseName" : time});

      for (let i = 0; i < y.length; i++) {
        y[i] = JSON.stringify(y[i]);
      }
      y = JSON.stringify(y);

      //save to session storage
      sessionStorage.setItem('excerciseDuration', y); 
      location.reload(); 
    }

    stopStatus = true;
    clearInterval(x);
    sec = 0;
    min = 0;
    $('.timer').text(min + ' : ' + sec);
    
}

const loadTableData = () => {
    var y = sessionStorage.getItem('excerciseDuration');
    y = JSON.parse(y);
    y.forEach((item, index) => {
        y[index] = JSON.parse(item);
    });

    y.forEach((item, index) => {
      $(".table").find('tbody').append(`<tr><td>${Object.keys(item)}</td><td>${Object.values(item)}</td></tr>`);
    });
}
