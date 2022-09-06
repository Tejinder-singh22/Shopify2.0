function validate() {

  var user = document.getElementById("shop_name").value;

  var re = /myshopify.com$/;
  if (!re.test(user)) {
      error.textContent = "myshopify.com is not included at the end";
      error.style.color = "red"
      return false;
  }
  else if (user.indexOf("http://") == 0 || user.indexOf("https://") == 0) {
      error.textContent = "do not include http:// or https:// at starting";
      error.style.color = "red"

      return false;
  } if (user == " ") {
    error.textContent = "Field can't be empty";
    error.style.color = "red"

    return false;
}
  else {
      error.textContent = "";
      return true;
  }
}