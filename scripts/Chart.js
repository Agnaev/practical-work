import {$} from './liba'
import '../styles/Chart.css'

function randomHexColor() {
    return '#' + Math.random().toString(16).slice(-6)
}

export function createGanttChart(e) {
    const row = document.querySelectorAll(".chart-values li");
    const tasks = document.querySelectorAll(".chart-bars li");
    const rowArray = [...row];

    tasks.forEach(el => {
        el = $(el)
        const [taskStart, taskEnd] = el.data.duration.split("-");

        const {start, end} = rowArray.reduce((res, item) => {
            if (item.textContent === taskEnd) res.end = item
            if (item.textContent === taskStart) res.start = item
            return res
        }, {})

        const left = start.offsetLeft;
        const width = end.offsetLeft + end.offsetWidth - left;

        el.css({
            left: left + 'px',
            width: width + 'px'
        })
        if (e.type === "load") {
            el.css({
                backgroundColor: randomHexColor(),
                opacity: 1
            })
        }
    });
}

window.addEventListener("load", createGanttChart);
window.addEventListener("resize", createGanttChart);