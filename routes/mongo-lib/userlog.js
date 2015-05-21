var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// User
var userlogSchema = new Schema({
//    _id: Number,
    name: String,
    mobile: { type: String, index: true},
    email: String,
    liuliang: [
        {
            ad_id: String,
            llnumber: Number,
            lltime: Date
        }
    ]
});


userlogSchema.methods.updateFavor = function(favor) {

};

userlogSchema.index({mobile: 1}, {unique: true});


module.exports = mongoose.model('Userlog', userlogSchema);

