import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Debut du peuplement de la base de données...');

  await prisma.role.createMany({
    data: [
      { id: 1, label: 'Administrateur', level: 100 },
      { id: 2, label: 'Modérateur', level: 80 },
      { id: 3, label: 'Utilisateur', level: 1 },
    ],
    skipDuplicates: true,
  });

  const users = [
    {
      name: 'Admin Principal',
      email: 'admin@cesizen.fr',
      password: 'admin123',
      roleId: 1,
    },
    {
      name: 'Modérateur Test',
      email: 'mod@cesizen.fr',
      password: 'mod123',
      roleId: 2,
    },
    {
      name: 'Utilisateur Standard',
      email: 'user1@cesizen.fr',
      password: 'user123',
      roleId: 3,
    },
    {
      name: 'Utilisateur Extra',
      email: 'user2@cesizen.fr',
      password: 'user123',
      roleId: 3,
    },
  ];

  for (const user of users) {
    const hashed = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: hashed,
        roleId: user.roleId,
        isActive: true,
      },
    });
  }

  await prisma.informationPage.create({
    data: {
      title: 'Bienvenue sur CesiZen',
      content: 'Voici notre première page.',
      status: 'PUBLISHED',
    },
  });

  await prisma.informationMenu.create({
    data: {
      label: 'Menu Principal',
      pageIds: [1],
    },
  });

  await prisma.activityType.createMany({
    data: [
      { label: 'Yoga' },
      { label: 'Méditation' },
      { label: 'Respiration' },
    ],
    skipDuplicates: true,
  });

  await prisma.activity.createMany({
    data: [
      {
        name: 'Yoga Matinal',
        description: 'Séance de yoga pour bien commencer la journée.',
        thumbnail: 'yoga.jpg',
        duration: 30,
        stressLevel: 2,
        status: 'PUBLISHED',
        typeId: 1,
        publicationDate: new Date(),
      },
      {
        name: 'Méditation guidée',
        description: 'Détente mentale et relaxation profonde.',
        thumbnail: 'meditation.jpg',
        duration: 15,
        stressLevel: 1,
        status: 'PUBLISHED',
        typeId: 2,
        publicationDate: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  await prisma.favorite.createMany({
    data: [
      {
        userId: 3, 
        activityId: 1,
      },
      {
        userId: 4, 
        activityId: 2,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Base de données peuplée avec succès !');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());