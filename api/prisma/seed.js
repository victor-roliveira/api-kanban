import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { email: "victor@teste.com" },
    update: {},
    create: {
      email: "victor@teste.com",
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
