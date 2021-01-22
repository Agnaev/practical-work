import {$} from './liba'
import {createRow, toCell, createTable} from './Table'
import {createGanttChart} from './chart'
import 'normalize.css'

document.addEventListener('DOMContentLoaded', onReady)

window.$table = $('.table')
window.permutation = $('.permutation')
window.$gantt = $('#gantt')
window.$draw = $('#drawChart')

$draw.on('click', granttDiagram)

function onReady(e) {
	const dimension = 10 || +prompt('Dimension:')
	permutation.html(
		createRow(0, new Array(dimension)
			.fill('')
			.map(toCell(0))
			.join('')
		)
	)
	$table.html(createTable(dimension, dimension))
	$draw.css({
		marginTop: $table.getClientRect().height + 100 + 'px'
	})

	if ('Worker' in window === false) {
		return alert('You need to use modern browser.')
	}
	window.worker = new Worker('slave_worker.js');

	worker.addEventListener('message', function (e) {
		console.log('Response:', JSON.stringify(e.data))

	})
}

function granttDiagram(e) {
	const payload = {
		permutation: [...document.querySelectorAll('.permutation .cell')].map(x => x.textContent),
		matrix: [...document.querySelectorAll('.table .row-data')].map($row =>
			[...$row.querySelectorAll('.cell')].map($el =>
				$el.textContent
			)
		)
	}
	worker.postMessage({
		type: 'calc',
		payload
	});
	createGanttChart(e)
}


