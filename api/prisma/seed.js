import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("4444", 10);

  await prisma.user.upsert({
    where: { email: "carlos.alberto@quantaconsultoria.com" },
    update: {},
    create: {
      email: "carlos.alberto@quantaconsultoria.com",
      password: hash,
      role: "admin"
    }
  });

  console.log("Usuário criado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
