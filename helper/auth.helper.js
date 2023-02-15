module.exports={

    ensureAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            console.log("NEXT")
            return next();
        }
        console.log("login")

        res.redirect('/sign/false')
        // res.send("okkk")
    }
}