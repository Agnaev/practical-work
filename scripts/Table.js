function notImplemented(functionName) {
	return new Error(functionName + ' function must be implemented.')
}

export class Table {
	constructor() {}

	createCell(row) {
		throw notImplemented('createCell')
	}

	createRow(index, content) {
		throw notImplemented('createRow')
	}

	createColumn(col, index) {
		throw notImplemented('createColumn')
	}

	createTable(colsLength, rowsLength) {
		throw notImplemented('createTable')
	}
}
