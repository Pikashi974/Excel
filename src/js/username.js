function addUserName() {
  let infoUsers = JSON.parse(localStorage.user);
  document.getElementById("userName").innerText = infoUsers.username
    ? infoUsers.username
    : infoUsers.email;
  document.getElementById(
    "userName"
  ).innerHTML += `<button type="button" class="btn btn-outline-danger" id="disconnect">Déconnexion</button>`;
}
addUserName();

document.querySelector("#disconnect").addEventListener("click", () => {
  localStorage.clear();
  location.href = "/login";
});
