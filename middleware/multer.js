import multer from "multer";

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null,'uploads');
//     },
//     filename: (req, file, cb) => {
//       const originalName = file.originalname;
//       const fileExtension = originalName.split('.').pop();
//       const filename = `${Date.now()}.${fileExtension}`;
//       console.log(filename);
//       cb(null, filename);
//     },
// });

// const upload = multer({storage});
// export default upload

const storage = multer.memoryStorage();
const upload = multer({ storage });
export default upload