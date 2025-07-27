import mongoose from 'mongoose';

const Partnership=new mongoose.Schema(
    {
        email:{
            type:String,
            required:true
        },

        phoneNumber:{
            type:Number,
            required,

        },
        description:{
            type:String,
        }
    }

)

const Partner=mongoose.model("Partner",Partnership);
export default Partner;