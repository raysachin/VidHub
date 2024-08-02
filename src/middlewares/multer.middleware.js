import multer from "multer";



// Here we use disk storage to store the uploaded file

const storage = multer.diskStorage({
    // as node only have access to take json data, here we use multer for file, we can also use the express file uplooad package
    destination: function (req, file, cb) {
      cb(null, "./public/temp")  // here we use public-temp to store file
    },
    filename: function (req, file, cb) {
        // we can keep file name as unique
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)

        cb(null, file.originalname)  // here file are stored as user name, it is not a good practice because many user of same name uses this, nut there is no such major affect because, these file are temporarirly stored and operation are for small times
    }
  })
  
export const upload = multer({ 
    storage, 
})