import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title must be less than 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
articleSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.generateSlug(this.title);
  }
  next();
});

// Method to generate slug from title
articleSchema.methods.generateSlug = function (title) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Add random string to ensure uniqueness
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomString}`;
};

const Article = mongoose.model('Article', articleSchema);

export default Article;
