// Countdown Timer Configuration
const COUNTDOWN_CONFIG = {
  targetMonth: 7, // August (0-based)
  targetDay: 6,
  updateInterval: 1000, // Update every second
  localStorageKey: 'countdownData',
};

// Initialize countdown target date
function initializeTargetDate() {
  const currentYear = new Date().getFullYear();
  let targetDate = new Date(
    currentYear,
    COUNTDOWN_CONFIG.targetMonth,
    COUNTDOWN_CONFIG.targetDay
  ).getTime();
  const now = new Date().getTime();

  // If current date is past target date, set to next year
  if (now > targetDate) {
    targetDate = new Date(
      currentYear + 1,
      COUNTDOWN_CONFIG.targetMonth,
      COUNTDOWN_CONFIG.targetDay
    ).getTime();
  }

  return targetDate;
}

// Format number to always show two digits
function formatNumber(number) {
  return number.toString().padStart(2, '0');
}

// Calculate time units
function calculateTimeUnits(difference) {
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
}

// Update DOM elements with countdown values
function updateDOM(timeUnits) {
  const elements = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
  };

  // Update each element with animation
  Object.entries(timeUnits).forEach(([unit, value]) => {
    if (elements[unit]) {
      elements[unit].textContent = formatNumber(value);
      elements[unit].classList.add('pulse');
      setTimeout(() => elements[unit].classList.remove('pulse'), 1000);
    }
  });
}

// Store countdown data in localStorage
function storeCountdownData(timeUnits) {
  try {
    localStorage.setItem(
      COUNTDOWN_CONFIG.localStorageKey,
      JSON.stringify({
        ...timeUnits,
        timestamp: new Date().getTime(),
      })
    );
  } catch (error) {
    console.warn('Failed to store countdown data:', error);
  }
}

// Load countdown data from localStorage
function loadCountdownData() {
  try {
    const data = localStorage.getItem(COUNTDOWN_CONFIG.localStorageKey);
    if (data) {
      const parsedData = JSON.parse(data);
      const timeSinceLastUpdate = new Date().getTime() - parsedData.timestamp;

      // Only use stored data if it's less than 1 minute old
      if (timeSinceLastUpdate < 60000) {
        return parsedData;
      }
    }
  } catch (error) {
    console.warn('Failed to load countdown data:', error);
  }
  return null;
}

// Main countdown update function
function updateCountdown() {
  const targetDate = initializeTargetDate();
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference > 0) {
    const timeUnits = calculateTimeUnits(difference);
    updateDOM(timeUnits);
    storeCountdownData(timeUnits);
  } else {
    // Countdown finished
    updateDOM({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    localStorage.removeItem(COUNTDOWN_CONFIG.localStorageKey);
  }
}

// Initialize countdown
function initializeCountdown() {
  const storedData = loadCountdownData();
  if (storedData) {
    updateDOM(storedData);
  }
  updateCountdown(); // Initial update
  return setInterval(updateCountdown, COUNTDOWN_CONFIG.updateInterval);
}

// Start the countdown
const countdownInterval = initializeCountdown();

// Clean up interval when page is unloaded
window.addEventListener('beforeunload', () => {
  clearInterval(countdownInterval);
});

// Add click animations
document.querySelectorAll('button, a').forEach((element) => {
  element.addEventListener('click', function () {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
  });
});

// Add hover effects for course items
document.querySelectorAll('.course-item').forEach((item) => {
  item.addEventListener('mouseenter', function () {
    this.style.transform = 'translateX(10px)';
  });

  item.addEventListener('mouseleave', function () {
    this.style.transform = 'translateX(0)';
  });
});

// Navigation button functionality
document.querySelectorAll('.nav-button').forEach((button) => {
  button.addEventListener('click', function () {
    document
      .querySelectorAll('.nav-button')
      .forEach((btn) => btn.classList.remove('active'));
    this.classList.add('active');
  });
});

// Add loading animation on page load
window.addEventListener('load', function () {
  document.querySelector('.dashboard-container').style.animation =
    'fadeIn 0.8s ease-out';
});
