import { $ } from './liba'
import { DataTable } from './DataTable'
import { loader } from './loader'

import 'normalize.css'
// @ts-ignore
window.table = DataTable
document.addEventListener('DOMContentLoaded', onReady)

$('#drawChart').on('click', ganttDiagram)
$('#fillRandom').on('click', fillRandom)

function onReady() {
	loader.hide()

	const dataTable = new DataTable()
	// const drawTable = new DrawTable()

	// @ts-ignore
	window.tasksCount = 5 || +prompt('Tasks count:')

	const $table = $('.table')
	// const $gantt = $('.gantt')

	$table.html(
		// @ts-ignore
		dataTable.createTable(window.tasksCount, window.tasksCount)
	)
	$('.buttons').css({
		marginTop: ($table.getClientRect() as DOMRect).height + 100 + 'px'
	})

	if (!('Worker' in window)) {
		return alert('You need to use modern browser.')
	}

	// @ts-ignore
	window.slave = new Worker('slave_worker.ts')
	// @ts-ignore
	winsow.slave.addEventListener('message', function (this: Worker, e) {
		if (e.data.type === 'calc') {
			const {time, data} = e.data
			const {final_path, final_res} = data;

			console.log('print order is %o\r\nResult is: %d\r\nExecution time is: %f', final_path, final_res, time)

			const mas = getMas(final_path)
			const series = mas.slice(1).map(
					({from, to, value}) => ({
						name: `Переход ${from} => ${to}`,
						data: [value]
					})
				)

			$('.output .result').text('Time to process all details: ' + mas.slice(1).reduce((a, b) => a + b.value, 0))
			$('.output .permutation').text('Parts order: ' + final_path.splice(0, final_path.length - 1).join(' => '))

			$('.container').clear()


			// @ts-expect-error Imports as html script
			Highcharts.chart('container', {
				chart: {
					type: 'bar'
				},
				title: {
					text: ''
				},
				xAxis: {
					categories: ['Станок']
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

	function getMas(indexes: number[]) {
		const result = []
		for (let i = 0; i < indexes.length - 1; ++i) {
			result.unshift({
				from: indexes[i],
				to: indexes[i + 1],
				// @ts-ignore
				value: window.matrix[indexes[i] - 1][indexes[i + 1] - 1]
			})
		}
		return result
	}

	// @ts-ignore
	window.slave.addEventListener('error', loader.hide)
}

function ganttDiagram() {
	loader.show()

	// @ts-ignore
	window.matrix = [...document.querySelectorAll('.table .row-data:not(.js-no-data)')]
		.map(x => [...x.children].map(x => +x.textContent))

	// @ts-ignore
	window.slave.postMessage({
		type: 'calc',
		payload: {
			// @ts-ignore
			matrix: window.matrix,
		}
	})

	return true
}

function fillRandom() {
	// @ts-ignore
	[...document.querySelectorAll('.table .row-data:not(.js-no-data)')]
		.map(
			(x, i) => [...x.children].forEach(
				(x, j) => {
					x.textContent = i !== j
						? (Math.random() * 100 + 10).toFixed()
						: 0
				}
			)
		)

	return true
}
