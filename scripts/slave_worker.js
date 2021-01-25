import {applyPermutation} from "./utils"
import 'regenerator-runtime/runtime'

self.addEventListener('message', function (e) {
    const {type} = e.data
    if (type === 'calc') {
        const start = Date.now()
        const data = calculateGantt(e.data.payload)
        const end = Date.now()
        return postMessage({
            type,
            time: end - start,
            data
        })
    }
    postMessage(e.data)
})

function calculateGantt({matrix, permutation}) {
    let response = []
    for (const order of lazyGenerate(matrix[0].length)) {
        const {matrix: permuted} = applyPermutation(matrix, order)
        const {result} = calc({matrix: permuted, order})
        if (response.length === 0 || response[0].result > calc) {
            response = [{
                order,
                result
            }]
        }
        else if (response[0].result === calc) {
            response.push({
                order,
                result
            })
        }
    }
    return response
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

function* lazyGenerate(length) {
    const res = [[]];
    const a = new Array(length).fill(0).map((_, i ) => i + 1)
    for (let i = 0; i < a.length; i++){
        while(res[res.length - 1].length === i){
            const l = res.pop();
            for (let j = 0; j <= l.length; j++){
                let copy = l.slice();
                copy.splice(j,0, a[i]);
                if (a.length === copy.length) {
                    yield copy
                }
                res.unshift(copy);
            }
        }
    }
    return res;
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
