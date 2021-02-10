import {Table} from './Table'
import {isNil} from './utils'

export class DataTable extends Table {
    createCell(row) {
        return function (_, col) {
           const content = row === col
            ? 0
            : (Math.random() * 100 + 10).toFixed()

            return `
                <div 
                    class="cell" 
                    contenteditable="true"
                    data-row="${row}"
                    data-col="${col}"
                >${content}</div>
            `
        }
    }

    createRow(index, content) {
        const orderNum = isNil(index) ? '' : index + 1
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

    createColumn(col, index) {
        return `
			<div 
				class="column-header" 
				data-col="${index}" 
			>
				${col}
			</div>
		`
    }

    createTable(colsLength, rowsLength) {
        const rows = []

        const cols = new Array(rowsLength)
            .fill(0)
            .map((_, i) => i + 1)
            .map(this.createColumn)
            .join('')

        rows.push(this.createRow(null, cols))

        for (let row = 0; row < colsLength; row++) {
            const cells = new Array(rowsLength)
                .fill('')
                .map(this.createCell(row))
                .join('')

            rows.push(this.createRow(row, cells))
        }

        return rows.join('')
    }
}