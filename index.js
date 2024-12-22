const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');  // Import body-parser
const app = express();

// Middleware to parse JSON bodies

app.use(bodyParser.json());  // To parse incoming request bodies as JSON


// Array to hold students
let students = [];

// API to add a new student
app.post('/addStudent', async (req, res) => {
    const student = req.body;

    // Ensure student data is valid
    if (!student.id || !student.name || !student.courses) {
        return res.status(400).json({ message: 'Missing required student data (id, name, courses)' });
    }

    try {
        // Add student to the array
        students.push(student);

        // Use fs.promises.appendFile for async file operations
        await fs.appendFile('students.txt', JSON.stringify(student) + '\n', 'utf8');

        // Respond with success message
        res.status(200).json({ message: 'Student added successfully!' });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// API to sort courses by popularity
app.get('/sortCourses', (req, res) => {
    // Sort the courses array by popularity in descending order
    const courses = [
        { name: "Math 101", popularity: 10 },
        { name: "History 101", popularity: 5 },
        { name: "Physics 101", popularity: 8 }
    ];
    const sortedCourses = courses.sort((a, b) => b.popularity - a.popularity);
    res.json(sortedCourses);
});

// API to search for a course by its ID
app.get('/searchCourse/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);

    if (course) {
        res.status(200).json(course);
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
