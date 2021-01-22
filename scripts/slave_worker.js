
self.addEventListener('message', function (e) {
    if (e.data.type === 'calc') {
        const {matrix, permutation} = e.data.payload
        return postMessage(calculateGantt(matrix, permutation))
    }
    postMessage(e.data)
})

function calculateGantt(matrix, permutation) {
    return {
        permutation,
        matrix,
    }
}
