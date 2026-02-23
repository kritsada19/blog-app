import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { role: true },
  });

  if (!user) {
    return NextResponse.json({ message: "User notfound" }, { status: 404 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const usersCount = await prisma.user.count({
      where: { role: "USER" },
    });
    const postsCount = await prisma.post.count();
    const commentsCount = await prisma.comment.count();
    const categoriesCount = await prisma.category.count();
    const tagsCount = await prisma.tag.count();

    return NextResponse.json({
      usersCount,
      postsCount,
      commentsCount,
      categoriesCount,
      tagsCount,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
