import {applyPermutation} from "./utils"

export function toCell(row) {
    return function(_, col) {
        const id = row + ':' + col
        return `
          <div 
            class="tool"
            data-row="${row}"
            data-col="${col}"
            data-id="${id}"
          ></div>
        `
    }
}

export function createRow(index, content) {
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

function toColumn(col, index) {
    return `
    <div 
      class="column-header tool" 
      data-col="${index}" 
    >
      ${col}
    </div>
  `
}

export function createChart(colsLength, rowsLength) {
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

        rows.push(createRow(row + 1, cells))
    }

    return rows.join('')
}

function rndColor() {
    return '#' + Math.random().toString(16).slice(-6)
}

export function draw(arr, order) {
    const colors = new Array(tasksCount).fill('').map(() => rndColor())
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
                tool[shift].style.backgroundColor = colors[i]
                shift += 1
            }
            lockers[i] = shift
        })

    })
}