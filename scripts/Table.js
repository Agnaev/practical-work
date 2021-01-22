export function toCell(row) {
	return function(_, col) {
		const id = row + ':' + col
		return `
      <div 
        class="cell" 
        contenteditable="true"
        data-id="${id}"
      >${row || ''}${col}</div>
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

export function createTable(length) {
	const rows = []

	for (let row = 1; row < length; row++) {
		const cells = new Array(length)
			.fill('')
			.map(toCell(row))
			.join('')

		rows.push(createRow(row + 1, cells))
	}

	return rows.join('')
}
