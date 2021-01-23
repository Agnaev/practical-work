import {$} from './liba'
import {createRow, createTable} from './Table'
import {createChart, draw} from './chart'
import 'normalize.css'

document.addEventListener('DOMContentLoaded', onReady)

window.$table = $('.table')
window.$permutation = $('.permutation')
window.$gantt = $('.gantt')
window.$draw = $('#drawChart')

$draw.on('click', ganttDiagram)

function onReady(e) {
	window.toolsCount = 3 || +prompt('Tools count:')
	window.tasksCount = 4 || +prompt('Tasks count:')

	$permutation.html(
		createRow(0, new Array(tasksCount)
			.fill('')
			.map((_, i) => `
				<div
					contenteditable="true"
					class="permutation"
					data-permutation="${i}"
				>${i + 1}</div>
			`)
			.join('')
		)
	)

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
		console.log('Response:', JSON.stringify(e.data))
	})

	// $gantt.html(createChart(toolsCount, toolsCount * 30))

}

function ganttDiagram(e) {
	const payload = {
		permutation: [...document.querySelectorAll('.permutation[data-permutation]')].map(x => +x.textContent),
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

	$gantt.clear()
	$gantt.html(createChart(toolsCount, toolsCount * 30))

	const drawData = [...document.querySelectorAll('.table .row-data')].reduce((res, x) => {
		const mas = []
		for (let i = 0; i < x.children.length; i++) mas.push(+x.children[i].textContent)
		res.push(mas)
		return res;
	}, [])

	const order = [...document.querySelectorAll('.permutation[contenteditable]')].map(x => +x.textContent - 1)

	draw(drawData, order)
}


