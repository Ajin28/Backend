var rect = require('./rectangle')

function solveRect(l, b) {
    console.log("Lenght =" + l + " and Breadth=" + b)

    rect(l, b, (err, rectangle) => {
        if (err) {
            console.log("ERROR: " + err.message)
        }
        else {
            console.log(`Area =` + rectangle.area() + ` where l=${l},b=${b}`)
            console.log("Perimeter =" + rectangle.perimeter() + ` where l=${l},b=${b}`)
        }
        //Now, notice that for this area, I am not sending in 
        //any parameters here because those two values, 
        //the length and the breath have been passed in already in rect
        //here in the l and b, and those would be already 
        //available to this and here because of the closure that JavaScript supports

        //this part will execute after the asynchronous (2 sec delay)

    });

    console.log("This is after the call to rect")
}

solveRect(2, 4)
solveRect(2, 0)