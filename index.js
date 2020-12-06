var rect = {
    perimeter: (x, y) => (2 * (x + y)),
    area: (x, y) => (x * y)
};

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