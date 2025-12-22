import { NextResponse, NextRequest } from "next/server";
import slugify from "slugify";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) {
    return NextResponse.redirect("/login", 302);
  }

  const authorId = payload.id as number;

  const { searchParams } = new URL(req.url);
  const getAllPosts = searchParams.get("all") === "true";

  try {
    const postsData = await prisma.post.findMany({
      where: getAllPosts ? {} : { authorId },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        status: true,
        createAt: true,
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        tags: {
          select: {
            tag: { select: { id: true, name: true } },
          },
        },
      },
    });

    return NextResponse.json(postsData, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Failed to post." }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const payload = await verifyToken(req);
  if (!payload) {
    return NextResponse.redirect("/login", 302);
  }

  const authorId = payload.id as number;

  try {
    const { title, content, categoryId, tagIds } = await req.json();
    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { message: "Missing required fields: title, content, or categoryId" },
        { status: 400 }
      );
    }

    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    await prisma.$transaction(async (tx) => {
      const newPost = await tx.post.create({
        data: {
          title,
          slug,
          content,
          authorId,
          categoryId,
        },
      });

      if (Array.isArray(tagIds) && tagIds.length > 0) {
        await tx.postTag.createMany({
          data: tagIds.map((tagId: number) => ({
            postId: newPost.id,
            tagId,
          })),
          skipDuplicates: true,
        });
      }
    });

    return NextResponse.json(
      { message: "Post created successfully" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "Failed to post." }, { status: 400 });
  }
}
