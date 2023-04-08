import Dexie from 'dexie';

import prodb, {
  bulkcreate,
  createEle,
  getData,
  SortObj
} from "./module.js";



let db = prodb("Productdb", {
  products: `++id, name, description, price`,
  users: `++id, username, password, isManager`
});

const userid = document.getElementById("userid");
const proname = document.getElementById("proname");
const description = document.getElementById("description");
const price = document.getElementById("price");

const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");
const registerBtn = document.getElementById('register-btn');
const registerPopup = document.getElementById('register-popup');
const registerForm = document.getElementById('register-form');
const registerSubmit = document.getElementById('register-submit');
const loginBtn = document.getElementById('login-btn');
const loginPopup = document.getElementById('login-popup');
const loginForm = document.getElementById('login-form');
const loginSubmit = document.getElementById('login-submit');

loginBtn.addEventListener('click', () => {
  loginPopup.style.display = 'flex';
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const username = formData.get('username');
  const password = formData.get('password');

  // Check if the entered username and password match any user in the database
  db.users.where({ username: username, password: password }).count().then(count => {
    if (count > 0) {
      // Login is successful
      btncreate.disabled = false;
      btndelete.disabled = false;
      deletebtn.disabled = false;

      // Display success message
      const loginSuccessMsg = document.querySelector('.login-success-msg');
      loginSuccessMsg.classList.add('movedown');
      loginSuccessMsg.style.display = 'block';
      setTimeout(() => {
        loginSuccessMsg.classList.remove('movedown');
        loginSuccessMsg.style.display = 'none';
      }, 3000);
    } else {
      // Login is unsuccessful
      btncreate.disabled = true;
      btndelete.disabled = true;
      deletebtn.disabled = true;

      // Display error message
      const loginErrorMsg = document.querySelector('.login-error-msg');
      loginErrorMsg.classList.add('movedown');
      loginErrorMsg.style.display = 'block';
      setTimeout(() => {
        loginErrorMsg.classList.remove('movedown');
        loginErrorMsg.style.display = 'none';
      }, 3000);
    }

    // Close the login popup
    loginPopup.style.display = 'none';
    loginForm.reset();
  });
});

registerBtn.addEventListener('click', () => {
  registerPopup.style.display = 'flex';
});

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const username = formData.get('username');
  const password = formData.get('password');
  const isManager = formData.get('is-manager') === 'on';

  bulkcreate(db.users, {
    username: username,
    password: password,
    isManager: isManager
  });

  registerPopup.style.display = 'none';
  registerForm.reset();

  // Display success message
  const insertMsg = document.querySelector('.insertmsg');
  insertMsg.classList.add('movedown');
  insertMsg.style.display = 'block';
  setTimeout(() => {
    insertMsg.classList.remove('movedown');
    insertMsg.style.display = 'none';
  }, 3000);
});


// event listener for create button
btncreate.onclick = event => {
  let flag = bulkcreate(db.products, {
    name: proname.value,
    description: description.value,
    price: price.value
  });
  proname.value = description.value = price.value = "";

  getData(db.products, data => {
    userid.value = data.id + 1 || 1;
  });
  table();

  let insertmsg = document.querySelector(".insertmsg");
  getMsg(flag, insertmsg);
};

btnread.onclick = table;

btnupdate.onclick = () => {
  const id = parseInt(userid.value || 0);
  if (id) {
    db.products.update(id, {
      name: proname.value,
      description: description.value,
      price: price.value
    }).then((updated) => {
      let get = updated ? true : false;


      let updatemsg = document.querySelector(".updatemsg");
      getMsg(get, updatemsg);

      proname.value = description.value = price.value = "";

    })
  } else {
    console.log(`Please Select id: ${id}`);
  }
}

btndelete.onclick = () => {
  db.delete();
  db = prodb("Productdb", {
    products: `++id, name, description, price`,
    users: `++id, username, password`
  });
  db.open();
  table();
  textID(userid);
  let deletemsg = document.querySelector(".deletemsg");
  getMsg(true, deletemsg);
}

window.onload = event => {
  textID(userid);
};

function table() {
  const tbody = document.getElementById("tbody");
  const notfound = document.getElementById("notfound");
  notfound.textContent = "";
  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }

  getData(db.products, (data, index) => {
    if (data) {
      createEle("tr", tbody, tr => {
        for (const value in data) {
          createEle("td", tr, td => {
            td.textContent = data.price === data[value] ? `$ ${data[value]}` : data[value];
          });
        }
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-edit btnedit";
            i.setAttribute(`data-id`, data.id);
            i.onclick = editbtn;
          });
        })
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-trash-alt btndelete";
            i.setAttribute(`data-id`, data.id);
            i.onclick = deletebtn;
          });
        })
      });
    } else {
      notfound.textContent = "No record found in the database...!";
    }

  });
}

const editbtn = (event) => {
  let id = parseInt(event.target.dataset.id);
  db.products.get(id, function (data) {
    let newdata = SortObj(data);
    userid.value = newdata.id || 0;
    proname.value = newdata.name || "";
    description.value = newdata.description || "";
    price.value = newdata.price || "";
  });
}

// delete icon remove element 
const deletebtn = event => {
  let id = parseInt(event.target.dataset.id);
  db.products.delete(id);
  table();
}

// textbox id
function textID(textboxid) {
  getData(db.products, data => {
    textboxid.value = data.id + 1 || 1;
  });
}

// function msg
function getMsg(flag, element) {
  if (flag) {
    // call msg 
    element.className += " movedown";

    setTimeout(() => {
      element.classList.forEach(classname => {
        classname == "movedown" ? undefined : element.classList.remove('movedown');
      })
    }, 4000);
  }
}