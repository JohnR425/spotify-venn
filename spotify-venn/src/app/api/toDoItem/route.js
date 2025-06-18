import { NextResponse } from 'next/server';

//Run in terminal to start:
//npx json-server db.json --port 5000

export async function GET() {
    const res = await fetch("http://localhost:5000/todos");
    const json = await res.json();

    return NextResponse.json(json);
}

export async function POST(request) {
    const body = await request.json();

    const res = await fetch("http://localhost:5000/todos", {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const todo = await res.json();
    return NextResponse.json(todo);
}