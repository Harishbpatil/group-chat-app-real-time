const messages = document.querySelector(".messages");
let rendered = false;
const groups = document.querySelector(".show-groups");
window.addEventListener("load", renderElemets);

async function renderElemets() {
  try {
    const res = await axios.get("http://localhost:4000/group/get-groups", {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    console.log(res);
    res.data.forEach((group) => {
      showGroups(group);
    });
  } catch (e) {
    console.log(e);
  }
}

function showGroups(group) {
  const div = document.createElement("div");
  div.textContent = group.name;
  div.className = "group-items";
  div.id = group.id;

  div.onclick = async () => {
    console.log(group.id);
    try {
      const res = await axios.get(
        `http://localhost:4000/message/get-messages/${group.id}`,
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const res2 = await axios.get(
        `http://localhost:4000/group/all-users/${group.id}`,
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      console.log(res);
      console.log(res2);
      messages.innerHTML = ``;
      res.data.messages.forEach((message) => {
        showMessage(message, res.data.id, res2.data);
      });
    } catch (e) {
      console.log(e);
    }
  };

  groups.appendChild(div);
}

// setInterval(async()=>{
//     await renderElemets()}, 4000);
// async function renderElemets(){
//     try{
//         // let messages = []
//         // if(localStorage.getItem('messages')){
//         //     messages = JSON.parse(localStorage.getItem('messages'))
//         // }
//         // messages.innerHTML = ``
//         if(!localStorage.getItem('token')){
//             window.location = 'login.html'
//         }
// const p1 =  axios.get('http://localhost:4000/user/all-users' , {
//     headers : {
//         'auth-token' : localStorage.getItem('token')
//     }

// })
// const last = messages.length == 0 ? 0 : messages[messages.length-1].id
// const p2 =  axios.get(`http://localhost:4000/message/get-messages?id=${last}` , {
//     headers : {
//         'auth-token' : localStorage.getItem('token')
//     }

// })

// const [res , res2 ] = await Promise.all([p1,p2])
// console.log(res)
// console.log(messages)
// if(res2.data.messages.length > 0 || !rendered){
//     document.querySelector('.messages').innerHTML = ``
// const div = document.createElement('div')
// div.textContent = 'You joined'
// div.className = 'u-joined'
// document.querySelector('.messages').appendChild(div)

// const users = res.data.users
// users.forEach(user => {
//     showUser(user)
// })

// messages = [...messages , ...res2.data.messages]
// console.log(messages)

// localStorage.setItem('messages' , JSON.stringify(messages))

// const id = res2.data.id
// messages.forEach(message => {
//     showMessage(message , id === message.userId , users)
// })
// const element = document.querySelector('.messages')
// element.scrollTop = element.scrollHeight
// rendered = true
// }
//     }catch(e){
//         console.log(e)
//     }
// }

// function showUser(user){
//     const div = document.createElement('div')
//     div.textContent = user.name +' joined'
//     div.className = 'o-joined'
//     messages.appendChild(div)
// }

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

document.forms[0].addEventListener("submit", sendMessage);

async function sendMessage(e) {
  try {
    e.preventDefault();
    const data = { message: e.target.message.value };
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
    showMessage(data, true);
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
  } catch (e) {
    console.log(e);
  }
}

document.getElementById("crete-grp").addEventListener("click", () => {
  document.querySelector(".new-group").classList.remove("hide");
});
