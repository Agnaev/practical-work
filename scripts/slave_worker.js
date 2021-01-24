import {applyPermutation} from "./utils"
import 'regenerator-runtime/runtime'

self.addEventListener('message', function (e) {
    if (e.data.type === 'calc') {
        const {matrix, permutation} = e.data.payload
        return postMessage(calculateGantt(matrix, permutation))
    }
    postMessage(e.data)
})

function calculateGantt(matrix, permutation) {
    return generatePermutations(permutation)
      .map(applyPermutation.bind(null, matrix))
      .map(calc)
}

function generatePermutations(arr, perms = [], len = arr.length) {
    if (len === 1) perms.push(arr.slice(0))

    for (let i = 0; i < len; i++) {
        generatePermutations(arr, perms, len - 1)

        len % 2 // parity dependent adjacent elements swap
          ? [arr[0], arr[len - 1]] = [arr[len - 1], arr[0]]
          : [arr[i], arr[len - 1]] = [arr[len - 1], arr[i]]
    }

    return perms
}

export function calc(arr) {
    const lockers = new Array(arr[0].length).fill(0)
    let result = 0
    arr.forEach((line, toolNum) => {
        // const tool = document.querySelectorAll(`.tool[data-row="${toolNum}"]`)
        let shift = 0
        line.forEach((renderCount, i) => {
            if (shift < lockers[i]) {
                const count = lockers[i] - shift
                shift += count
            }
            for (let j = 0; j < renderCount; j++) {
                result++
                shift += 1
            }
            lockers[i] = shift
        })
        result = shift
    })
    return result
}
