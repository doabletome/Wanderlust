const User = require("../models/user.js");


module.exports.renderSignupForm =(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup=async (req,res)=>{
    try{
        let{username, email, password} = req.body;
        const newUser = new User({email, username});
        let registereduser = await User.register(newUser, password);
        console.log(registereduser);
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wanderlust");
            res.redirect("/listings");  
        });
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}

module.exports.renderLoginform =(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","welcome back to wanderlust! you are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout =(req,res,next)=>{
    req.logout((err)=>{
        if(err){
             return next(err);
        }
        req.flash("success","you are logged out now!");
        res.redirect("/listings");
    });
}