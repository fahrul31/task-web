const express = require("express");
const router = express.Router();
const emailQueue = require("../queues/email-queue");
let users = [];

router.get("/", (req, res) => {
    res.send("Hello World!");
});

router.get("/users", (req, res) => {
    res.json(users);
});

// router.post("/users", (req, res) => {
//     users.push(req.body);
//     res.status(201).send("User created");
// });

router.post("/users", async (req, res) => {
    try {
        const newUser = req.body;

        if (!newUser.name || !newUser.email) {
            return res.status(400).send("Name and email are required");
        }

        users.push(newUser);

        await emailQueue.add({
            email: newUser.email,
            name: newUser.name
        },
            {
                attempts: 3,
                backoff: {
                    type: "fixed",
                    delay: 5000
                }
            }
        )

        console.log(`User created and email queued for : ${newUser.email}`);

        res.status(201).json({
            message: "User created",
            user: newUser
        });

    } catch (e) {
        console.error(`Error creating user: ${e.message}`);
        res.status(500).json({
            message: "Error creating user",
            error: e.message
        });
    }
})

module.exports = router;