import jwt from 'jsonwebtoken';

const generateTokenandSetCookie=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'15d'})
    res.cookie("jwt",token,{
        maxAge:15*24*60*60*1000,
        httpOnly:true, // prevent cross-site scripting, accessible through http only but not accesible through javascript
        sameSite:"strict" ,// prevent CSRF attacks and other XSS
        secure: process.env.NODE_ENV !=="development"
    });
}

export default generateTokenandSetCookie;