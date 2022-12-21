import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { User } from '../identity/entities/User';
import { Repository } from 'typeorm';
import { UpdateProfileSuccess } from 'src/identity/dto/UpdateProfileSuccessDto';
import { ConfigService } from '@nestjs/config';
const sharp = require('sharp');

@Injectable()
export class UploadFileService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private configService: ConfigService,
  ) {}

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
        'Please upload an image of type jpeg, png or jpg',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // Resize the image to 533 x 533
    const resizedImage = await sharp(file.buffer).resize(533, 533).toBuffer();

    const s3 = this.establishS3Connection();

    const fileUpload = {
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
      Key: file.originalname,
      Body: resizedImage,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const uploadFile = await s3.upload(fileUpload).promise();
      // If success, pass the url and update the users profile image.
      if (uploadFile) {
        const userUploadSuccess = await this.updateProfileImage(
          req.user.id,
          uploadFile.Location,
        );
        return userUploadSuccess;
      }
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        'An error occured uploading the file, please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Private method to establish a connection to S3
   * @returns S3 object
   */
  private establishS3Connection(): S3 {
    let s3: S3;
    try {
      s3 = new S3({
        credentials: {
          accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
          secretAccessKey: this.configService.get<string>(
            'AWS_SECRET_ACCESS_KEY',
          ),
        },
        region: this.configService.get<string>('AWS_REGION'),
      });
    } catch (error) {
      throw new HttpException(
        'An error occured establishing a connection to the storage system',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return s3;
  }

  /**
   * A private service that updates the user's profile image
   */
  private async updateProfileImage(
    userId: number,
    image_url: string,
  ): Promise<UpdateProfileSuccess> {
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
