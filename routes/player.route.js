const express = require("express");
const route = express.Router();
const multer = require("multer");

const metaDataModel = require("../models/metadata.model");
const fs = require("fs");
const mm = require("musicmetadata");
const base64Img = require("base64-img");
const rmdir = require("rmdir");
const makeDir = require("make-dir");

/////////////
let diskStorage = multer.diskStorage({
  destination: (req, res, next) => {
    // destination of upload file
    next(null, "./public/uploads/");
  },
  filename: (req, res, next) => {
    let fileOption = [
      "audio/mpeg",
      "audio/flac",
      "audio/wav",
      "audio/mp4",
      "audio/aac",
    ];
    if (fileOption.indexOf(res.mimetype) === -1) {
      let errorMess = "This format does not support!";
      return next(errorMess, null);
    }

    let filename = res.originalname;
    next(null, filename);
  },
});

const fileUpload = multer({ storage: diskStorage }).array("file", 3);

/////////////
route.post("/", (req, res) => {
  const path = makeDir("./public/uploads"); //create destination

  fileUpload(req, res, (errorMess) => {
    if (errorMess) {
      return res.status(405).send("Cannot upload: " + errorMess);
    } else {
      const files = req.files;
      for (const file of files) {
        let metaData = mm(fs.createReadStream("./public/uploads/" + file.filename), (err, metaData) => {
          if (err) {
            throw err;

          } else {
            if (!metaData.picture[0].data) {
              return res.send("Cannot upload: Cannot get img data!");

            } else {
              let base64Data = metaData.picture[0].data.toString("base64");
              base64Img.img("data:image/png;base64," + base64Data, "./public/uploadsImg/", file.filename, async (err, filepath) => {
                try {
                  if (err) {
                    console.log(err);
                  } else {
                    const saveMetaData = await metaDataModel.findOrCreate({
                      where: {
                        filename: file.filename
                      },
                      defaults: {
                        title: metaData.title,
                        artist: metaData.artist[0],
                        album: metaData.album,
                        year: metaData.year,
                        genre: metaData.genre[0],
                        pictureformat: metaData.picture[0].format,
                        picturedata: filepath
                      }
                    })
                      .spread((metaData, created) => {
                        if (created) {
                          console.log(created);
                        }
                      })
                  }
                } catch (error) {
                  console.log(error);
                }
              }
              );
            }
          }
        }
        );
      }
      return res.redirect("/");
    }
  });
});

route.get("/", async (req, res) => {
  const getMetaData = await metaDataModel.findAll({
    raw: true,
  });

  res.render("upload", {
    metaDataArr: getMetaData,
  });
});

route.get("/:id", async (req, res) => {
  try {
    const idData = await metaDataModel.findAll({
      raw: true,
      where: {
        id: req.params.id,
      },
    });

    if (!idData) {
      res.sendStatus(404);
    }
    res.render("track", {
      track: idData,
    });
  } catch (err) {
    console.log(err);
  }
});

route.delete("/", async (req, res) => {
  try {
    const removeAll = await metaDataModel.destroy({
      where: {},
      truncate: true,
      cascade: false,
      restartIdentity: true
    });

    rmdir("./public/uploadsImg");
    rmdir("./public/uploads");

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

module.exports = route;
