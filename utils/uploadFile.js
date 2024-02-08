import multer from "multer";


const filter = {
    images: ['image/png', 'image/jpeg']
}

export const uploadFile = () => {
    const storage = multer.diskStorage({});


    const fileFilter = (req, file, cb) => {
        if (!filter[images].includes(file.mimetype)) return cb(new Error(`Invalid Format`, { cause: 400 }), false)

        return cb(null, true)
    }



    const multerUpload = multer({ storage, fileFilter })
    return multer({ storage })

}