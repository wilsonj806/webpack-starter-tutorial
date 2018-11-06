export default (text = "banana phone") => {
  const element = document.createElement("div");

  element.innerHTML = text;

  return element;
};