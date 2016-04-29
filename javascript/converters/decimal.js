export class DecimalValueConverter {
	toView (decimal, places = 2) {
		if (decimal) {
			return (1 * decimal).toFixed(places)
				.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		}
		return '0.' + '0'.repeat(places);
	}

	fromView (dollar) {
		return dollar.replace(/,/g, '');
	}
}