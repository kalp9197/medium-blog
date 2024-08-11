import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    // Check if email and password are provided
    if (!body.email || !body.password) {
      c.status(400);
      return c.json({ error: "Email and password are required" });
    }

    // Create user without password hashing
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password, // Storing plain-text password (Not recommended in production)
      },
    });

    // Generate JWT
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      jwt: token,
    });
  } finally {
    await prisma.$disconnect();
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    // Check if email and password are provided
    if (!body.email || !body.password) {
      c.status(400);
      return c.json({ error: "Email and password are required" });
    }

    // Find user by email and password
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password, // Matching the plain-text password
      },
    });

    if (!user) {
      c.status(403);
      return c.json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } finally {
    await prisma.$disconnect();
  }
});

export default userRouter;
