//exports.perimeter = (x, y) => (2 * (x + y))
//exports.area = (x, y) => (x * y)
//or
module.exports = (x, y, callback) => {
    if (x <= 0 || y <= 0) {
        //asynchoronous simulation
        setTimeout(() =>
            callback(new Error("Dimensions cannot be zero:" + ` l=${x}, b=${y}`), null)
            , 2000);
    }
    else {
        setTimeout(() =>
            callback(null, {

                perimeter: () => (2 * (x + y)),
                area: () => (x * y)
                //I don't need to supply this x and y parameters here at all 
                //because those x and y will be retrieved from this x and y supplied above


            }), 2000);
    }
}


