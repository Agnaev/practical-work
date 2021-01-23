export function toCell(row) {
	return function(_, col) {
		if (row === 0 && col === 0) {
			col = 1
		}
		const id = row + ':' + col
		return `
      <div 
        class="cell" 
        contenteditable="true"
        data-id="${id}"
        data-row="${row}"
        data-col="${col}"
      >${row === 0 ? '' : row}${col}</div>
    `
	}
}

export function createRow(index, content) {
	return `
    <div 
    	class="row" 
    	data-row="${index}"
	>
      <div class="row-data">${content}</div>
    </div>
  `
}

export function createTable(colsLength, rowsLength) {
	const rows = []

	for (let row = 0; row < colsLength; row++) {
		const cells = new Array(rowsLength)
			.fill('')
			.map(toCell(row))
			.join('')

		rows.push(createRow(row, cells))
	}

	return rows.join('')
}
