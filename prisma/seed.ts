import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Debut du peuplement de la base de données...');

  await prisma.role.createMany({
    data: [
      { id: 1, label: 'Administrateur', level: 100 },
      { id: 2, label: 'Modérateur', level: 80 },
      { id: 3, label: 'Auteur', level: 60 },
      { id: 4, label: 'Utilisateur', level: 1 },
    ],
    skipDuplicates: true,
  });

  const users = [
    {
      name: 'Admin CESIZEN',
      email: 'admin@cesizen.fr',
      password: 'admin123',
      roleId: 1,
    },
    {
      name: 'Modérateur',
      email: 'mod@cesizen.fr',
      password: 'mod123',
      roleId: 2,
    },
    {
      name: 'Auteur',
      email: 'author@cesizen.fr',
      password: 'author123',
      roleId: 3,
    },
    {
      name: 'Utilisateur',
      email: 'user@cesizen.fr',
      password: 'user123',
      roleId: 4,
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

  await prisma.informationMenu.create({
    data: {
      label: 'Menu Principal',
      pageIds: [],
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

  console.log('Base de données peuplée avec succès !');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());