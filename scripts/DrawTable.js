import {applyPermutation} from "./utils"
import {$} from './liba'
import {Table} from './Table'

export class DrawTable extends Table {
    createCell(row) {
        return (_, col) => `
            <div 
                class="tool"
                data-row="${row}"
                data-col="${col}"
            ></div>
        `
    }

    createRow(index, content) {
        return `
            <div 
                class="row" 
                data-row="${index}"
            >
                <div class="row-header ">
                    ${index ?? ''}
                </div>
                <div class="row-data">${content}</div>
            </div>
        `
    }

    createColumn(col, index) {
        return `
            <div 
                class="column-header tool" 
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

            rows.push(this.createRow(row + 1, cells))
        }

        return rows.join('')
    }

    rndColor() {
        return '#' + Math.random().toString(16).slice(-6)
    }

    draw(arr, order) {
        const colors = new Array(tasksCount).fill('').map(this.rndColor)
        const lockers = new Array(tasksCount).fill(0)

        applyPermutation(arr, order).forEach((line, toolNum) => {
            const tool = document.querySelectorAll(`.tool[data-row="${toolNum}"]`)
            let shift = 0
            line.forEach((renderCount, i) => {
                if (shift < lockers[i]) {
                    const count = lockers[i] - shift
                    shift += count
                }
                for (let j = 0; j < renderCount; j++) {
                    $(tool[shift]).css({
                        backgroundColor: colors[i]
                    })
                    shift += 1
                }
                lockers[i] = shift
            })
        })
    }
}
