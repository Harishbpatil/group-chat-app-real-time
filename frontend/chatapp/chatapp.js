const messages = document.querySelector(".messages");
let rendered = false;
const groups = document.querySelector(".show-groups");
window.addEventListener("load", renderElements);
var curr_group = null;
const users = document.querySelector(".show-users");
const displayUsers = document.querySelector(".display-users");

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
        `http://54.88.157.175:4000/group/join-group/${id}`,
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      showGroups(group.data.group);
    }
    const res = await axios.get("http://54.88.157.175:4000/group/get-groups", {
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

    window.location = "login.html";
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
  span.onclick = (e) => {
    e.stopPropagation();
    const link = `http://127.0.0.1:5500/?id=${group.id}`;
    navigator.clipboard.writeText(link);
    console.log("clicked");
  };

  div.onclick = async () => {
    curr_group = group;
    document.querySelector(".header").classList.remove("hide");
    document.querySelector(".messages").classList.remove("hide");
    document.querySelector(".send-messages").classList.remove("hide");
    document.querySelector(".show-users").classList.add("hide");
    await showGroupMessages();
  };

  groups.appendChild(div);
}

setInterval(async () => {
  if (curr_group) await showGroupMessages();
}, 2000);

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
      "http://54.88.157.175:4000/message/add-message",
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
      "http://54.88.157.175:4000/group/create",
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
      `http://54.88.157.175:4000/message/get-messages/${group.id}/?messageId=${mId}`,
      {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const res2 = await axios.get(
      `http://54.88.157.175:4000/group/all-users/${group.id}/?id=${uId}`,
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

    const res3 = await axios.post(
      `http://54.88.157.175:4000/admin/show-users/${group.id}`,
      null,
      {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    console.log(res3);
    displayUsers.innerHTML = ``;
    res3.data.forEach((user) => {
      addUser(user);
    });
  } catch (e) {
    console.log(e);
  }
}

function showUser(user) {
  const member = curr_group.member;
  console.log(member);
  console.log(user);
  const div = document.createElement("div");
  div.textContent = user.name;

  div.className = "curr_user";

  if (user.member.admin) {
    const span = document.createElement("span");
    div.className = "curr_user admin";
    span.textContent = "admin";
    div.appendChild(span);
  }
  if (user.member.id != member.id && member.admin) {
    const btns = document.createElement("div");
    console.log(user.member.id + " : " + member.id);
    const makeAdmin = document.createElement("button");
    makeAdmin.textContent = "Make Admin";

    const removeAdmin = document.createElement("button");
    removeAdmin.textContent = "Remove Admin";
    if (user.member.admin) makeAdmin.classList.add("hide");
    else removeAdmin.classList.add("hide");
    let final_users =
      JSON.parse(localStorage.getItem(`user-${curr_group.id}`)) || [];
    makeAdmin.onclick = async () => {
      try {
        const res = await axios.post(
          `http://54.88.157.175:4000/admin/make-admin/${curr_group.id}`,
          { userId: user.id },
          {
            headers: {
              "auth-token": localStorage.getItem("token"),
            },
          }
        );
        final_users = final_users.map((elem) => {
          console.log(elem);
          // console.log(elem.userId + " : " + user.id)
          if (elem.member.userId == user.id) {
            elem.member.admin = true;
          }
          return elem;
        });
        localStorage.setItem(
          `user-${curr_group.id}`,
          JSON.stringify(final_users)
        );
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    };

    removeAdmin.onclick = async () => {
      try {
        const res = await axios.post(
          `http://54.88.157.175:4000/admin/remove-admin/${curr_group.id}`,
          { userId: user.id },
          {
            headers: {
              "auth-token": localStorage.getItem("token"),
            },
          }
        );
        console.log(res);
        final_users = final_users.map((elem) => {
          console.log(elem);
          // console.log(elem.userId + " : " + user.id)
          if (elem.member.userId == user.id) {
            elem.member.admin = false;
          }
          return elem;
        });
        localStorage.setItem(
          `user-${curr_group.id}`,
          JSON.stringify(final_users)
        );
      } catch (e) {
        console.log(e);
      }
    };
    btns.appendChild(removeAdmin);

    const removeUser = document.createElement("button");
    removeUser.textContent = "Remove User";

    removeUser.onclick = async () => {
      try {
        const res = await axios.post(
          `http://54.88.157.175:4000/admin/remove-member/${curr_group.id}`,
          { userId: user.id },
          {
            headers: {
              "auth-token": localStorage.getItem("token"),
            },
          }
        );
        final_users = final_users.filter((elem) => {
          console.log(elem);
          // console.log(elem.userId + " : " + user.id)
          if (elem.member.userId != user.id) return elem;
        });
        localStorage.setItem(
          `user-${curr_group.id}`,
          JSON.stringify(final_users)
        );
        addUser(user);
        users.removeChild(div);
      } catch (e) {
        console.log(e);
      }
    };

    btns.appendChild(makeAdmin);
    btns.appendChild(removeUser);
    div.classList.add("user");
    div.classList.add("curr_user");
    div.appendChild(btns);
  }
  users.appendChild(div);
}

document.querySelector(".header").addEventListener("click", () => {
  const message = document.querySelector(".messages");
  const sendMessages = document.querySelector(".send-messages");
  const users = document.querySelector(".show-users");
  const divUsers = document.querySelector(".users");
  const addUser = document.querySelector(".add-users");

  addUser.classList.add("hide");
  if (users.classList.contains("hide")) {
    message.classList.add("hide");
    sendMessages.classList.add("hide");
    users.classList.remove("hide");
    divUsers.classList.remove("hide");
  } else {
    divUsers.classList.add("hide");
    users.classList.add("hide");
    message.classList.remove("hide");
    sendMessages.classList.remove("hide");
  }
});

document.getElementById("add-user-toggle-btn").addEventListener("click", () => {
  const users = document.querySelector(".show-users");
  const addUsers = document.querySelector(".add-users");
  const displayUsers = document.querySelector(".display-users");

  if (users.classList.contains("hide")) {
    users.classList.remove("hide");
    addUsers.classList.add("hide");
    document.getElementById("add-user-toggle-btn").textContent = "Add Users";
  } else {
    users.classList.add("hide");
    addUsers.classList.remove("hide");
    document.getElementById("add-user-toggle-btn").textContent = "Show Users";
  }
});

function addUser(user) {
  console.log(user);
  const div = document.createElement("div");
  div.className = "add-user group-items";
  div.textContent = `Name : ${user.name} Email : ${user.email}`;

  const btn = document.createElement("button");
  btn.textContent = "Add User";

  btn.onclick = async () => {
    try {
      console.log(curr_group);
      const res = await axios.post(
        `http://54.88.157.175:4000/admin/add-user/${curr_group.id}`,
        {
          id: user.id,
        },
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      displayUsers.removeChild(div);
      showUser(user);
    } catch (e) {
      console.log(e);
    }
  };

  div.appendChild(btn);

  displayUsers.appendChild(div);
}

document.getElementById("search").addEventListener("keyup", (e) => {
  const text = e.target.value;
  Array.from(displayUsers.children).forEach((user) => {
    if (user.textContent.indexOf(text) == -1) user.classList.add("hide");
    else user.classList.remove("hide");
  });
});
