
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

// function applyPermutation(mas, order) {
//     const result = new Array(mas.length).fill(0)
//     for (let i = 0; i < mas.length; i++) {
//         result[i] = new Array(mas[i].length).fill(0)
//         for (let j = 0; j < mas[i].length; j++) {
//             result[i][order[j]] = mas[i][j]
//         }
//     }
//     return result
// }

// function* permutations(elements) {
//     if (elements.length === 1) {
//         yield elements;
//     } else {
//         let [first, ...rest] = elements;
//         for (let perm of permutations(rest)) {
//             for (let i = 0; i < elements.length; i++) {
//                 let start = perm.slice(0, i);
//                 let rest = perm.slice(i);
//                 yield [...start, first, ...rest];
//             }
//         }
//     }
// }
