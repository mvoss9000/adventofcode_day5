const fs = require('fs')

function is_straight (x1,y1,x2,y2) {
    return x1 === x2 || y1 === y2
}

function *straight_path (x1,x2,y1,y2) {
    let dx = x1 - x2
    let dy = y1 - y2
    if (dx === 0 || dy === 0) {
        let beg = x1
        let end = x2
        if (dx === 0) {
            beg = y1
            end = y2
        }
        let step = end > beg ? 1 : -1
        for (let v = beg; v !== end + step; v += step) {
            yield dx === 0 ? [x1, v] : [v, y1]
        }
    } else {
        let m = dy / dx
        let b = -m * x1 + y1
        if (Math.abs(m) < 1) {
            let step = x2 > x1 ? 1 : -1
            for (let x=x1; x !== x2 + step; x += step) {
                yield [x, Math.round(m * x + b)]
            }
        } else {
            let step = y2 > y1 ? 1 : -1
            for (let y=y1; y !== y2 + step; y += step) {
                yield [Math.round((y - b) / m), y]
            }
        }
    }
}

function plot_lines (lines, matrix) {
    lines.forEach(([x1, y1, x2, y2]) => {
        for (const [x,y] of straight_path(x1,x2,y1,y2)) {
            matrix[y][x]++
        }
    })
}

function padl (s, l, c) { c = c || ' '; while (s.length < l) s = c + s; return s }

function matrix2text (matrix, padlen=5, padc = ' ', zero_sub = '0') {
    let ret = []
    matrix.forEach(row => {
        ret.push(row.map(v => {
            if (v === 0 && zero_sub !== '0') {
                return padl(zero_sub, padlen, zero_sub)
            } else {
                return padl(v.toString(), padlen, padc)
            }
        }).join(''))
    })
    return ret
}

function new_matrix (size) {
    let matrix = []
    for (let i=0; i<size; i++) {
        matrix.push(new Array(size).fill(0,0,size))
    }
    return matrix
}

function reduce_matrix (matrix, init, fn) {
    return matrix.reduce((init, row) => {
        return row.reduce((init, cell) => {
            return fn(init, cell)
        }, init)
    }, init)
}

module.exports = {
    is_straight: is_straight,
    matrix2text: matrix2text,
    new_matrix: new_matrix,
    plot_lines: plot_lines,
}

if (require.main === module) {
    let text_lines = fs.readFileSync('./data.txt', 'utf8').split('\n')
    let lines = text_lines.map(t => {
        return t.replaceAll(/\s*->\s*/g, ',').split(',').map(v => parseInt(v))
    })
    // lines = lines.filter(([x1,y1,x2,y2]) => is_straight(x1,y1,x2,y2))
    let matrix = new_matrix(1000)
    plot_lines(lines, matrix)
    count = reduce_matrix(matrix, 0, (init, cell) => {return init + ((cell > 1) ? 1 : 0)})
    console.log(count)
}
