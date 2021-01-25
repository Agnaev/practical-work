import {applyPermutation} from "./utils"
import 'regenerator-runtime/runtime'

self.addEventListener('message', function (e) {
    if (e.data.type === 'calc') {
        return postMessage(calculateGantt(e.data.payload))
    }
    postMessage(e.data)
})

function calculateGantt({matrix, permutation}) {
    return generatePermutations(permutation)
      .map(applyPermutation.bind(null, matrix))
      .map(calc)
        .reduce((minProcessing, {result, order}) => {
            if (minProcessing.length === 0 || minProcessing[0].result > result) {
                return [{
                    result,
                    order
                }]
            }
            if (minProcessing[0].result === result) {
                minProcessing.push({
                    result,
                    order
                })
            }
            return minProcessing
        }, [])
}

function generatePermutations(arr, perms = [], len = arr.length) {
    if (len === 1) {
        perms.push(arr.slice(0))
    }

    for (let i = 0; i < len; i++) {
        generatePermutations(arr, perms, len - 1)

        len % 2 // parity dependent adjacent elements swap
          ? [arr[0], arr[len - 1]] = [arr[len - 1], arr[0]]
          : [arr[i], arr[len - 1]] = [arr[len - 1], arr[i]]
    }

    return perms
}

export function calc({matrix, order}) {
    const lockers = new Array(matrix[0].length).fill(0)
    let result
    for (const line of matrix) {
        result = line.reduce((shift, renderCount, i) => {
            if (shift < lockers[i]) {
                shift += lockers[i] - shift
            }
            shift += renderCount
            lockers[i] = shift
            return shift
        }, 0)
    }
    return {
        result,
        order
    }
}
