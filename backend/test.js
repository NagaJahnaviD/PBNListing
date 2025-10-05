const mongoose = require("mongoose");
const CategoryGroup = require("./models/categoryGroupsModel"); // import your schema file

async function seedCategoryGroups() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/openpixel_pbnlisting", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const today = new Date();

    const data = [
      {
        categoryGroupId: 1,
        serviceId: 2,
        categoryGroupName: "Food & Restaurants",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 2,
        serviceId: 4,
        categoryGroupName: "Catering",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 3,
        serviceId: 4,
        categoryGroupName: "Wedding",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 4,
        serviceId: 4,
        categoryGroupName: "Astrology",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 5,
        serviceId: 4,
        categoryGroupName: "Party & Event Planners",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 6,
        serviceId: 4,
        categoryGroupName: "Schools & Classes",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 7,
        serviceId: 4,
        categoryGroupName: "Fashion & Clothing",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 8,
        serviceId: 1,
        categoryGroupName: "Homes & Rentals",
        categoryOrder: 0,
        status: "D",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 9,
        serviceId: 4,
        categoryGroupName: "Services & Dealers",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 10,
        serviceId: 4,
        categoryGroupName: "Photography",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 11,
        serviceId: 4,
        categoryGroupName: "Artists",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 12,
        serviceId: 4,
        categoryGroupName: "Other Community Services",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 13,
        serviceId: 6,
        categoryGroupName: "Doctors",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 14,
        serviceId: 6,
        categoryGroupName: "Beauty & Fashion",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 15,
        serviceId: 6,
        categoryGroupName: "Photographers",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 16,
        serviceId: 6,
        categoryGroupName: "Dealers & Contractors",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 17,
        serviceId: 6,
        categoryGroupName: "Other Consumer Services",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 18,
        serviceId: 6,
        categoryGroupName: "Travel & Leisure",
        categoryOrder: 0,
        status: "A",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 19,
        serviceId: 4,
        categoryGroupName: "Tuitions",
        categoryOrder: 0,
        status: "D",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 20,
        serviceId: 9,
        categoryGroupName: "vehicles",
        categoryOrder: 0,
        status: "D",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 21,
        serviceId: 9,
        categoryGroupName: "Sporting",
        categoryOrder: 0,
        status: "D",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 22,
        serviceId: 9,
        categoryGroupName: "Household",
        categoryOrder: 0,
        status: "D",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 23,
        serviceId: 9,
        categoryGroupName: "Arts+Crafts",
        categoryOrder: 0,
        status: "D",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 24,
        serviceId: 9,
        categoryGroupName: "Antiques",
        categoryOrder: 0,
        status: "D",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      },
      {
        categoryGroupId: 25,
        serviceId: 9,
        categoryGroupName: "Appliances",
        categoryOrder: 0,
        status: "D",
        createdBy: 1,
        createdOn: today,
        updatedBy: 1,
        updatedOn: today
      }
    ];

    await CategoryGroup.insertMany(data);
    console.log("✅ Category groups inserted successfully with today's date.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error inserting category groups:", error);
    process.exit(1);
  }
}

seedCategoryGroups();
