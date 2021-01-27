function toCell(row) {
	return function(_, col) {
		if (row === 0 && col === 0) {
			col = 1
		}
		return `
			<div 
				class="cell" 
				contenteditable="true"
				data-row="${row}"
				data-col="${col}"
			>${row === 0 ? '' : row}${col}</div>
		`
	}
}

export function createRow(index, content) {
	const orderNum = index ? index + 1 : ''
	return `
		<div 
			class="row" 
			data-row="${index}"
		>
			<div class="row-header ">
				${orderNum}
			</div>
			<div class="row-data ${index ?? 'js-no-data'}">${content}</div>
		</div>
  	`
}

export const toColumn = (col, index) => `
	<div 
		class="column-header" 
		data-col="${index}" 
	>
		${col}
	</div>
`

export function createTable(colsLength, rowsLength) {
	const rows = []

	const cols = new Array(rowsLength)
		.fill(0)
		.map((_, i) => i + 1)
		.map(toColumn)
		.join('')

	rows.push(createRow(null, cols))

	for (let row = 0; row < colsLength; row++) {
		const cells = new Array(rowsLength)
			.fill('')
			.map(toCell(row))
			.join('')

		rows.push(createRow(row, cells))
	}

	return rows.join('')
}
