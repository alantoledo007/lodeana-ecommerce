export const upload = (file, quality) => {
  return fetch(
    `https://api.cloudinary.com/v1_1/${
      process.env.CLOUDINARY_CLOUD
    }/image/upload?upload_preset=${
      quality === "high"
        ? process.env.CLOUDINARY_PRESET_HIGH
        : process.env.CLOUDINARY_PRESET_LOW
    }&folder=${process.env.CLOUDINARY_FOLDER}`,
    {
      method: "PUT",
      body: file,
    }
  )
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then(({ secure_url }) => secure_url)
    .catch((error) => {
      return Promise.reject(error);
    });
};
