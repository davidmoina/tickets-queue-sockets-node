const path = require('path');
const fs = require('fs');

class Ticket {
	constructor(number, desktop) {
		this.number = number;
		this.desktop = desktop;
	}
}

class TicketControl {
	constructor() {
		this.last = 0;
		this.day = new Date().getDate();
		this.tickets = [];
		this.lastFour = [];

		this.init();
	}

	get toJson() {
		return {
			last: this.last,
			day: this.day,
			tickets: this.tickets,
			lastFour: this.lastFour,
		};
	}

	init() {
		const { day, tickets, last, lastFour } = require('../db/data.json');
		if (day === this.day) {
			this.tickets = tickets;
			this.last = last;
			this.lastFour = lastFour;
		} else {
			this.saveDB();
		}
	}

	saveDB() {
		const dbPath = path.join(__dirname, '../db/data.json');
		fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
	}

	next() {
		this.last += 1;
		const ticket = new Ticket(this.last, null);
		this.tickets.push(ticket);

		this.saveDB();

		return 'Ticket ' + ticket.number;
	}

	attendTicket(desktop) {
		// No tenemos tickets
		if (this.tickets.length === 0) {
			return null;
		}
		// si tenemos tickets
		const ticket = this.tickets.shift();

		ticket.desktop = desktop;

		this.lastFour.unshift(ticket);

		if (this.lastFour.length > 4) {
			this.lastFour.pop();
		}

		this.saveDB();
		return ticket;
	}
}

module.exports = TicketControl;
