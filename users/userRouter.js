const express = require("express");

const users = require("./userDb");
const posts = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  console.log(req.body);
  // do your magic!
  users
    .insert(req.body)
    .then((user) => {
      if (req.body.name) {
        res.status(201).json(user);
      } else {
        res.status(400).json({ error: "Please provide a name for the user." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "The user could not be created at this time." });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  console.log(req.body);
  // do your magic!
  if (req.body.text && req.body.user_id) {
    users
      .getById(req.params.id)
      .then((user) => {
        if (user) {
          posts
            .insert(req.body)
            .then((post) => {
              res.status(201).json(post);
            })
            .catch((err) => {
              res
                .status(500)
                .json({ error: "Could not add the post at this time." });
            });
        } else {
          res
            .status(404)
            .json({ error: "The user with the specified ID cannot be found!" });
        }
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: "The specidied ID is not associated with any user." });
      });
  } else {
    res
      .status(400)
      .json({ error: "Please provide text and UserID to add a post!" });
  }
});

router.get("/", (req, res) => {
  // do your magic!
  users
    .get()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({
        error: "The users could not be retrieved from the server at this time.",
      });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  // do your magic!
  users
    .getById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ error: "The user with the specified ID cannot be found." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "The operation to find that user has failed." });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  // do your magic!
  users
    .getUserPosts(req.params.id)
    .then((post) => {
      if (post.length) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ error: "There is no user associated with the ID provided." });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error:
          "The posts for the specified user cannot be retrieved at this time.",
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  // do your magic!
  users
    .remove(req.params.id)
    .then((user) => {
      if (user) {
        users;
        res.status(204).json(user);
      } else {
        res
          .status(404)
          .json({ error: "The user with the specified ID does not exist." });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "The user with the specified ID cannot be deleted at this time.",
      });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  // do your magic!
  console.log(req.body);
  users
    .update(req.params.id, req.body)
    .then((user) => {
      if (user && req.body.name) {
        // res.status(200).json(user);
        users.getById(req.params.id).then((user) => res.status(200).json(user));
      } else if (!req.body.name) {
        res
          .status(400)
          .json({ error: "You must provide a name to be updated" });
      } else {
        res.status(404).json({
          error:
            "The user with the specified ID cannot be found and can therefor not be updated at this time. ",
        });
      }
    })
    .catch((err) =>
      res.status(500).json({
        error:
          "The user with the specified ID could not be updated at this time.",
      })
    );
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  users
    .getById(req.params.id)
    .then((user) => {
      if (user) {
        next();
      } else {
        res.status(400).json({ error: "Invalid user ID" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "The server cannot validate the user!" });
    });
}

function validateUser(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({ message: "Missing User Data" });
  } else if (!req.body.name) {
    res.status(400).json({ error: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({ error: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ error: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
