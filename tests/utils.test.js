import {applyPermutation as testFn} from '../scripts/utils'

describe('permutation', () => {
    let mas
    let permutation

    beforeEach(() => {
        mas = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]
        permutation = [3,2,1]
    })
    test('should apply permutation to matrix:', () => {
        expect(testFn(mas, [1, 2, 3])).toEqual(mas)
        expect(testFn(mas)).toBe(mas)
        expect(
            testFn(mas, [3, 2, 1])
        ).toEqual([
            [3, 2, 1],
            [6, 5, 4],
            [9, 8, 7]
        ])
        expect(testFn([
            [1, 1, 2, 3],
            [10, 11, 12, 13],
            [20, 21, 22, 23],
            [30, 31, 32, 33]
        ], [2, 3, 4, 1]))
            .toEqual([
                [1, 2, 3, 1],
                [11, 12, 13, 10],
                [21, 22, 23, 20],
                [31, 32, 33, 30]
            ])
    })
})
