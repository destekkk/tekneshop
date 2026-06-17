import { config } from "dotenv";
import { resolve } from "node:path";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";

config({ path: resolve(process.cwd(), ".env.local") });

const testUsers = [
  {
    name: "Deneme Ali",
    email: "deneme1@tekneshop.com",
    phone: "05321234567",
    tcNo: "11111111110",
    password: "deneme123",
  },
  {
    name: "Deneme Ayşe",
    email: "deneme2@tekneshop.com",
    phone: "05329876543",
    tcNo: "22222222220",
    password: "deneme123",
  },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL tanımlı değil (.env.local)");
    process.exit(1);
  }

  const sql = neon(url);

  for (const user of testUsers) {
    const [existing] = await sql`SELECT id FROM users WHERE email = ${user.email} LIMIT 1`;
    const passwordHash = await bcrypt.hash(user.password, 10);

    if (existing) {
      await sql`
        UPDATE users
        SET name = ${user.name},
            phone = ${user.phone},
            tc_no = ${user.tcNo},
            password_hash = ${passwordHash},
            active = true,
            updated_at = NOW()
        WHERE id = ${existing.id}
      `;
      console.log(`✓ Güncellendi: ${user.email}`);
    } else {
      await sql`
        INSERT INTO users (name, email, phone, tc_no, password_hash, active)
        VALUES (${user.name}, ${user.email}, ${user.phone}, ${user.tcNo}, ${passwordHash}, true)
      `;
      console.log(`✓ Oluşturuldu: ${user.email}`);
    }
  }

  console.log("\nGiriş bilgileri:");
  for (const user of testUsers) {
    console.log(`  ${user.email}  /  şifre: ${user.password}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
