const test = require('test-kit').tape()
const vent = require('.')

test('plot_lines', function (t) {
    t.table_assert([
            [ 'lines',       'exp' ],
            [
                [
                    [0, 0, 2, 0],
                    [0, 0, 0, 3],
                ],
                [
                    [2, 1, 1, 0],
                    [1, 0, 0, 0],
                    [1, 0, 0, 0],
                    [1, 0, 0, 0],
                ]
            ],
        ], function (lines) {
            let matrix = vent.new_matrix(4)
            vent.plot_lines(lines, matrix)
            return matrix
        }
    )
})

test('test_example',function (t) {
    const lines = [
        //x1,y1,x2,y2
        [0,9,5,9],
        [8,0,0,8],
        [9,4,3,4],
        [2,2,2,1],
        [7,0,7,4],
        [6,4,2,0],
        [0,9,2,9],
        [3,4,1,4],
        [0,0,8,8],
        [5,5,8,2],
    ]

    const expect = [
        '.......1..',
        '..1....1..',
        '..1....1..',
        '.......1..',
        '.112111211',
        '..........',
        '..........',
        '..........',
        '..........',
        '222111....',
    ]

    t.plan(1)
    let matrix = vent.new_matrix(10)
    let slines = lines.filter(([x1,y1,x2,y2]) => vent.is_straight(x1,y1,x2,y2))
    vent.plot_lines(slines, matrix)
    let text = vent.matrix2text(matrix, 0, '.', '.')
    t.deepEqual(text, expect)
})

test('matrix2text', function (t) {
    t.table_assert([
        [ 'matrix', 'exp' ],
        [
            [
                [0,1],
                [2,1],
            ],
            [
                '    0    1',
                '    2    1',
            ]
        ],
        [
            [
                [32, 201],
                [0, 1],
            ],
            [
                '   32  201',
                '    0    1',
            ]
        ],
    ], vent.matrix2text)
})

test('select_straight', function (t) {
    t.table_assert([
        [ 'x1','y1','x2','y2',    'exp' ],
        [ 0, 1, 0, 5,             true ],
        [ 0, 1, 2, 5,             false ],
        [ 3, 5, 2, 5,             true ],
        [ 3, 4, 4, 3,             false ],
    ], vent.is_straight)
})

