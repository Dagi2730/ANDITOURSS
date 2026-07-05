import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
      trim: true,
    },
    story: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    imageUrl: {
      // Public URL path served from /uploads
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const BlogPost = mongoose.model('BlogPost', blogSchema);
export default BlogPost;


