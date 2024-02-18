import { drizzle } from "drizzle-orm/mysql2";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import mysql from "mysql2/promise";
import { neon } from "@neondatabase/serverless";
// import { posts } from "./schem/posts";
import { posts as postsPg } from "./schema/posts";
// import { comments } from "./schem/comments";
import { comments as commentsPg } from "./schema/comments";
// import { likes } from "./schem/likes";
import { likes as likesPg } from "./schema/likes";
// import { notifications } from "./schem/notifications";
import { notifications as notificationsPg } from "./schema/notifications";

const runMigrate = async () => {
  console.log("⏳ Running migrations...");
  const start = Date.now();

  const neonSql = neon(process.env.NEON_DB_URL!);
  const neonDb = neonDrizzle(neonSql);

  await migrate(neonDb, {
    migrationsFolder: "src/server/db/migrations",
  });

  // const connection2 = await mysql.createConnection({
  //   host: "",
  //   user: "",
  //   database: "",
  //   password: "",
  //   port: 0,
  // });
  // const db = drizzle(connection2);

  // const allPosts = await db.select().from(posts);
  // const postsRes = await neonDb.insert(postsPg).values(allPosts);
  // console.log("posts migrated", { postsRes });

  // const allComments = await db.select().from(comments);
  // const commentsRes = await neonDb.insert(commentsPg).values(allComments);
  // console.log("comments migrated", { commentsRes });

  // const allLikes = await db.select().from(likes);
  // const likesRes = await neonDb.insert(likesPg).values(allLikes);
  // console.log("likes migrated", { likesRes });

  // const allNotifs = await db.select().from(notifications);
  // const notifsRes = await neonDb.insert(notificationsPg).values(allNotifs);
  // console.log("notifications migrated", { notifsRes });

  const end = Date.now();
  console.log("✅ Migrations completed in", end - start, "ms");
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
