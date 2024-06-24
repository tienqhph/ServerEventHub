const userModel = require("../model/userModel");

const addNewEvent = async (req, res) => {
  const data = req.body;
  console.log(data);
  const existingUser = await userModel.findOne({
    _id: data.authorId,
  });

  if (existingUser) {
    console.log("cos usser trong database" , existingUser);
  } else {
    console.log("khong co user");
  }
};

module.exports = {
  addNewEvent,
};
