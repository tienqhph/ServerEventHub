require("dotenv").config();
const { default: mongoose } = require("mongoose");

const UrlBd = `mongodb+srv://hoangtienlop11a2:${process.env.DATABASE_PASS}@clustereventhub.hoc2hua.mongodb.net/?retryWrites=true&w=majority&appName=ClusterEventHub`;

const connectToDb = async () => {
  try {
    const conection = await mongoose.connect(UrlBd);

    console.log("conect to db susessfully");

    console.log();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectToDb;
