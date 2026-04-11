import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  const admin = await prisma.user.create({
    data: {
      login: 'admin',
      password: 'admin123',
      role: 'admin',
    },
  });

  const editor = await prisma.user.create({
    data: {
      login: 'editor',
      password: 'editor123',
      role: 'editor',
    },
  });

  const techCategory = await prisma.category.create({
    data: {
      name: 'Technology',
      description: 'Articles about technology',
    },
  });

  const scienceCategory = await prisma.category.create({
    data: {
      name: 'Science',
      description: 'Scientific discoveries and research',
    },
  });

  const healthCategory = await prisma.category.create({
    data: {
      name: 'Health',
      description: 'Health and wellness articles',
    },
  });

  await prisma.tag.create({ data: { name: 'AI' } });
  await prisma.tag.create({ data: { name: 'Machine Learning' } });
  await prisma.tag.create({ data: { name: 'Programming' } });
  await prisma.tag.create({ data: { name: 'Health Tips' } });
  await prisma.tag.create({ data: { name: 'Research' } });

  const article1 = await prisma.article.create({
    data: {
      title: 'The future of AI',
      content: 'Artificial Intelligence blah-blah-blah...',
      status: 'published',
      authorId: admin.id,
      categoryId: techCategory.id,
      tags: {
        connectOrCreate: [
          { where: { name: 'AI' }, create: { name: 'AI' } },
          {
            where: { name: 'Machine Learning' },
            create: { name: 'Machine Learning' },
          },
        ],
      },
    },
  });

  const article3 = await prisma.article.create({
    data: {
      title: 'Programming best practices',
      content: 'Learn the best practices for writing code...',
      status: 'draft',
      authorId: editor.id,
      categoryId: techCategory.id,
      tags: {
        connectOrCreate: [
          { where: { name: 'Programming' }, create: { name: 'Programming' } },
        ],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'New cancer research',
      content: 'Scientists have made a significant discovery...',
      status: 'published',
      authorId: admin.id,
      categoryId: scienceCategory.id,
      tags: {
        connectOrCreate: [
          { where: { name: 'Research' }, create: { name: 'Research' } },
        ],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'Healthy habits',
      content: 'Discover the secrets to maintaining a healthy diet...',
      status: 'published',
      authorId: editor.id,
      categoryId: healthCategory.id,
      tags: {
        connectOrCreate: [
          { where: { name: 'Health Tips' }, create: { name: 'Health Tips' } },
        ],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'The impact of technology on society',
      content: 'How technology is changing our daily lives...',
      status: 'archived',
      authorId: admin.id,
      categoryId: techCategory.id,
      tags: {
        connectOrCreate: [
          { where: { name: 'AI' }, create: { name: 'AI' } },
          { where: { name: 'Programming' }, create: { name: 'Programming' } },
        ],
      },
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Great article!',
      articleId: article1.id,
      authorId: editor.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'LOL',
      articleId: article1.id,
      authorId: admin.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'I am a teapot!',
      articleId: article3.id,
      authorId: editor.id,
    },
  });

  console.log('Database seeded successfully!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
