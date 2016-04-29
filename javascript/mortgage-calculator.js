import {
	inject,
	bindable,
	BindingEngine
} from 'aurelia-framework';

import MortgageEngine from './lib/mortgage-engine';
import PaymentPeriods from './constants/payment-periods';
import { BindingSignaler } from 'aurelia-templating-resources';

@inject(BindingEngine, BindingSignaler)
export class MortgageCalculator {
	@bindable state = {};
	@bindable onchange = () => {};
	signaler;
	periods;
	engine;

	fields = [
		'principal',
		'interest',
		'term',
		'period',
		'payments'
	];

	binding;

	constructor (bindingEngine, bindingSignaler) {
		this.signaler = bindingSignaler;
		this.periods = PaymentPeriods;
		this.engine = new MortgageEngine(this.state.principal, this.state.interest);

		this.binding = bindingEngine;

		this.state.changePayment = false;
	}

	attached () {
		let properties = this.fields,
				// refresh data for engine and state
				refresh    = () => {
					this.updateEngine();
					this.changed();
					this.onchange();
				};

		// add observers to engine fields for state
		properties.forEach((property) => {
			this.binding.propertyObserver(this.state, property)
				.subscribe(refresh);
		});
		refresh();
		this.changed();
	}

	changed () {
		this.signaler && this.signaler.signal('formState');
	}

	// synchronise engine properties with state
	updateEngine () {
		let properties = this.fields,
				engine     = this.engine,
				data       = this.state;

		properties.forEach((property) => {
			// synchronise a property to the engine if defined, otherwise use engine's property
			if (typeof data[property] !== 'undefined') {
				engine[property] = data[property];
			}
			else if (property !== 'payments') {
				data[property] = engine[property];
			}
		});

		// now that engine properties are synchronise, update computed field
		if (data.changePayment) {
			data.term = this.engine.getPaymentTerm(data.payments)
				.toFixed(1);
			engine.term = data.term;
		}
		else {
			data.payments = this.engine.getPaymentAmount()
				.toFixed(2);
		}
	}

	getPeriodText () {
		let text;

		this.periods.forEach((period) => {
			if (+(this.state.period) === period.value) {
				text = period.text;
			}
		});

		return text;
	}

	getInterest () {
		return this.engine.getTotalPayment() - this.engine.principal;
	}
}