import {LitElement, html, css} from 'lit';

export class ParticipantTimerElement extends LitElement {
	
	/** @constant In milliseconds */
	static TIMER_UPDATE_INTERVAL = 100;
	
	_stopped = true;
	_boundIncrement = this._increment.bind(this);
	timerInterval;
	
	static get styles() {
		return css`
			:host {
				display: grid;
				grid-column: 1 / -1;
				grid-template-columns: subgrid;
				align-items: center;
				gap: 1em;
			}
			button {
				padding: 0.25em 0.5em;
				font: inherit;
				cursor: pointer;
			}
			time {
				min-width: 5em;
				text-align: right;
			}
			.current-time {
				font-size: 2em;
				font-weight: bold;
			}
			.total {
				font-size: 1.5em;
			}
		`;
	}
	
	static get properties() {
		return {
			participant: { type: String, reflect: true },
			currentTime: { type: Number, attribute: false },
			totalTime: { type: Number, attribute: false },
			turns: { type: Number, attribute: false },
			running: { type: Boolean, attribute: false }
		}
	}
	
	/**
	 * @override
	 */
	connectedCallback() {
		super.connectedCallback();
		this.participant = this.participant || 'Participant';
		this.currentTime = this.currentTime || 0;
		this.totalTime = this.totalTime || 0;
		this.turns = this.turns || 0;
	}
	
	/**
	 * @override
	 */
	disconnectedCallback() {
		super.disconnectedCallback();
		clearInterval(this.timerInterval);
	}
	
	_rename() {
		const newName = prompt('New name?');
		if (!newName) { return; }
		this.participant = newName;
	}
	
	_increment() {
		this.currentTime += ParticipantTimerElement.TIMER_UPDATE_INTERVAL;
		this.totalTime += ParticipantTimerElement.TIMER_UPDATE_INTERVAL;
	}
	
	_formatDuration(duration) {
		if (isNaN(duration)) {
			return '\u2212\u2212:\u2212\u2212';
		}
		
		var durationSeconds = duration / 1000,
			hours = Math.floor(durationSeconds / 3600),
			minutes = Math.floor((durationSeconds - (hours * 3600)) / 60),
			seconds = Math.floor(durationSeconds - (hours * 3600) - (minutes * 60));
		
		if (hours > 0 && minutes < 10) { minutes = '0' + minutes; }
		if (seconds < 10) { seconds = '0' + seconds; }
		
		return `${hours > 0 ? `${hours}:` : ``}${minutes}:${seconds}`;
	}
	
	start() {
		if (this._stopped) {
			this.turns++;
			this.currentTime = 0;
		}
		this.timerInterval = setInterval(this._boundIncrement, ParticipantTimerElement.TIMER_UPDATE_INTERVAL);
		this._stopped = false;
		this.running = true;
		this.dispatchEvent(new CustomEvent('start'));
	}
	
	pause() {
		clearInterval(this.timerInterval);
		this.running = false;
	}
	
	stop() {
		this.pause();
		this._stopped = true;
		// Drop partial seconds so the total timer ticks in sync
		// with the current timer when restarted.
		this.totalTime = Math.floor(this.totalTime / 1000) * 1000;
	}
	
	reset() {
		this.stop();
		this.currentTime = 0;
		this.totalTime = 0;
		this.turns = 0;
	}
	
	render() {
		return html`
			<span class="participant" @click="${this._rename}">${this.participant}</span>
			<time class="current-time">${this._formatDuration(this.currentTime)}</time>
			<time class="total">${this._formatDuration(this.totalTime)}</time>
			<span class="total">${this.turns ?? 0}</span>
			${this.running ?
				html`<button @click=${this.pause}>⏸</button>` :
				html`<button @click=${this.start}>▶</button>`
			}
		`;
	}
}

window.customElements.define('participant-timer', ParticipantTimerElement);
