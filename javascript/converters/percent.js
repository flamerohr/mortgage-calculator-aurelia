export class PercentValueConverter {
	toView (decimal) {
		return Math.round(decimal * 1e12) / 1e10;
	}

	fromView (percent) {
		return Math.round(percent * 1e10) / 1e12;
	}
}