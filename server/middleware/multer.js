import multer from "multer";

const storage = multer.diskStorage({});

const upload = multer({ storage });

export const uploadAvatar= upload.single('avatar')
export const uploadAttachment= upload.array('attachments',5)