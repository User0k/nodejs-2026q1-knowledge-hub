import { PrismaClient, Role, Status } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      login: 'admin',
      password: 'admin123',
      role: Role.admin,
    },
  });

  const editor = await prisma.user.create({
    data: {
      login: 'editor',
      password: 'editor123',
      role: Role.editor,
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

  const tagAI = await prisma.tag.create({ data: { name: 'AI' } });
  const tagML = await prisma.tag.create({ data: { name: 'Machine Learning' } });
  const tagProgramming = await prisma.tag.create({
    data: { name: 'Programming' },
  });
  const tagHealth = await prisma.tag.create({ data: { name: 'Health Tips' } });
  const tagResearch = await prisma.tag.create({ data: { name: 'Research' } });

  const article1 = await prisma.article.create({
    data: {
      title: 'The future of AI',
      content: 'Artificial Intelligence blah-blah-blah...',
      status: Status.published,
      authorId: admin.id,
      categoryId: techCategory.id,
      tags: {
        connect: [{ id: tagAI.id }, { id: tagML.id }],
      },
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: 'Programming best practices',
      content: 'Learn the best practices for writing code...',
      status: Status.draft,
      authorId: editor.id,
      categoryId: techCategory.id,
      tags: {
        connect: [{ id: tagProgramming.id }],
      },
    },
  });

  const article3 = await prisma.article.create({
    data: {
      title: 'New cancer research',
      content: 'Scientists have made a significant discovery...',
      status: Status.published,
      authorId: admin.id,
      categoryId: scienceCategory.id,
      tags: {
        connect: [{ id: tagResearch.id }],
      },
    },
  });

  const article4 = await prisma.article.create({
    data: {
      title: 'Healthy habits',
      content: 'Discover the secrets to maintaining a healthy diet...',
      status: Status.published,
      authorId: editor.id,
      categoryId: healthCategory.id,
      tags: {
        connect: [{ id: tagHealth.id }],
      },
    },
  });

  const article5 = await prisma.article.create({
    data: {
      title: 'The impact of technology on society',
      content: 'How technology is changing our daily lives...',
      status: Status.archived,
      authorId: admin.id,
      categoryId: techCategory.id,
      tags: {
        connect: [{ id: tagAI.id }, { id: tagProgramming.id }],
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
      articleId: article2.id,
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

  await prisma.comment.create({
    data: {
      content: 'Very informative!',
      articleId: article4.id,
      authorId: editor.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Thanks for sharing',
      articleId: article5.id,
      authorId: admin.id,
    },
  });

  console.log('Database seeded successfully!');
}

seed()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
