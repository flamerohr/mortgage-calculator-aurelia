/**
 * Reference: http://www.hughcalc.org/formula.php
 *
 * Ignoring the Canadian formula, as that seemed out of bounds
 */

export default class MortgageEngine {
	principal;

	interest;

	term = '30';

	period = '12';

	// setup initial principal and interest rates
	constructor (principal = '10000', interest = '0.05') {
		this.principal = principal;
		this.interest = interest;
	}

	// work out the total amount paid, including compounded interest over the full term of the mortgage
	getTotalPayment () {
		let total = this.getPaymentAmount() * this.period * this.term;

		return total;
	}

	// get each periodic payment needed to the mortgage to reach the given term of the mortgage
	getPaymentAmount () {
		let amount = this.principal *
			(this.getInterestRatio()) / (1 - (1 / this.getCompoundInterest()));

		return amount;
	}

	// get the term of the mortgage given a payment amount
	getPaymentTerm (payment) {
		return this.getPaymentNum(payment) / this.period;
	}

	// get the number of payments made during the term of the mortgage
	getPaymentNum (payment) {
		let paymentRatio = ((this.principal / payment) * this.getInterestRatio());

		if (paymentRatio <= 1) {
			return -1 *
				Math.log(1 -
					paymentRatio
				) /
				Math.log(1 +
					this.getInterestRatio()
				);
		}
		else {
			return 'Infinity';
		}
	}

	// get the remaining principal on the mortgage after a fixed term
	getPrincipalAfterTerm (term) {
		return this.principal *
			(1 - (
				((1 + this.getInterestRatio()) ** (this.period * term) - 1) /
				(this.getCompoundInterest() - 1)
			));
	}

	// get the ratio of the annual interest applied to the period of payment
	getInterestRatio () {
		return this.interest / this.period;
	}

	// get the total number of payments that will happen for the term of the mortgage
	getTotalPaymentNum () {
		return this.period * this.term;
	}

	// get the compounded interest rates over the full term of the mortgage
	getCompoundInterest () {
		return ((1 + this.getInterestRatio()) ** (this.getTotalPaymentNum()));
	}
}