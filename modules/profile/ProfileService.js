import ProfileModel from "./ProfileModel.js";

class ProfileService {

    async createProfile(interest,user,profilePic,res){
        const profile = await ProfileModel.create({interest,user,profilePic})
        if(!profile){
            res.status(424);
            throw new Error("An error occured creating profile")
        }
        return true;
    }

}

export default ProfileService;