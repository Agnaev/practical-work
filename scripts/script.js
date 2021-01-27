import {$} from './liba'
import {DataTable} from './DataTable'
import {DrawTable} from './DrawTable'
import {loader} from './loader'

import 'normalize.css'

document.addEventListener('DOMContentLoaded', onReady)

$('#drawChart').on('click', ganttDiagram)
$('#fillRandom').on('click', fillRandom)

function onReady(e) {
	loader.hide()

	const dataTable = new DataTable()
	const drawTable = new DrawTable()

	window.toolsCount = 10 || +prompt('Tools count:')
	window.tasksCount = 10 || +prompt('Tasks count:')

	const $table = $('.table')
	const $gantt = $('.gantt')

	$table.html(
		dataTable.createTable(toolsCount, tasksCount)
	)
	$('.buttons').css({
		marginTop: $table.getClientRect().height + 100 + 'px'
	})

	if (!('Worker' in window)) {
		return alert('You need to use modern browser.')
	}

	window.slave = new Worker('slave_worker.js');
	slave.addEventListener('message', function (e) {
		if (e.data.type === 'calc') {
			const {time, data} = e.data
			const {order, result} = data[data.length - 1];

			$gantt.html(drawTable.createTable(toolsCount, result + 1))
			drawTable.draw(matrix, order)

			console.log('print order is', order, result)
			console.log('execution time is:', time)

			$('.output .result').text('Time to process all details: ' + result)
			$('.output .permutation').text('Parts order: ' + order.toString())

			loader.hide()
		}
	})
}

function ganttDiagram(e) {
	loader.show()

	window.matrix = [...document.querySelectorAll('.table .row-data:not(.js-no-data)')]
		.map(x => [...x.children].map(x => +x.textContent))

	slave.postMessage({
		type: 'calc',
		payload: {
			matrix,
			permutationsLength: tasksCount
		}
	});
}

function fillRandom(e) {
	[...document.querySelectorAll('.table .row-data:not(.js-no-data)')]
		.map(x => [...x.children].map(x => x.textContent = Math.random().toString().slice(2, 4)))
}
