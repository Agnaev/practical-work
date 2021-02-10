import {$} from './liba'
import {DataTable} from './DataTable'
import {DrawTable} from './DrawTable'
import {loader} from './loader'

import 'normalize.css'
window.table = DataTable
document.addEventListener('DOMContentLoaded', onReady)

$('#drawChart').on('click', ganttDiagram)
$('#fillRandom').on('click', fillRandom)

function onReady(e) {
	loader.hide()

	const dataTable = new DataTable()
	// const drawTable = new DrawTable()

	window.tasksCount = 3 || +prompt('Tasks count:')

	const $table = $('.table')
	// const $gantt = $('.gantt')

	$table.html(
		dataTable.createTable(tasksCount, tasksCount)
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
			const {final_path, final_res} = data;

			console.log('print order is %o\r\nResult is: %d\r\nExecution time is: %f', final_path, final_res, time)

			$('.output .result').text('Time to process all details: ' + final_res)
			$('.output .permutation').text('Parts order: ' + final_path.join(' => '))

			$('.container').clear()

			const series = getMas(final_path)
				.map(
					({from, to, value}) => ({
						name: `Переход ${from} => ${to}`,
						data: [value]
					})
				)

			Highcharts.chart('container', {
				chart: {
					type: 'bar'
				},
				title: {
					text: 'Stacked bar chart'
				},
				xAxis: {
					categories: ['Apples']
				},
				yAxis: {
					min: 0,
					title: {
						text: 'Порядок обработки деталей на станке'
					}
				},
				legend: {
					reversed: true
				},
				plotOptions: {
					series: {
						stacking: 'normal'
					}
				},
				series
			});

			loader.hide()
		}
	})

	function getMas(indexes) {
		const result = []
		for (let i = 0; i < indexes.length - 1; ++i) {
			result.unshift({
				from: indexes[i],
				to: indexes[i + 1],
				value: matrix[indexes[i] - 1][indexes[i + 1] - 1]
			})
		}
		return result
	}

	slave.addEventListener('error', loader.hide)
}

function ganttDiagram(e) {
	loader.show()

	window.matrix = [...document.querySelectorAll('.table .row-data:not(.js-no-data)')]
		.map(x => [...x.children].map(x => +x.textContent))

	slave.postMessage({
		type: 'calc',
		payload: {
			matrix,
		}
	});
}

function fillRandom(e) {
	[...document.querySelectorAll('.table .row-data:not(.js-no-data)')]
		.map((x, i) => [...x.children].forEach((x, j) => {
			x.textContent = i !== j
				? (Math.random() * 100 + 10).toFixed()
				: 0
		}))

}
