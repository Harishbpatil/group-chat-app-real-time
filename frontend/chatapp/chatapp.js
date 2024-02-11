const messages = document.querySelector(".messages");
window.addEventListener("load", renderElemets);

async function renderElemets() {
  try {
    if (!localStorage.getItem("token")) {
      window.location = "login.html";
    }
    const res = await axios.get("http://localhost:4000/user/all-users", {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    console.log(res);
    res.data.users.forEach((user) => {
      showUser(user);
    });
  } catch (e) {
    console.log(e);
  }
}

function showUser(user) {
  const div = document.createElement("div");
  div.textContent = user.name + " joined";
  div.className = "o-message";
  messages.appendChild(div);
}
