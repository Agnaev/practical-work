import {applyPermutation} from "./utils"

self.addEventListener('message', function (e) {
    const {type} = e.data
    if (type === 'calc') {
        const {matrix, permutationsLength} = e.data.payload
        const start = performance.now()
        const data = calculateGantt(matrix, permutationsLength)
        const end = performance.now()
        return postMessage({
            type,
            time: end - start,
            data
        })
    }
    postMessage(e.data)
})

function calculateGantt(matrix, permutationsLength) {
    const permutationsInit = new Array(permutationsLength).fill(0).map((_, i) => i + 1)
    const permutations = generatePermutations(permutationsInit)
    const result = []
    for (const permutation of permutations) {
        const permutedArray = applyPermutation(matrix, permutation)
        const calculatedValue = calc(permutedArray)
        if (result.length === 0 || result[0].result > calculatedValue) {
            result.splice(0, result.length, {
                result: calculatedValue,
                order: permutation
            })
        }
        else if (result[0].result === calculatedValue) {
            result.push({
                result: calculatedValue,
                order: permutation
            })
        }
    }
    return result
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

export function calc(matrix) {
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
    return result
}
