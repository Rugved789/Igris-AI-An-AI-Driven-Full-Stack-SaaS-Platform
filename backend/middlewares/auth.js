// middleware to check userId and has premium plan

import { clerkClient } from "@clerk/express";

export const auth = async(req,res,next) => {
    try{
        const {userId} = await req.auth();
        const user = await clerkClient.users.getUser(userId);

    } catch (error){
        res.json({success:false, message: error.message});
    }
}