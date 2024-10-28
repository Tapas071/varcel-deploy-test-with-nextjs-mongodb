import dbConnect from "@/lib/dbConnect";
import TodoModel from "@/lib/model/Todo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect(); // Connect to the database
    const todos = await TodoModel.find({}); // Fetch all todos
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error("Error fetching todos:", error); // Log the error
    return NextResponse.json(
      { error: "An error occurred while fetching todos" },
      { status: 500 }
    );
  }
}
