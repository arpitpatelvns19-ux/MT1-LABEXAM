
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending"
    },
    {
        id: 2,
        taskName: "Create Database Design",
        assignedTo: "Amit Kumar",
        status: "Completed"
    },
    {
        id: 3,
        taskName: "Test Application",
        assignedTo: "Priya Singh",
        status: "Pending"
    }
];

const server = http.createServer((req, res) => {

    const url = new URL(req.url, "http://localhost:3000").pathname;
    const method = req.method;

    // Route 1: Home
    if (url === "/" && method === "GET") {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>Welcome to Employee Task Management</h1>");
    }

    // Route 2: Get all tasks
    else if (url === "/tasks" && method === "GET") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(tasks));
    }

    // Route 3: About
    else if (url === "/about" && method === "GET") {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>Employee Task Management Application</h1>");
    }

    // Route 4: Serve HTML using FS module
    else if (url === "/home" && method === "GET") {

        const filePath = path.join(
            __dirname,
            "public",
            "index.html"
        );

        fs.readFile(filePath, (err, data) => {

            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });

                res.end("Error reading HTML file");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });
    }

    // Route 5: Add task
    else if (url === "/add-task" && method === "POST") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            try {
                const newTask = JSON.parse(body);

                if (
                    newTask.id === undefined ||
                    !newTask.taskName ||
                    !newTask.assignedTo ||
                    !newTask.status
                ) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "All required fields must be provided"
                    }));

                    return;
                }

                tasks.push(newTask);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Task added successfully",
                    task: newTask
                }));
            }

            catch (error) {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Invalid JSON request"
                }));
            }
        });
    }

    // Invalid route
    else {
        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        res.end("404 - Page Not Found");
    }

});

// Start server
server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});
