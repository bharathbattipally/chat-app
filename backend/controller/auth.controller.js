import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";
import generateTokenandSetCookie from '../util/generateToken.js';

export const signup= async (req,res)=>{

    try{
        const {fullName,username,password,confirmPassword,gender}= req.body;

        if(password !== confirmPassword){
            return res.status(400).json({error:'passwords do not match'});
        }
        const user= await User.findOne({username});
        if(user){
            return res.status(400).json({error:'user already exists'});
        }
        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);

        const boyProfilePic= 'https://avatar.iran.liara.run/public/boy?username=${username}';
        const girlProfilePic= 'https://avatar.iran.liara.run/public/girl?username=${username}';

        const newUser= new User({
            fullName,
            username,
            password:hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic:girlProfilePic
        })

        if(newUser){
            generateTokenandSetCookie(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                password:newUser.password,
                profilePic:newUser.profilePic

            })
        }
        else{
            return res.status(403).json({message:'invalid user data'});
        }
    }

    catch(error){
        console.log(error.message,'error in signup controller ');
        return res.status(500).json({error:'internal server error'})
    }
}

export const login= async (req,res)=>{
    try{
        const {username,password}=req.body;
        const user= await User.findOne({username});
        const isPasswordCorrect= await bcrypt.compare(password,user.password);

        if(!user || !isPasswordCorrect){
            return res.status(404).json({message:"invalid user credentials"});
        }
        generateTokenandSetCookie(user._id,res);

        res.status(200).json({
            username:user.username
        })

    }
    catch(error){
        console.log(error.message,'error in login controller ');
        return res.status(500).json({error:'internal server error'});

    }
}

export const logout= (req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        return res.status(200).json({message:"logout successful"})

    }
    catch(error){
        console.log(error.message,'error in login controller ');
        return res.status(500).json({error:'internal server error'})
    }
    console.log('logout route');
}