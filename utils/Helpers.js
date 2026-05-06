

const capitalize = (value = '') => {
  const string = String(value);
  return string.charAt(0).toUpperCase() + string.slice(1);
};



module.exports={ capitalize}




