import { getStore } from "@netlify/blobs";

export default async (request) => {

    const store = getStore("students");

    // GET students
    if (request.method === "GET") {

        const students = await store.get("all", {
            type: "json"
        });

        return new Response(
            JSON.stringify(students || []),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }


    // ADD student
    if (request.method === "POST") {

        const student = await request.json();

        const students = await store.get("all", {
            type: "json"
        }) || [];


        const newStudent = {
            id: Date.now(),
            name: student.name,
            email: student.email,
            rollNumber: student.rollNumber,
            semester: student.semester,
            createdAt: new Date().toISOString()
        };


        students.push(newStudent);


        await store.setJSON("all", students);


        return new Response(
            JSON.stringify({
                success: true,
                student: newStudent
            }),
            {
                status: 201,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }


    return new Response(
        JSON.stringify({
            error: "Method not allowed"
        }),
        {
            status: 405,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
};
