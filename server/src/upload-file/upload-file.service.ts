import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { User } from '../identity/entities/User';
import { Repository } from 'typeorm';
@Injectable()
export class UploadFileService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  /**
   * A public service that uploads a file to S3 which forms the users profile picture (image_url)
   * It has a privately scoped service that updates the user's profile image @see updateProfileImage
   */
  async uploadFile(@Req() req, file: Express.Multer.File) {
    const MAX_SIZE = 1000000;

    if (file.size > MAX_SIZE) {
      throw new HttpException(
        'Please upload an image smaller than 1 mb',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!fileTypes.includes(file.mimetype)) {
      throw new HttpException(
        'Please upload an image of type jpeg',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let s3: S3;
    try {
      s3 = new S3({
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        region: process.env.AWS_REGION,
      });
    } catch (error) {
      throw new HttpException(
        'An error occured establishing a connection to the storage system',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const fileUpload = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const uploadFile = await s3.upload(fileUpload).promise();
      // If success, pass the url and update the users profile image.
      if (uploadFile) {
        const userUploadSuccess = await this.updateProfileImage(
          req.user,
          uploadFile.Location,
        );
        return userUploadSuccess;
      }
    } catch (error) {
      throw new HttpException(
        'An error occured uploading the file, please try again later.',
        error.statusCode,
      );
    }
  }

  /**
   * A private service that updates the user's profile image
   */
  private async updateProfileImage(userId: number, image_url: string) {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    try {
      const updateUser = await this.userRepo.save({
        ...user,
        image_url,
      });

      return updateUser;
    } catch (error) {
      new HttpException(
        'Error occured updating your profile image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

/**
 * When the user registers, we set the default profile image to the realworldAPI base image.
 * Then in the settings page, there is a file upload.
 * When that file upload is complete, at line 41, we want to insert into the user table the FILENAME
 *
 * If there is a filename, we want to query S3 for the image, get a presigned url and return it!
 */
