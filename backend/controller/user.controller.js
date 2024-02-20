import User from "../models/user.model.js";


const getUsersForSidebar = async(req,res)=>{
    try{
        const loggedInUserId= req.user._id;

        const filteredUsers= await User.find({_id:{$ne:loggedInUserId}}).select('-password');

        return res.status(200).json(filteredUsers);

    }
    catch(error){
        console.log(error.message, 'error in getUsersForSidebar controller');
        return res.status(500).json({error:'internal server error'});
    }
    
}

export default getUsersForSidebar;