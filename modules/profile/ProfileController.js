import ProfileModel from "./ProfileModel.js";
import ProfileService from "./ProfileService.js";

class ProfileController {

    profileService = new ProfileService()

    async updateAuthor(req,res) {
        // ==== update name if provided ===== //
        const { location, bio, cardInfo} = req.body;
        const {bankName,bankHolder,accountNumber} = cardInfo;
        if(!bankHolder || !bankName || !accountNumber || location || bio) return res.status(400).json({success:false, message: "Bank details, location and bio are required."});
        const profile = await this.profileService.updateAuthor(req.body,req.params.id);
        if(!profile) return res.status(500).json({message:"Errror updating profile"})
        return res.status(200).json({success:true,message:"Profile updated successfully",data:profile});
    }

    
}

export default ProfileController;