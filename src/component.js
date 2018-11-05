export default (text = "yeet") => {
  const element = document.createElement("div");

  element.innerHTML = text;

  return element;
};