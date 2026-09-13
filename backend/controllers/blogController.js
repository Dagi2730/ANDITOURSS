import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

const stringifyTags = (tags) => {
  if (!tags) return '[]';
  if (typeof tags === 'string') {
    const trimmed = tags.trim();
    if (trimmed.startsWith('[')) return trimmed;
    const arr = trimmed.split(',').map((t) => t.trim()).filter(Boolean);
    return JSON.stringify(arr);
  }
  if (Array.isArray(tags)) {
    return JSON.stringify(tags);
  }
  return '[]';
};

const formatBlogPost = (post) => {
  if (!post) return post;
  let parsedTags = [];
  if (post.tags) {
    try {
      parsedTags = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags;
      if (!Array.isArray(parsedTags)) {
        parsedTags = [String(parsedTags)];
      }
    } catch (e) {
      parsedTags = typeof post.tags === 'string' ? post.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
    }
  }
  return {
    ...post,
    tags: parsedTags,
  };
};

const getBlogPosts = asyncHandler(async (req, res) => {
  const posts = await prisma.blogPost.findMany({
    include: { tour: { select: { id: true, title: true, duration: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(posts.map(formatBlogPost));
});

const getBlogPostById = asyncHandler(async (req, res) => {
  const post = await prisma.blogPost.findUnique({
    where: { id: req.params.id },
    include: { tour: { select: { id: true, title: true, duration: true } } },
  });
  if (!post) {
    res.status(404);
    throw new Error('Story not found');
  }
  res.json(formatBlogPost(post));
});

const createBlogPost = asyncHandler(async (req, res) => {
  const { tourId, title, subtitle, location, story, tags, featured, status } = req.body;

  if (!tourId || !title || !story) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const imageUrl = req.file ? `/uploads/blog/${req.file.filename}` : null;
  const isAdmin = req.user?.role === 'ADMIN';

  const post = await prisma.blogPost.create({
    data: {
      tourId,
      title,
      subtitle: subtitle || null,
      location: location || null,
      story,
      tags: stringifyTags(tags),
      featured: featured === 'true' || featured === true,
      imageUrl,
      status: isAdmin ? (status || 'APPROVED') : 'PENDING',
      submittedByGuest: !isAdmin,
    },
    include: { tour: { select: { id: true, title: true, duration: true } } },
  });

  res.status(201).json(formatBlogPost(post));
});

const createGuestSubmission = asyncHandler(async (req, res) => {
  const { title, subtitle, location, story, tags, featured } = req.body;

  if (!title || !story) {
    res.status(400);
    throw new Error('Please provide a title and story');
  }

  const imageUrl = req.file ? `/uploads/blog/${req.file.filename}` : null;

  const post = await prisma.blogPost.create({
    data: {
      title,
      subtitle: subtitle || null,
      location: location || null,
      story,
      tags: stringifyTags(tags),
      featured: featured === 'true' || featured === true,
      imageUrl,
      status: 'PENDING',
      submittedByGuest: true,
    },
    include: { tour: { select: { id: true, title: true, duration: true } } },
  });

  res.status(201).json(formatBlogPost(post));
});

const updateBlogPost = asyncHandler(async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!post) {
    res.status(404);
    throw new Error('Story not found');
  }

  const { tourId, title, subtitle, location, story, tags, featured, status } = req.body;

  const data = {
    tourId: tourId !== undefined ? tourId : post.tourId,
    title: title !== undefined ? title : post.title,
    subtitle: subtitle !== undefined ? subtitle : post.subtitle,
    location: location !== undefined ? location : post.location,
    story: story !== undefined ? story : post.story,
    featured: featured !== undefined ? featured === 'true' || featured === true : post.featured,
    status: status !== undefined ? status : post.status,
  };

  if (tags !== undefined) {
    data.tags = stringifyTags(tags);
  }

  if (req.file) {
    data.imageUrl = `/uploads/blog/${req.file.filename}`;
  }

  const updated = await prisma.blogPost.update({
    where: { id: req.params.id },
    data,
    include: { tour: { select: { id: true, title: true, duration: true } } },
  });

  res.json(formatBlogPost(updated));
});

const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!post) {
    res.status(404);
    throw new Error('Story not found');
  }
  await prisma.blogPost.delete({ where: { id: req.params.id } });
  res.json({ message: 'Story removed' });
});

export { getBlogPosts, getBlogPostById, createBlogPost, createGuestSubmission, updateBlogPost, deleteBlogPost };