// TODO: outsource function, remove pointercrate implementation before release
/**
 * Calculate the amount of points given to a player for a record on a level
 * @param rank Rank of the level
 * @param requirement Minimum percentage to qualify
 * @param percentage Percentage of the record
 */
export function getPoints(rank: number, requirement: number, percentage: number): number {
	let beatenScore = 0;
	if (55 < rank && rank <= 150) {
		let b = 6.273;
		beatenScore = 56.191 * Math.pow(2, (54.147 - (rank + 3.2)) * (Math.log(50) / 99)) + b;
	} else if (35 < rank && rank <= 55) {
		let g = 1.036;
		let h = 25.071;
		beatenScore = 212.61 * Math.pow(g, 1 - rank) + h;
	} else if (20 < rank && rank <= 35) {
		let c = 1.0099685;
		let d = 31.152;
		beatenScore = (250 - 83.389) * Math.pow(c, 2 - rank) - d;
	} else if (0 < rank && rank <= 20) {
		let e = 1.168;
		let f = 100.39;
		beatenScore = (250 - f) * Math.pow(e, 1 - rank) + f;
	} else {
		beatenScore = 0;
	}

	if (percentage !== 100 && rank <= 75) {
		return (beatenScore * Math.pow(5, (percentage - requirement) / (100 - requirement))) / 10;
	}

	return beatenScore;
}
