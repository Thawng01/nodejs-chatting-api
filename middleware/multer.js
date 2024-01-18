import multer from "multer";

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + "_" + file.originalname);
    },
});

const imageType = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return cb(new Error("Only image are accepted"), false);
    }

    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageType });

export default upload;
