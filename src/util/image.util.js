const process = require("process");
const path = require("path");
const fs = require("fs").promises;
const sharp = require("sharp");

//@Util
//@Input: Fromdata.Array<File>
//get the file from the path
let saveImage = async (filename, files) => {
  if (!getImageLocation()) {
    console.error("FILE STORE empty");
    throw new Error("Something went wrong");
  }
  if (!filename) throw new Error("job id is undefined");
  if (!files) throw new Error("Proof of work is required");
  const defaultExt = ".jpg";
  const imageName = {
    before: "before" + defaultExt,
    after: "after" + defaultExt,
  };
  let uploaded = { before: false, after: false };
  try {
    let _idDir = path.join(getImageLocation(), filename.toString());
    await fs.mkdir(_idDir.toString(), { recursive: true });
    if (files.before) {
      let buff = await fs.readFile(path.join(files.before.path));

      const image = sharp(buff);
      const meta = await image.metadata();
      const { format } = meta;

      const config = {
        // quality between 1-100
        jpeg: { quality: 5 },
        // quality between 1-100
        webp: { quality: 5 },
        // compressionLevel between 0-9
        png: { compressionLevel: 2 },
      };
      // save the file
      await image[format](config[format]).toFile(
        path.join(_idDir, imageName.before)
      );

      uploaded.before = true;
    }
    if (files.after) {
      let buff = await fs.readFile(path.join(files.after.path));
      const image = sharp(buff);
      const meta = await image.metadata();
      const { format } = meta;

      const config = {
        // quality between 1-100
        jpeg: { quality: 5 },
        // quality between 1-100
        webp: { quality: 5 },
        // compressionLevel between 0-9
        png: { compressionLevel: 2 },
      };
      // save the file
      await image[format](config[format]).toFile(
        path.join(_idDir, imageName.after)
      );
      uploaded.after = true;
    }
    if (uploaded.before === true || uploaded.after === true)
      new Error("Failed to store files");
    return imageName;
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong!");
    return;
  }
};

//@Util
//get the file from the path
let attachImageToJob = async (job) => {
  // console.debug("dettached => "+job)
  if (!getImageLocation()) {
    console.error("FILE STORE empty");
    throw Error("Something went wrong");
  }
  if (job === undefined) throw new Error("job is undefined");

  const location = path.join(getImageLocation(), job._id.toString());
  let bbuff = await fs
    .readFile(path.join(location, job.proofOfWork.before))
    .catch((err) => console.error(err));
  let abuff = await fs
    .readFile(path.join(location, job.proofOfWork.after))
    .catch((err) => console.error(err));
  job.proofOfWork = {
    before: bbuff.toString("base64"),
    after: abuff.toString("base64"),
  };
  return job;
};

//@Util
//@Input: Fromdata.Array<File>
//get the file from the path
let saveImageFromJobTodo = async (_id, files) => {
  if (!getImageLocation()) {
    console.error("FILE STORE empty");
    throw new Error("Something went wrong");
  }
  if (!_id) throw new Error("job id is undefined");
  if (!files) throw new Error("Proof of work is required");
  const defaultExt = ".jpg";
  const imageName = {
    current: "current" + defaultExt,
  };
  let uploaded = { current: false };
  try {
    let _idDir = path.join(getImageLocation(), _id.toString());
    await fs.mkdir(_idDir.toString(), { recursive: true });
    if (files.current) {
      let buff =
        (files?.current?.path
          ? await fs.readFile(path.join(files.current.path))
          : files.current) ?? files.current;
      await fs.writeFile(path.join(_idDir, imageName.current), buff, {
        flag: "w",
      });
      uploaded.current = true;
    }
    if (uploaded.current === false) {
      console.error("failed to store files");
      throw new Error("Failed to store files");
    }
    return { current: imageName.current };
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong!");
  }
};

//@Util
//@Input : Job
//get the file from the path
let attachImageToJobTodo = async (jobTodo) => {
  // console.debug("dettached => "+job)
  if (!getImageLocation()) {
    console.error("FILE STORE empty");
    throw Error("Something went wrong");
  }
  if (jobTodo === undefined) throw new Error("job todo is undefined");

  const location = path.join(getImageLocation(), jobTodo._id.toString());
  let bbuff = await fs
    .readFile(path.join(location, jobTodo.current))
    .catch((err) => console.error(err));
  jobTodo.current = bbuff.toString("base64");
  return jobTodo;
};

let getImageLocation = () => path.resolve(process.env.FILE_STORE);

exports.attachImageToJob = attachImageToJob;
exports.attachImageToJobTodo = attachImageToJobTodo;
exports.saveImageFromJob = saveImage;
exports.saveImageFromJobTodo = saveImageFromJobTodo;
exports.getImageLocation = getImageLocation;
