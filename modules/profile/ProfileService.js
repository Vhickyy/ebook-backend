import ProfileModel from "./ProfileModel.js";

class ProfileService {

    async createProfile(data,res){
        // console.log({data});
        const {interest,user} = data;
        const profile = await ProfileModel.create({interest,user});
        return profile;
    }

    async becomeAuthor(userData,_id){
        console.log({userData},_id);
        const profile = await ProfileModel.findByIdAndUpdate(_id,userData,{new:true});
        if(!profile) return false;
        return true
    }

    async updateAuthor(userData,profileId) {
        const {socials,id} = userData;
        if(socials){
            // check if social handles are valid
        }
        const profile = await ProfileModel.findByIdAndUpdate({_id:profileId},userData,{new:true});
        return profile
    }
}

export default ProfileService;