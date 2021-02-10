import {TravelingSalesmanProblem} from './TravelingSalesmenPoblem'

self.addEventListener('message', function (e) {
    const {type, payload} = e.data
    if (type === 'calc') {
        const {matrix} = payload
        const start = performance.now()
        const data = TravelingSalesmanProblem(matrix)
        const end = performance.now()
        return self.postMessage({
            type,
            time: end - start,
            data
        })
    }
    postMessage(e.data)
})
