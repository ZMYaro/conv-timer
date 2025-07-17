import './components/participant-timer.js';

let timersContainer;

window.addEventListener('load', function () {
	timersContainer = document.getElementById('timers');
	document.getElementById('new-timer-button').addEventListener('click', addTimer);
	document.getElementById('reset-button').addEventListener('click', resetTimers);
});

/**
 * Add another timer.
 */
function addTimer() {
	const newTimer = document.createElement('participant-timer');
	newTimer.addEventListener('start', handleTimerChange);
	timersContainer.appendChild(newTimer);
}

/**
 * When a timer starts, stop the other timers.
 * @param {Event} ev
 */
function handleTimerChange(ev) {
	for (let timer of timersContainer.children) {
		if (timer === ev.target) { continue; }
		timer.stop();
	}
}

/**
 * Reset all timers.
 */
function resetTimers() {
	for (let timer of timersContainer.children) {
		timer.reset();
	}
}
