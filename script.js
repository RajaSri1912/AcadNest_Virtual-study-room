// Timer Variables
let timer;
let minutes = 25;
let seconds = 0;
let isRunning = false;

function updateDisplay() {
  document.getElementById('timerDisplay').textContent = 
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(timer);
          isRunning = false;
          alert('Session Complete! Well Done!');
          alert('You deserve a break, Come back after 25 minutes')
          return;
        }
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
      updateDisplay();
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  minutes = 25;
  seconds = 0;
  updateDisplay();
}

updateDisplay();

// Add Task
function addGoal() {
  const input = document.getElementById('goalInput');
  if (input.value.trim() !== "") {
    const li = document.createElement('li');
    li.textContent = input.value;
    li.onclick = () => {
      li.classList.toggle('completed');
    };
    document.getElementById('goalList').appendChild(li);
    input.value = "";
  }
}

// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
}

// View Notes
function viewNotes() {
  const notes = document.getElementById('notes');
  const video = document.getElementById('bgVideo');

  if (notes.style.display === "none") {
    notes.style.display = "block";
    video.style.display = "none";
  } else {
    notes.style.display = "none";
    video.style.display = "block";
  }
}

// Activate Feather Icons
feather.replace();

function updateProgress() {
    const tasks = document.querySelectorAll('#goalList li');
    const completedTasks = document.querySelectorAll('#goalList li input[type="checkbox"]:checked');
  
    if (tasks.length === 0) {
      document.getElementById('progressDisplay').textContent = '';
      return;
    }
  
    const percentage = Math.round((completedTasks.length / tasks.length) * 100);
    document.getElementById('progressDisplay').textContent = `${percentage}% - You are reaching your session target!`;
  }

//   document.getElementById('addTaskBtn').addEventListener('click', function() {
//     const taskInput = document.getElementById('taskInput');
//     const taskText = taskInput.value.trim();
  
//     if (taskText !== '') {
//       const li = document.createElement('li');
//       const checkbox = document.createElement('input');
//       checkbox.type = 'checkbox';
  
//       li.appendChild(checkbox);
//       li.appendChild(document.createTextNode(' ' + taskText));
  
//       document.getElementById('goalList').appendChild(li);
  
//       // Attach listener for updating progress
//       checkbox.addEventListener('change', updateProgress);
  
//       taskInput.value = '';
  
//       // Update progress after adding
//       updateProgress();
//     }
//   });
  
function addGoal() {
    const goalInput = document.getElementById('goalInput');
    const goalText = goalInput.value.trim();
    const goalList = document.getElementById('goalList');
  
    if (goalText !== '') {
      const li = document.createElement('li');
  
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.onclick = updateProgress;
  
      const label = document.createElement('label');
      label.textContent = goalText;
  
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '🗑️';
      deleteButton.style.marginLeft = '10px';
      deleteButton.style.border = 'none';
      deleteButton.style.background = 'none';
      deleteButton.style.cursor = 'pointer';
      deleteButton.style.fontSize = '18px';
      deleteButton.onclick = function() {
        li.remove();
        updateProgress();
      };
  
      li.appendChild(checkbox);
      li.appendChild(label);
      li.appendChild(deleteButton);
      goalList.appendChild(li);
  
      goalInput.value = '';
      updateProgress();
    }
  }
  
  
  
  function updateProgress() {
    const tasks = document.querySelectorAll('#goalList li input[type="checkbox"]');
    const completedTasks = document.querySelectorAll('#goalList li input[type="checkbox"]:checked');
    const progressDisplay = document.getElementById('progressDisplay');
  
    if (tasks.length === 0) {
      progressDisplay.textContent = '';
      return;
    }
  
    const percentage = Math.round((completedTasks.length / tasks.length) * 100);
    let message = '';
  
    if (percentage === 0) {
      message = 'Let\'s get started!';
    } else if (percentage > 0 && percentage < 20) {
      message = 'You have started! Keep going!';
    } else if (percentage >= 20 && percentage < 50) {
      message = 'You are making progress! Stay on track!';
    } else if (percentage >= 50 && percentage < 75) {
      message = 'Come on! You can do it!';
    } else if (percentage >= 75 && percentage < 100) {
      message = 'Almost there! Keep pushing!';
    } else if (percentage === 100) {
      message = 'Yaaahoooo! You did it!';
    }
  
    progressDisplay.textContent = `${percentage}% - ${message}`;
  }