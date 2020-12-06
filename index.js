var rect = require('./rectangle')

function solveRect(l, b) {
    console.log("Lenght =" + l + " and Breadth=" + b)
    if (l <= 0 || b <= 0) {
        console.log("Dimensions cannot be zero")
    }
    else {
        console.log("Area =" + rect.area(l, b) + "\nPerimeter =" + rect.perimeter(l, b))
    }

    console.log()
}

solveRect(2, 4)
solveRect(2, 0)