const messages = document.querySelector(".messages");
let rendered = false;
const groups = document.querySelector(".show-groups");
window.addEventListener("load", renderElements);
var curr_group = null;
const users = document.querySelector(".show-users");

async function renderElements() {
  try {
    if (!localStorage.getItem("token")) {
      window.location = "login.html";
    }
    const urlParams = new URLSearchParams(window.location.search);

    const id = urlParams.get("id");
    if (id) {
      console.log("id present");
      const group = await axios.get(
        `http://localhost:4000/group/join-group/${id}`,
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      showGroups(group.data.group);
    }
    const res = await axios.get("http://localhost:4000/group/get-groups", {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    console.log(res);
    res.data.forEach((group) => {
      if (group.id != id) showGroups(group);
    });
  } catch (e) {
    console.log(e);
    window.location = "/";
  }
}

function showGroups(group) {
  const div = document.createElement("div");

  div.textContent = group.name;
  div.className = "group-items";
  div.id = group.id;

  const span = document.createElement("span");
  span.textContent = "+";
  div.appendChild(span);

  groups.appendChild(div);
}

// Event delegation for the "+" sign and group items
groups.addEventListener("click", async (e) => {
  if (e.target.tagName === "SPAN") {
    e.stopPropagation();
    const groupId = e.target.parentElement.id;
    const userId = prompt("Enter the user ID:");
    if (userId) {
      try {
        const response = await axios.post(
          `http://localhost:4000/group/add-user/${groupId}`,
          { userId },
          {
            headers: {
              "auth-token": localStorage.getItem("token"),
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  } else if (e.target.classList.contains("group-items")) {
    const groupId = e.target.id;
    curr_group = { id: groupId, name: e.target.textContent };
    document.querySelector(".header").classList.remove("hide");
    document.querySelector(".messages").classList.remove("hide");
    document.querySelector(".send-messages").classList.remove("hide");
    document.querySelector(".show-users").classList.add("hide");
    showGroupMessages();
  }
});

setInterval(async () => {
  if (curr_group) await showGroupMessages();
}, 2000);

function showUser(user) {
  console.log(user);
  const div = document.createElement("div");
  div.textContent = user.name;
  div.className = "user";

  if (user.member.admin) {
    const span = document.createElement("span");
    span.textContent = "admin";
    div.appendChild(span);
  }
  users.appendChild(div);
}

async function showGroupMessages() {
  console.log(curr_group);
  const group = curr_group;
  try {
    let final_messages =
      JSON.parse(localStorage.getItem(`message-${group.id}`)) || [];
    let final_users =
      JSON.parse(localStorage.getItem(`user-${group.id}`)) || [];
    let mId = 0;
    let uId = 0;
    if (final_messages.length > 0)
      mId = final_messages[final_messages.length - 1].id;
    if (final_users.length > 0) uId = final_users[final_users.length - 1].id;
    const res = await axios.get(
      `http://localhost:4000/message/get-messages/${group.id}/?messageId=${mId}`,
      {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const res2 = await axios.get(
      `http://localhost:4000/group/all-users/${group.id}/?id=${uId}`,
      {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    console.log(res);
    console.log(res2);
    messages.innerHTML = ``;
    final_messages = [...final_messages, ...res.data.messages];
    document.querySelector(".group-message h2").textContent = group.name;
    final_users = [...final_users, ...res2.data];
    final_messages.forEach((message) => {
      showMessage(message, res.data.id, final_users);
    });
    users.innerHTML = ``;

    final_users.forEach((user) => {
      showUser(user);
    });
    localStorage.setItem(`message-${group.id}`, JSON.stringify(final_messages));
    localStorage.setItem(`user-${group.id}`, JSON.stringify(final_users));
  } catch (e) {
    console.log(e);
  }
}

function showMessage(data, id, users) {
  const div = document.createElement("div");
  console.log(typeof users);
  if (id == data.memberId) {
    div.className = "u-message";
    div.textContent = "You: " + data.message;
  } else {
    div.className = "o-message";
    const user = users.find((user) => data.memberId == user.member.id);
    div.textContent = user.name + ": " + data.message;
  }

  messages.appendChild(div);
}

document.querySelector(".header").addEventListener("click", () => {
  const message = document.querySelector(".messages");
  const sendMessages = document.querySelector(".send-messages");
  const users = document.querySelector(".show-users");

  if (users.classList.contains("hide")) {
    message.classList.add("hide");
    sendMessages.classList.add("hide");
    users.classList.remove("hide");
  } else {
    users.classList.add("hide");
    message.classList.remove("hide");
    sendMessages.classList.remove("hide");
  }
});

document
  .querySelector(".send-messages form")
  .addEventListener("submit", sendMessage);

async function sendMessage(e) {
  try {
    const groupId = curr_group.id;
    e.preventDefault();
    const data = {
      message: e.target.message.value,
      groupId,
    };
    const res = await axios.post(
      "http://localhost:4000/message/add-message",
      data,
      {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    console.log(res);
    const div = document.createElement("div");
    div.className = "u-message";
    div.textContent = "You: " + data.message;
    messages.appendChild(div);
    e.target.message.value = "";
  } catch (e) {
    console.log(e);
  }
}

document
  .getElementById("create-new-group")
  .addEventListener("submit", createNewGroup);

async function createNewGroup(e) {
  try {
    e.preventDefault();
    console.log(e.target.name.value);
    const group = await axios.post(
      "http://localhost:4000/group/create",
      { name: e.target.name.value },
      {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    console.log(group);
    e.target.name.value = "";
    showGroups(group.data.group);
    document.querySelector(".new-group").classList.add("hide");
  } catch (e) {
    console.log(e);
  }
}

document.getElementById("crete-grp").addEventListener("click", () => {
  document.querySelector(".new-group").classList.remove("hide");
});
