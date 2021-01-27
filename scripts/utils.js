export function applyPermutation(mas, order) {
	if (!order) {
		return mas
	}
	const result = new Array(mas.length).fill(void 0)
	for (let i = 0; i < mas.length; i++) {
		result[i] = new Array(mas.length).fill(void 0)
		for (let j = 0; j < mas[i].length; j++) {
			result[i][j] = mas[i][order[j] - 1]
		}
	}
	return result
}
