const messages = document.querySelector(".messages");
window.addEventListener("load", renderElements);

async function renderElements() {
  try {
    if (!localStorage.getItem("token")) {
      window.location = "login.html";
    }
    const v1 = axios.get("http://localhost:4000/user/all-users", {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    const v2 = axios.get("http://localhost:4000/message/get-messages", {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });

    const [res, messages] = await Promise.all([v1, v2]);
    console.log(res);
    console.log(messages);
    res.data.users.forEach((user) => {
      showUser(user);
    });
    const id = messages.data.id;
    messages.data.messages.forEach((message) => {
      showMessage(message, id === message.userId);
    });
    setTimeout(() => {
      location.reload();
    }, 1000);
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

function showMessage(data, user) {
  const div = document.createElement("div");
  div.textContent = data.message;
  if (user) {
    div.className = "u-message";
  } else {
    div.className = "o-message";
  }

  messages.appendChild(div);
}

document.forms[0].addEventListener("submit", sendMessage);

async function sendMessage(e) {
  try {
    e.preventDefault();
    const message = e.target.message.value;
    const data = { message };
    const res = await axios.post(
      "http://localhost:4000/message/add-message",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    console.log(res);
    showMessage(message, true);
    e.target.message.value = "";
  } catch (e) {
    console.log(e);
  }
}
