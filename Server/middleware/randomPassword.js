const randomPassword = () => {
  let pass = "";
  const str =
    "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";
  let strLength = str.length;
  for (let i = 0; i <= 7; i++) {
    let randNo = Math.floor(Math.random() * strLength);
    pass = pass + str.charAt(randNo);
  }
  return pass;
};

module.exports = {
  randomPassword,
};