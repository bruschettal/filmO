const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const verify = require("../verifyToken");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
    favorites: {
      tv_shows: [],
      movies: [],
    },
  });

  try {
    const user = await newUser.save();
    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    const { ...info } = user._doc;
    res.status(201).json({ ...info, accessToken });
  } catch (err) {
    res.status(400).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Wrong password or E-mail" });
    }

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== req.body.password) {
      return res.status(401).json({ message: "Wrong password or E-mail" });
    }
    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const { password, ...info } = user._doc;

    res.status(200).json({ ...info, accessToken });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/favorite", [verify], async (req, res, next) => {
  let token = req.headers.authorization.split(" ")[1];

  let decodedToken = jwt.decode(token);

  let key = "favorites." + (req.body.type == "show" ? "tv_shows" : "movies");

  // User ID
  let _id = decodedToken.id;

  let shouldAddToFavorite = req.body.favorite;

  if (shouldAddToFavorite) {
    await User.findOneAndUpdate(
      { _id },
      {
        $push: {
          [key]: req.body.id,
        },
      }
    );
  } else {
    await User.findOneAndUpdate(
      { _id },
      {
        $pull: {
          [key]: req.body.id,
        },
      }
    );
  }

  res.status(200).json({ status: true });
});

router.post("/logout", async (req, res) => {
  res.status(200).json({ status: true });
});

router.get("/favorites", [verify], async (req, res, next) => {
  let token = req.headers.authorization.split(" ")[1];

  let decodedToken = jwt.decode(token);

  // User ID
  let _id = decodedToken.id;

  let user = await User.findById({ _id });

  if (user) {
    return res.status(200).json(user.favorites);
  }

  return res.status(404).json({ message: "User could not be found" });
});

module.exports = router;
/*
router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      !user && res.status(401).json("wrong password or uname");
  
      const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
      const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
  
      originalPassword !== req.body.password &&
        res.status(401).json("wrong password or unamew");
  
      const { password, ...info } = user._doc;
  
      //res.status(200).json(info);
    } catch (err) {
      res.status(500).json(err);
    }
    */
