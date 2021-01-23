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
      <div class="row-data">${content}</div>
    </div>
  `
}

export function createChart(colsLength, rowsLength) {
    const rows = []

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

function applyPermutation(mas, order) {
    const result = new Array(mas.length).fill(0)
    for (let i = 0; i < mas.length; i++) {
        result[i] = new Array(mas[i].length).fill(0)
        for (let j = 0; j < mas[i].length; j++) {
            result[i][order[j]] = mas[i][j]
        }
    }
    return result
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