import mongoose from 'mongoose';
const Schema =mongoose.Schema;


const conf = new Schema({

    url_ldap: { type: String, required: true },
    bindDN: { type: String, required: true },
    bindCredentials: { type: String, required: true },
    searchBase: { type: String, required: true },
    searchFilter:{ type: String, required: true },
    username_fe: { type: String, required: true },
    password_fe: { type: String, required: true },
    word_secret: { type: String, required: true },
    user_noldap: { type: String, required: true },
    pass_noldap: { type: String, required: true },
    username_elastic:{type:String ,required:true},
    password_elastic:{type:String,required:true},
    ulr_elastic:{type:String,required:true}
});

var config = mongoose.model('confg', conf,"confg");

export default config;