const express = require("express");
const cors = require("cors"); // Importando o middleware CORS
const axios = require("axios");
const router = express.Router();

const keys = require("../config/keys");

// CORS Middleware - permitir requisições de localhost:3000
router.use(cors());  // Permite todas as origens, mas você pode especificar como mostrado anteriormente

// @route   GET api/profile/test
// @desc    Test Posts Route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Github Works" }));

// @route       GET api/profile/github/:username/:count/:sort
// @desc        Get github data from github api
// @access      Public
// @test        http://ip:port/api/github/rodrigogrohl/5/created:%20asc
router.get("/:username/:count/:sort", (req, res) => {
  const username = req.params.username;
  const count = req.params.count;
  const sort = req.params.sort;
  const clientId = keys.clientId.trim();
  const clientSecret = keys.clientSecret.trim();
  const url = `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`;

  axios
    .get(url)
    .then(response => {
      res.json(response.data);  // Retorna dados do GitHub
    })
    .catch(err => {
      if (err.response) {
        res.status(err.response.status).json({ message: err.response.statusText });  // Erro da API do GitHub
      } else {
        res.status(500).json({ message: "Failed to reach GitHub API" });  // Falha de rede ou outro erro
      }
    });
});

module.exports = router;
