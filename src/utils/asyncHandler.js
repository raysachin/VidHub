

// method of promise
const asyncHandler = (requestHandler) =>{
    (req, res, next) =>{
        Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error))
    }
}

// export it
export {asyncHandler}


/*
// method of try catch


// function accepting function as parameter, It is a type of higher order function

// Step by step
// const asyncHandler = () =>{}
// const asyncHandler = (func) => () =>{}

const asyncHandler = (fn) => async (req, res, next) =>{
    try{
        await fn(req, req, next)
    } catch(error){
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}

*/