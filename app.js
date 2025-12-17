// Health and Quality of Life Tracker Application

// Data structure
let healthData = {
    water: 0,
    exercise: 0,
    sleep: 0,
    mood: null,
    moodEmoji: null,
    date: new Date().toDateString()
};

// Initialize the app
function init() {
    loadData();
    updateDisplay();
    displayDate();
    checkDateChange();
}

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('healthData');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        // Check if data is from today
        if (parsed.date === new Date().toDateString()) {
            healthData = parsed;
        } else {
            // New day, reset data but keep the structure
            resetDay();
        }
    }
}

// Save data to localStorage
function saveData() {
    healthData.date = new Date().toDateString();
    localStorage.setItem('healthData', JSON.stringify(healthData));
}

// Update all displays
function updateDisplay() {
    updateWaterDisplay();
    updateExerciseDisplay();
    updateSleepDisplay();
    updateMoodDisplay();
    updateSummary();
}

// Water tracking functions
function addWater() {
    if (healthData.water < 12) {
        healthData.water++;
        saveData();
        updateDisplay();
        showNotification('💧 Bardak eklendi!');
    } else {
        showNotification('⚠️ Maksimum su miktarına ulaştınız!');
    }
}

function resetWater() {
    healthData.water = 0;
    saveData();
    updateDisplay();
    showNotification('💧 Su takibi sıfırlandı');
}

function updateWaterDisplay() {
    const waterTotal = document.getElementById('water-total');
    waterTotal.textContent = `${healthData.water} / 8 bardak`;
    
    // Add color based on progress
    if (healthData.water >= 8) {
        waterTotal.style.color = '#4CAF50';
    } else if (healthData.water >= 4) {
        waterTotal.style.color = '#FF9800';
    } else {
        waterTotal.style.color = '#f44336';
    }
}

// Exercise tracking functions
function addExercise() {
    const input = document.getElementById('exercise-input');
    const minutes = parseInt(input.value);
    
    if (minutes && minutes > 0) {
        healthData.exercise += minutes;
        saveData();
        updateDisplay();
        input.value = '';
        showNotification(`🏃 ${minutes} dakika egzersiz eklendi!`);
    } else {
        showNotification('⚠️ Lütfen geçerli bir süre girin');
    }
}

function updateExerciseDisplay() {
    const exerciseTotal = document.getElementById('exercise-total');
    exerciseTotal.textContent = `${healthData.exercise} dk`;
    
    // Add color based on recommended 30 minutes
    if (healthData.exercise >= 30) {
        exerciseTotal.style.color = '#4CAF50';
    } else if (healthData.exercise >= 15) {
        exerciseTotal.style.color = '#FF9800';
    } else {
        exerciseTotal.style.color = '#f44336';
    }
}

// Mood tracking functions
function setMood(emoji, description) {
    healthData.mood = description;
    healthData.moodEmoji = emoji;
    saveData();
    updateDisplay();
    showNotification(`😊 Ruh haliniz kaydedildi: ${description}`);
    
    // Visual feedback
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function updateMoodDisplay() {
    const moodDisplay = document.getElementById('mood-display');
    if (healthData.moodEmoji) {
        moodDisplay.textContent = `${healthData.moodEmoji} ${healthData.mood}`;
        moodDisplay.style.color = '#4CAF50';
    } else {
        moodDisplay.textContent = '-';
        moodDisplay.style.color = '#999';
    }
    
    // Restore active state
    document.querySelectorAll('.mood-btn').forEach(btn => {
        if (btn.textContent === healthData.moodEmoji) {
            btn.classList.add('active');
        }
    });
}

// Sleep tracking functions
function setSleep() {
    const input = document.getElementById('sleep-input');
    const hours = parseFloat(input.value);
    
    if (hours && hours >= 0 && hours <= 24) {
        healthData.sleep = hours;
        saveData();
        updateDisplay();
        input.value = '';
        showNotification(`😴 ${hours} saat uyku kaydedildi!`);
    } else {
        showNotification('⚠️ Lütfen 0-24 arası bir değer girin');
    }
}

function updateSleepDisplay() {
    const sleepTotal = document.getElementById('sleep-total');
    sleepTotal.textContent = `${healthData.sleep} saat`;
    
    // Add color based on recommended 7-9 hours
    if (healthData.sleep >= 7 && healthData.sleep <= 9) {
        sleepTotal.style.color = '#4CAF50';
    } else if (healthData.sleep >= 6 || healthData.sleep <= 10) {
        sleepTotal.style.color = '#FF9800';
    } else if (healthData.sleep > 0) {
        sleepTotal.style.color = '#f44336';
    } else {
        sleepTotal.style.color = '#999';
    }
}

// Summary functions
function updateSummary() {
    const summaryDiv = document.getElementById('daily-summary');
    let summary = '';
    
    // Water summary
    if (healthData.water > 0) {
        const waterStatus = healthData.water >= 8 ? '✅' : '⏳';
        summary += `${waterStatus} <strong>Su:</strong> ${healthData.water} bardak içtiniz ${healthData.water >= 8 ? '(Hedef tamamlandı!)' : `(${8 - healthData.water} bardak daha)`}<br>`;
    }
    
    // Exercise summary
    if (healthData.exercise > 0) {
        const exerciseStatus = healthData.exercise >= 30 ? '✅' : '⏳';
        summary += `${exerciseStatus} <strong>Egzersiz:</strong> ${healthData.exercise} dakika ${healthData.exercise >= 30 ? '(Harika!)' : '(Biraz daha arttırın)'}<br>`;
    }
    
    // Sleep summary
    if (healthData.sleep > 0) {
        const sleepStatus = (healthData.sleep >= 7 && healthData.sleep <= 9) ? '✅' : '⏳';
        let sleepMsg = '';
        if (healthData.sleep < 7) {
            sleepMsg = '(Daha fazla uyumaya çalışın)';
        } else if (healthData.sleep > 9) {
            sleepMsg = '(Çok fazla uyumuş olabilirsiniz)';
        } else {
            sleepMsg = '(Mükemmel!)';
        }
        summary += `${sleepStatus} <strong>Uyku:</strong> ${healthData.sleep} saat ${sleepMsg}<br>`;
    }
    
    // Mood summary
    if (healthData.mood) {
        summary += `😊 <strong>Ruh Hali:</strong> ${healthData.moodEmoji} ${healthData.mood}<br>`;
    }
    
    if (summary === '') {
        summary = 'Henüz veri yok. Yukarıdaki takipçileri kullanarak günlük aktivitelerinizi kaydedin!';
    } else {
        summary += '<br><em>Harika iş çıkarıyorsunuz! Sağlıklı yaşam için devam edin! 💪</em>';
    }
    
    summaryDiv.innerHTML = summary;
}

// Reset day function
function resetDay() {
    if (confirm('Tüm günlük verileri sıfırlamak istediğinizden emin misiniz?')) {
        healthData = {
            water: 0,
            exercise: 0,
            sleep: 0,
            mood: null,
            moodEmoji: null,
            date: new Date().toDateString()
        };
        saveData();
        updateDisplay();
        showNotification('🔄 Tüm veriler sıfırlandı');
        
        // Remove active mood button
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }
}

// Display current date
function displayDate() {
    const dateElement = document.getElementById('current-date');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('tr-TR', options);
}

// Check if date has changed and reset if needed
function checkDateChange() {
    setInterval(() => {
        const currentDate = new Date().toDateString();
        if (healthData.date !== currentDate) {
            resetDay();
        }
    }, 60000); // Check every minute
}

// Notification system
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
