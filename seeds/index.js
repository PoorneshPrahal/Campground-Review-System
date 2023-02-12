const mongoose = require("mongoose");
const campground = require("../models/campground");

const { places, descriptions } = require("./helpers");
const cities = require("./cities");

mongoose.set("strictQuery", true);

mongoose
  .connect(
    "mongodb+srv://Poornesh:Poornesh1@cluster0.arlenii.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((res) => {
    console.log("Connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const seedDB = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    let random1000 = Math.floor(Math.random() * 1000);
    let price = Math.floor(Math.random() * 30);
    const ground = new campground({
      author: "63e3c7944aeaa00ed762e39a",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptions)}, ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis deleniti voluptatibus ducimus vel autem nemo id, soluta nihil qui delectus ipsum, amet non molestiae? Et maiores exercitationem quis provident quisquam!",
      price,
    });
    await ground.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
