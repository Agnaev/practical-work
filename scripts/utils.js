export function applyPermutation(mas, order) {
	const result = new Array(mas.length).fill(0)
	for (let i = 0; i < mas.length; i++) {
		result[i] = new Array(mas[i].length).fill(0)
		for (let j = 0; j < mas[i].length; j++) {
			result[i][order[j]] = mas[i][j]
		}
	}
	return result
}
