import User from '@/app/models/User';
import connectDB from '@/lib/mongodb';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  await connectDB();

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');

    if (!file || !userId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'File and userId are required' 
      }), { 
        status: 400 
      });
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: 'avatars',
          resource_type: 'auto',
          public_id: `avatar_${userId}`,
          overwrite: true
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(bytes);
    });

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        avatar: {
          public_id: result.public_id,
          url: result.secure_url
        }
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'User not found' 
      }), { 
        status: 404 
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      user: updatedUser,
      message: 'Avatar updated successfully' 
    }), { 
      status: 200 
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Failed to upload avatar. Please try again.' 
    }), { 
      status: 500 
    });
  }
}