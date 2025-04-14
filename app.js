$(document).ready(function() {
  let currentAnswer = null;
  let dayCount = getStoredDay();
  let timerInterval = null;
  
  $("#dayCounter").text(dayCount);
  
  $("#difficulty").change(function() {
    if ($(this).val() === "custom") {
      $("#customDigitsContainer").removeClass("hidden");
    } else {
      $("#customDigitsContainer").addClass("hidden");
    }
  });
  
  $("#startBtn").click(function() {
    let difficulty = $("#difficulty").val();
    
    if (difficulty === "custom") {
      difficulty = $("#customDigits").val();
      if (isNaN(difficulty) || difficulty < 1) {
        alert("Please enter a valid number of digits (minimum 1)");
        return;
      }
    }
    
    const operations = getSelectedOperations();
    
    if (operations.length === 0) {
      alert("Please select at least one operation");
      return;
    }
    
    generateChallenge(parseInt(difficulty), operations);
  });
  
  $("#submitBtn").click(function() {
    const userAnswer = parseInt($("#answer").val());
    
    if (isNaN(userAnswer)) {
      alert("Please enter a valid number");
      return;
    }
    
    checkAnswer(userAnswer);
  });
  
  $("#nextBtn").click(function() {
    let difficulty = $("#difficulty").val();
    
    if (difficulty === "custom") {
      difficulty = $("#customDigits").val();
    }
    
    const operations = getSelectedOperations();
    generateChallenge(parseInt(difficulty), operations);
  });
  
  $("#answer").keypress(function(e) {
    if (e.which === 13) {
      $("#submitBtn").click();
    }
  });
  
  $("#showResultBtn").click(function() {
    $("#result")
      .removeClass("hidden text-green-500")
      .addClass("text-red-500")
      .text(`The answer is ${currentAnswer}`);
    $("#nextBtn").removeClass("hidden");
  });
  
  function getSelectedOperations() {
    const operations = [];
    $(".operation:checked").each(function() {
      operations.push($(this).val());
    });
    return operations.join("");
  }

  function generateChallenge(digits, operations) {
    if (isNaN(digits) || digits < 1) {
      alert("Invalid difficulty. Must be a number greater than 0.");
      return;
    }
    
    if (!operations || operations.length === 0) {
      alert("No operations selected.");
      return;
    }
    
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    
    const ops = operations.split("");
    const generateNumber = (digits) => {
      if (digits === 1) return Math.floor(Math.random() * 9) + 1;
      const min = 10 ** (digits - 1);
      const max = (10 ** digits) - 1;
      return Math.floor(Math.random() * (max - min + 1) + min);
    };
    
    const randomOp = ops[Math.floor(Math.random() * ops.length)];
    let num1, num2, answer, question;
    
    switch (randomOp) {
      case "+":
        num1 = generateNumber(digits);
        num2 = generateNumber(digits);
        question = `${num1} + ${num2}`;
        answer = num1 + num2;
        break;
      case "-":
        num1 = generateNumber(digits);
        num2 = generateNumber(digits);
        question = `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`;
        answer = Math.max(num1, num2) - Math.min(num1, num2);
        break;
      case "*":
        num1 = generateNumber(digits);
        num2 = generateNumber(digits);
        question = `${num1} × ${num2}`;
        answer = num1 * num2;
        break;
      case "/":
        num2 = generateNumber(digits);
        
        if (num2 === 0) num2 = 1;
        
        num1 = generateNumber(digits);
        
        if (num1 === 0) num1 = 1;
        
        const dividend = num1 * num2;
        
        question = `${dividend} ÷ ${num2}`;
        answer = num1;
        break;
      default:
        num1 = generateNumber(digits);
        num2 = generateNumber(digits);
        question = `${num1} + ${num2}`;
        answer = num1 + num2;
    }
    
    $("#challenge").removeClass("hidden");
    $("#question").text(question);
    $("#answer").val("").focus();
    $("#result").addClass("hidden");
    $("#nextBtn").addClass("hidden");
    $("#showResultBtn").addClass("hidden");
    $("#timer").text("3:00").removeClass("hidden");
    
    currentAnswer = answer;
    
    let totalSeconds = 180;
    timerInterval = setInterval(function() {
      totalSeconds--;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      $("#timer").text(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      
      if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        $("#showResultBtn").removeClass("hidden");
      }
    }, 1000);
  }
  
  function checkAnswer(userAnswer) {
    if (userAnswer === currentAnswer) {
      $("#result")
        .removeClass("hidden text-red-500")
        .addClass("text-green-500")
        .text("Correct!");
    } else {
      $("#result")
        .removeClass("hidden text-green-500")
        .addClass("text-red-500")
        .text(`Wrong! The correct answer is ${currentAnswer}`);
    }
    
    $("#nextBtn").removeClass("hidden");
  }
  
  function getStoredDay() {
    const storedDay = localStorage.getItem("fhm_day");
    const lastVisit = localStorage.getItem("fhm_last_visit");
    const today = new Date().toDateString();
    
    if (!lastVisit || lastVisit !== today) {
      const newDayCount = storedDay ? parseInt(storedDay) + 1 : 1;
      localStorage.setItem("fhm_day", newDayCount);
      localStorage.setItem("fhm_last_visit", today);
      return newDayCount;
    }
    
    return storedDay ? parseInt(storedDay) : 1;
  }
  
}); 
