import {$} from './liba'
import {createTable} from './Table'
import {createChart, draw} from './chart'
import 'regenerator-runtime/runtime'
import 'normalize.css'

document.addEventListener('DOMContentLoaded', onReady)

window.$table = $('.table')
window.$gantt = $('.gantt')
window.$draw = $('#drawChart')

$draw.on('click', ganttDiagram)

function onReady(e) {
	window.toolsCount = 2 || +prompt('Tools count:')
	window.tasksCount = 3 || +prompt('Tasks count:')

	$table.html(
		createTable(toolsCount, tasksCount)
	)
	$draw.css({
		marginTop: $table.getClientRect().height + 100 + 'px'
	})

	if (!('Worker' in window)) {
		return alert('You need to use modern browser.')
	}
	window.worker = new Worker('slave_worker.js');

	worker.addEventListener('message', function (e) {
		const {order, result} = e.data[e.data.length - 1]
		$gantt.html(createChart(toolsCount, result + 1))
		draw(matrix, order)

		$('.output .result').text('Время на обработку всех деталей: ' + result)
		$('.output .permutation').text('Порядок деталей: ' + order.toString())
	})
}

function ganttDiagram(e) {
	window.matrix = [...document.querySelectorAll('.table .row-data:not(.js-no-data)')]
		.map(x => [...x.children].map(x => +x.textContent))

	const permutation = new Array(tasksCount).fill(0).map((_, i) => i + 1)

	worker.postMessage({
		type: 'calc',
		payload: {
			matrix,
			permutation
		}
	});
}


