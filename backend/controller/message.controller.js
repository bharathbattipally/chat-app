
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage= async(req,res)=>{
    try{
        const {message}=req.body;
        const {id:receiverId}=req.params;
        const senderId= req.user._id;

        let conversation= await Conversation.findOne({
            participants:{
                $all:[senderId,receiverId]
            }
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId,receiverId]
            })
        }

        const newMessage= await Message({
            senderId,
            receiverId,
            message
        })

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }

        //await conversation.save();
        //await newMessage.save();
        
        //this will run in parallel
        await Promise.all([conversation.save(),newMessage.save()]);

        res.status(200).json(newMessage);
    }
    catch(error){
        console.log('erro in sendmessage controller',error.message);
        res.status(500).json({error:"internal server error"});
    }
}

export const getMessage = async(req,res)=>{
    try{
        const {id:usertoChatId}=req.params;
        const senderId= req.user._id;

        const conversation = await Conversation.findOne({
            participants:{$all :[senderId,usertoChatId]}
        }).populate("messages"); // not just reference but returning  actual messages

        if(!conversation){
            return res.status(200).json([])
        }
        const messages= conversation.messages;
        res.status(200).json({messages});

    }
    catch(error){
        console.log('error in getMessage controller',error.message);
        return res.status(500).json({error:"internal server error"});
    }

}