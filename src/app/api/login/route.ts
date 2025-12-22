import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json(
            { message: "Missing required fields: email, password" }, 
            { status: 400 }
        )
    }

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if(!user) {
        return NextResponse.json(
            { message: "Email not found." },
            { status: 404 }
        )
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword) {
        return NextResponse.json(
            { message: "Invalid username or password" },
            { status: 401 }
        )
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: "1h" }
    )

    const response = NextResponse.json(
        { message: "Login successful!", role: user.role },
        { status: 201 }
    )

    response.cookies.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60
    })

    return response

  } catch (e) {
    console.error(e);
    return NextResponse.json(
        { message: "Failed to login." }, 
        { status: 500 }
    );
  }
}
