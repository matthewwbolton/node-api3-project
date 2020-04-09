const express = require("express");
const posts = require("./postDb");

const router = express.Router();

router.get("/", (req, res) => {
  // do your magic!
  posts
    .get()
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "There was an error retrieving data from the server." });
    });
});

router.get("/:id", (req, res) => {
  // do your magic!
  posts
    .getById(req.params.id)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "The post with the specified ID does not exist." });
    });
});

router.delete("/:id", (req, res) => {
  // do your magic!
  posts
    .remove(req.params.id)
    .then((post) => {
      res.status(204).json(post);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "Your post could not be deleted at this time." });
    });
});

router.put("/:id", (req, res) => {
  // do your magic!
  posts
    .update(req.params.id, req.body)
    .then((post) => {
      if (post && req.body.text) {
        posts.getById(req.params.id).then((post) => {
          res.status(200).json(post);
        });
      } else if (!req.body.text) {
        res
          .status(400)
          .json({ error: "To update a post, you are required to enter text." });
      } else {
        res
          .status(404)
          .json({ error: "The post with the specified ID cannot be found." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "The post cannot be updated at this time." });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  posts
    .getById(req.params.id)
    .then((post) => {
      if (post) {
        next();
      } else {
        res.status(404).json({ error: "The specified post ID is invalid!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Server Error" });
    });
}

module.exports = router;
