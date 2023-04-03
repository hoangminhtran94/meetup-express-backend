const db = require("./script");

exports.createAUser = async (data) => {
  try {
    return await db.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        profileImage: data.profileImage,
        phone: data.phone,
        address: data.address,
        email: data.email,
        password: data.password,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.getAUser = async (email) => {
  try {
    return await db.user.findFirst({
      where: { email: email },
    });
  } catch (error) {
    throw error;
  }
};

exports.getAUserById = async (id) => {
  try {
    return await db.user.findFirst({ where: { id } });
  } catch (error) {
    throw error;
  }
};
