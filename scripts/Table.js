function toCell(row) {
	return function(_, col) {
		const id = row + ':' + col
		return `
      <div 
        class="cell" 
        contenteditable="true"
        data-col="${col}"
        data-type="cell"
        data-id="${id}"
      ></div>
    `
	}
}

function createRow(index, content) {
	return `
    <div 
    	class="row" 
    	data-row="${index}"
		>
      <div class="row-data">${content}</div>
    </div>
  `
}

function createTable(length) {
	const rows = []

	for (let row = 0; row < length; row++) {
		const cells = new Array(length)
			.fill('')
			.map(toCell(row))
			.join('')

		rows.push(createRow(row + 1, cells))
	}

	return rows.join('')
}
