import ProfileModel from "./ProfileModel.js";

class ProfileService {

    async createProfile(data,res){
        // console.log({data});
        const {interest,user,phoneNumber} = data;
        await ProfileModel.create({interest,user,address:{phoneNumber}});
        return true;
    }

}

export default ProfileService;