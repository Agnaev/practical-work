import {$} from './liba'
import {createTable} from './Table'
import {createChart, draw} from './chart'
import 'normalize.css'

document.addEventListener('DOMContentLoaded', onReady)

window.$table = $('.table')
window.$gantt = $('.gantt')
window.$draw = $('#drawChart')

$draw.on('click', ganttDiagram)

function onReady(e) {
	window.toolsCount = 6 || +prompt('Tools count:')
	window.tasksCount = 7 || +prompt('Tasks count:')

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
		console.log(e.data)
		if (e.data.type === 'calc') {
			const {time, data} = e.data
			const {order, result} = data[data.length - 1];
			$gantt.html(createChart(toolsCount, result + 1))
			draw(matrix, order)

			console.log('execution time is:', time)

			$('.output .result').text('Время на обработку всех деталей: ' + result)
			$('.output .permutation').text('Порядок деталей: ' + order.toString())
		}

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
