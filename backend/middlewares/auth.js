// middleware to check userId and has premium plan

import { clerkClient } from "@clerk/express";

export const auth = async(req,res,next) => {
    try{
        const authData = req.auth?.();
        const { userId } = authData ?? {};

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        await clerkClient.users.getUser(userId);

        next();

    } catch (error){
        return res.status(500).json({success:false, message: error.message});
    }
}