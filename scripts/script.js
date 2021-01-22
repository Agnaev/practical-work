document.addEventListener('DOMContentLoaded', onReady)

function onReady(e) {
	const dimension = +prompt('Dimension:')

	const table = $('.table')
	const permutation = $('.permutation')

	permutation.html(
		createRow(0, new Array(5)
			.fill('')
			.map(toCell(0))
			.join('')
		)
	)
	table.html(createTable(dimension, dimension))

	const $grantt = document.querySelector('#grantt')
	$grantt.style.top = table.getBoundingClientRect().height
	granttDiagram($grantt)
}

function granttDiagram($grantt) {
	const barOptions_stacked = {
		hover: {
			animationDuration: 10
		},
		scales: {
			xAxes: [{
				label: "Duration",
				ticks: {
					beginAtZero: true,
					fontFamily: "'Open Sans Bold', sans-serif",
					fontSize: 11
				},
				scaleLabel: {
					display: true
				},
				gridLines: {},
				stacked: true
			}],
			yAxes: [{
				gridLines: {
					display: false,
					color: "#000",
					zeroLineColor: "#000",
					zeroLineWidth: 0
				},
				ticks: {
					fontFamily: "'Open Sans Bold', sans-serif",
					fontSize: 11
				},
				stacked: true
			}]
		},
		legend: {
			display: false
		},
	}


	const myChart = new Chart($grantt, {
		type: 'horizontalBar',
		data: {
			labels: ["1", "2", "3", "4"],

			datasets: [{
				data: [50, 150, 300, 400, 500],
				backgroundColor: "rgba(63,103,126,0)",
				hoverBackgroundColor: "rgba(50,90,100,0)"

			}, {
				data: [100, 100, 200, 200, 100],
				backgroundColor: ['red', 'green', 'blue', 'green'],
			}]
		},
		options: barOptions_stacked,
	})

// this part to make the tooltip only active on your real dataset
	const originalGetElementAtEvent = myChart.getElementAtEvent
	myChart.getElementAtEvent = e => {
		return originalGetElementAtEvent
			.apply(this, arguments)
			.filter(e => e._datasetIndex === 1)
	}
}


