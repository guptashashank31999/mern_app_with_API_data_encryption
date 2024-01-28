const mongoose = require("mongoose");

const UserImageModelSchema = new mongoose.Schema({
    image : String
});

const UserImageModel = mongoose.model("userImageModel", UserImageModelSchema);
module.exports = UserImageModel;