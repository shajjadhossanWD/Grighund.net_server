const multer = require("multer");

const imageFilter = (req, file, cb) =>{
    if(file.mimetype.includes("image/png")){
        cb(null, true);
    }
    else if(file.mimetype.includes("image/jpeg")){
        cb(null, true);
    }
    else if(file.mimetype.includes("image/jpg")){
        cb(null, true);
    }
    else{
        cb("Plese upload only jpg, png or jpeg image.", false)
    }
};

var storage = multer.diskStorage({
    destination:(req, file, cd)=>{
        cd(null, __basedir + '/');
    },
    filename:(req, file, cb)=>{
        const ext = file.mimetype.split("/")[1];
        const filename = Date.now() + "." + ext;
        req.filename= filename;
        cb(null, filename);
    },
});

var uploadFile  = multer({storage: storage, fileFilter: imageFilter});
module.exports= uploadFile;