const db = require("./script");

exports.getMeetups = async () => {
  try {
    return await db.meetup.findMany();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.addMeetup = async (data) => {
  try {
    return await db.meetup.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        imageUrl: data.imageUrl,
        address: data.address,
        createrId: data.createrId,
        contactEmail: data.contactEmail,
        isFavorite: data.isFavorite,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getAMeetUp = async (id) => {
  try {
    return await db.meetup.findFirst({ where: { id } });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.updateMeetup = async (id, data) => {
  try {
    await db.meetup.update({ where: { id }, data: { ...data } });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.deleteMeetup = async (id) => {
  try {
    await db.meetup.delete({ where: { id } });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
