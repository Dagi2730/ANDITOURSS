import fs from 'fs';
import path from 'path';
import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

const removeFileIfExists = (filePath) => {
  if (!filePath) return;
  const absolutePath = path.join(path.resolve(), filePath);
  fs.access(absolutePath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(absolutePath, () => {});
    }
  });
};

const getBlogPosts = asyncHandler(async (req, res) => {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(posts);
});

const getBlogPostById = asyncHandler(async (req, res) => {
  const post = await prisma.blogPost.findUnique({
    where: { id: req.params.id },
  });

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  res.json(post);
});

const createBlogPost = asyncHandler(async (req, res) => {
  const { title, content, story } = req.body;
  const postContent = content || story;

  if (!title || !postContent) {
    if (req.file) {
      removeFileIfExists(`/uploads/blog/${req.file.filename}`);
    }
    res.status(400);
    throw new Error('Please provide at least a title and content');
  }

  const imageUrl = req.file
    ? `/uploads/blog/${req.file.filename}`
    : req.body.imageUrl || null;

  const post = await prisma.blogPost.create({
    data: { title, content: postContent, imageUrl },
  });

  res.status(201).json(post);
});

const updateBlogPost = asyncHandler(async (req, res) => {
  const { title, content, story } = req.body;

  const post = await prisma.blogPost.findUnique({
    where: { id: req.params.id },
  });

  if (!post) {
    if (req.file) {
      removeFileIfExists(`/uploads/blog/${req.file.filename}`);
    }
    res.status(404);
    throw new Error('Blog post not found');
  }

  let imageUrl = post.imageUrl;
  if (req.file) {
    if (post.imageUrl && post.imageUrl.startsWith('/uploads/')) {
      removeFileIfExists(post.imageUrl);
    }
    imageUrl = `/uploads/blog/${req.file.filename}`;
  } else if (req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  }

  const updated = await prisma.blogPost.update({
    where: { id: req.params.id },
    data: {
      title: title || post.title,
      content: content || story || post.content,
      imageUrl,
    },
  });

  res.json(updated);
});

const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await prisma.blogPost.findUnique({
    where: { id: req.params.id },
  });

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  if (post.imageUrl && post.imageUrl.startsWith('/uploads/')) {
    removeFileIfExists(post.imageUrl);
  }

  await prisma.blogPost.delete({ where: { id: req.params.id } });
  res.json({ message: 'Blog post removed' });
});

export { getBlogPosts, getBlogPostById, createBlogPost, updateBlogPost, deleteBlogPost };
