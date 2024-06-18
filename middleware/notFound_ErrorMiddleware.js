const notFoundHandler = (req,res) => {
    // console.log("req");
    console.log("404");
    return res.status(404).json({sucess: false, message: "Route not found"});
}

const errorHandler = (err,req,res,next) => {
    console.log({msg:err.message});
    let status =  res.statusCode || 500;
    if(err.message == 'fetch failed'){
        status = 400;
    }
    let message = err.message || "Internal Server Error";
    if(err.code == 11000){
        status = 400
        message = "You have reviewed this book already"
    }
    return res.status(status).json({message})
}

export {notFoundHandler,errorHandler}