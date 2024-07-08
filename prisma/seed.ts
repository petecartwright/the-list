import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SEED_EMAIL = "rachel@remix.run";
const SEED_PASSWORD = "racheliscool";


async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);

  const user = await prisma.user.create({
    data: {
      email: SEED_EMAIL,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
  
  const mcDonalds = await prisma.place.create({
    data: {
      name: "McDonald's",
      userId: user.id
    },
  });

  const mcDonaldsItems = [
    {name: "EggMcMuffin", note: "peak breakfast"},
    {name: "Sausage Burrito", note: "does not scratch the itch you want it to"},
    {name: "Double Quarter pounder with cheese", note: "is perfect once per quarter"},
    {name: "diet coke", note: "debatably best version of diet coke"},
  ];

  mcDonaldsItems.forEach(async (item) => {
    await prisma.item.create({
      data: {
        name: item.name,
        note: item.note,
        userId: user.id,
        placeId: mcDonalds.id
      },
    });
  });

  const tacoBell = await prisma.place.create({
    data: {
      name: "Taco Bell",
      userId: user.id
    },
  });

  const tacoBellItemsText = [
    { name: "Chicken Chipotle Ranch Griller", note: "works surprisingly well"},
    { name: "the bean burrito", note: "is still hard to beat"},
    { name: "Crunchwrap", note: "usually disappointing but magic when it hits"},
  ];

  tacoBellItemsText.forEach(async (item) => {
    await prisma.item.create({
      data: {
        name:  item.name,
        note: item.note,
        userId: user.id,
        placeId: tacoBell.id
      },
    });
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
