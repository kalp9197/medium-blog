import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();
app.get("/", (c) => {
  return c.text("hellooworld");
});

app.post("/api/v1/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
    },
  });

  //@ts-ignore
  const token = await sign({ id: user.id }, "kalpsecret");

  return c.json({
    jwt: token,
  });
});

app.post("/api/v1/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    c.status(403);
    return c.json({ error: "user not found" });
  }

  //@ts-ignore
  const jwt = await sign({ id: user.id }, "kalpsecret");
  return c.json({ jwt });
});

app.post("/api/v1/blog", (c) => {
  return c.text("hello");
});

app.put("/api/v1/blog", (c) => {
  return c.text("hello");
});

app.get("/api/v1/blog/:id", (c) => {
  return c.text("hello");
});

export default app;
