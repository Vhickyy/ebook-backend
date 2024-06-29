import {PutObjectCommand, S3Client, GetObjectCommand} from "@aws-sdk/client-s3"
import sharp from "sharp"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"


export const uploadToS3 = async (file,filename, mimeType) => {
    console.log(file,filename, mimeType);
    try {

        const s3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials:{
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY
            }
        })

        // const fileName = !mimeType.includes("pdf") ? `${filename}` : `${filename}`
        const fileName = !mimeType.includes("pdf") ? `image/${filename}` : `pdf/${filename}`

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileName,
            Body: file.buffer,
            ContentType: mimeType
        })
        const fileLocation = !mimeType.includes("pdf") ? `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/image/${filename}` : `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/pdf/${filename}`;

        await s3.send(command)
        return fileLocation;

    } catch (error) {
        console.log(error);
        throw error;
    }

}


// export const getImage = async (filename) => {
//     console.log({gI:filename});
//     const s3 = new S3Client({
//         region: process.env.AWS_REGION,
//         credentials:{
//             accessKeyId: process.env.AWS_ACCESS_KEY,
//             secretAccessKey: process.env.AWS_SECRET_KEY
//         }
//     })
//     const command = new GetObjectCommand({
//         Bucket: process.env.AWS_S3_BUCKET,
//         Key: filename
//     });

//     const url = await getSignedUrl(s3, command, {expiresIn: 3600});
//     return url;

// }