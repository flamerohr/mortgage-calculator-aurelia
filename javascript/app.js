import { inject } from 'aurelia-framework';
import DefaultData from './constants/default-data';
import { BindingSignaler } from 'aurelia-templating-resources';

@inject(BindingSignaler)
export default class App {
	state;
	signaler;
	count = 0;

	constructor (bindingSignaler) {
		this.state = Object.assign({}, DefaultData);
		this.signaler = bindingSignaler;

		if (!this.state.mortgages) {
			this.state.mortgages = [];
			this.addMortgage();
		}
	}

	changed () {
		this.signaler && this.signaler.signal('formState');
	}

	addMortgage () {
		let newMortgage = {
			key:       this.count,
			show:      true,
			principal: this.state.principalDefault || undefined,
			interest:  this.state.interestDefault || undefined,
			term:      this.state.termDefault || undefined,
			period:    this.state.periodDefault || undefined,
			payments:  this.state.paymentsDefault || undefined
		}

		this.state.mortgages.push(newMortgage);
		this.count++;
		return newMortgage;
	}

	removeMortgage (key) {
		let index = this.getMortgage(key),
				removedMortgage;

		this.state.mortgages.forEach((mortgage, pos) => {
			if (mortgage.key === key) {
				index = pos;
			}
		});

		if (typeof index !== 'undefined') {
			removedMortgage = this.state.mortgages.splice(index, 1)
		}

		return removedMortgage;
	}

	toggleMortgage (key) {
		let index = this.getMortgage(key),
				mortgage;

		if (typeof index !== 'undefined') {
			mortgage = this.state.mortgages[index];
			mortgage.show = !mortgage.show;
		}
	}

	toggleMortgagePayment (key) {
		let index = this.getMortgage(key),
				mortgage;

		if (typeof index !== 'undefined') {
			mortgage = this.state.mortgages[index];
			mortgage.changePayment = !mortgage.changePayment;
		}
	}

	getMortgage (key) {
		let index;

		this.state.mortgages.forEach((mortgage, pos) => {
			if (mortgage.key === key) {
				index = pos;
			}
		});

		return index;
	}

	getTotalPrincipal () {
		let total = 0;

		this.state.mortgages.forEach((mortgage) => {
			total += (1 * mortgage.principal);
		});

		return total;
	}

	getTotalInterest () {
		let total = 0;

		this.state.mortgages.forEach((mortgage) => {
			if (mortgage.viewModel) {
				total += (1 * mortgage.viewModel.getInterest());
			}
		});

		return total;
	}
}