import { drizzle } from "drizzle-orm/mysql2";
import { drizzle as pscaleDrizzle } from "drizzle-orm/planetscale-serverless";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2";
import { connect } from "@planetscale/database";
import { posts } from "./schema/posts";
import { comments } from "./schema/comments";
import { likes } from "./schema/likes";
import { notifications } from "./schema/notifications";

const runMigrate = async () => {
  console.log("⏳ Running migrations...");
  const start = Date.now();

  const connection2 = mysql.createConnection({
    host: process.env.DATABASE_HOST!,
    user: process.env.DATABASE_USERNAME!,
    database: process.env.DATABASE_NAME!,
    password: process.env.DATABASE_PASSWORD!,
    port: Number(process.env.DATABASE_PORT!),
  });
  const db = drizzle(connection2);

  await migrate(db, {
    migrationsFolder: "src/server/db/migrations",
  });

  // migrating all data from pscale to railway
  const planetScaleConnection = connect({
    host: "",
    username: "",
    password: "",
  });
  const pscaleDb = pscaleDrizzle(planetScaleConnection);

  const allPosts = await pscaleDb.select().from(posts);
  const postsRes = await db.insert(posts).values(allPosts);
  console.log("posts migrated", { postsRes });

  const allComments = await pscaleDb.select().from(comments);
  const commentsRes = await db.insert(comments).values(allComments);
  console.log("comments migrated", { commentsRes });

  const allLikes = await pscaleDb.select().from(likes);
  const likesRes = await db.insert(likes).values(allLikes);
  console.log("likes migrated", { likesRes });

  const allNotifs = await pscaleDb.select().from(notifications);
  const notifsRes = await db.insert(notifications).values(allNotifs);
  console.log("notifications migrated", { notifsRes });

  const end = Date.now();
  console.log("✅ Migrations completed in", end - start, "ms");
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
