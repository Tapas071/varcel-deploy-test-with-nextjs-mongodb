import dbConnect from "@/lib/dbConnect";
import TodoModel from "@/lib/model/Todo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const mappedData = { title: data.title };

    console.log("Received Todo:", mappedData);

    // Connect to MongoDB
    await dbConnect();

    // Create a new todo and save it to the database
    const todo = new TodoModel(mappedData);
    await todo.save();

    // Respond with the newly created todo
    return NextResponse.json(
      { todo, message: "Todo has been added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding todo:", error);
    return NextResponse.json(
      { error: "An error occurred while adding the todo" },
      { status: 500 }
    );
  }
}
