const formLogin = document.getElementById("formLogin");
const submitterLogin = document.querySelector("button[value=login]");
const formRegister = document.getElementById("formRegister");
const submitterRegister = document.querySelector("button[value=register]");

submitterLogin.addEventListener("click", sendConnection);
submitterRegister.addEventListener("click", sendRegistration);

async function sendRegistration(event) {
  // Password verification
  if (
    document.getElementById("registerRepeatPassword").value == "" ||
    document.getElementById("registerRepeatPassword").value !=
      document.getElementById("registerRepeatPassword").value
  ) {
    document.getElementById("registerPassword").classList.add("is-invalid");
    document
      .getElementById("registerRepeatPassword")
      .classList.add("is-invalid");
  } else {
    document.getElementById("registerPassword").classList.remove("is-invalid");
    document
      .getElementById("registerRepeatPassword")
      .classList.remove("is-invalid");
  }
  // Mail verification
  if (document.getElementById("registerEmail").value == "") {
    document.getElementById("registerEmail").classList.add("is-invalid");
  } else {
    document.getElementById("registerEmail").classList.remove("is-invalid");
  }
  // Username verification
  if (document.getElementById("registerUsername").value == "") {
    document.getElementById("registerUsername").classList.add("is-invalid");
  } else {
    document.getElementById("registerUsername").classList.remove("is-invalid");
  }
  if (formRegister.querySelectorAll(".is-invalid").length == 0) {
    let dataRegistration = {
      email: document.getElementById("registerEmail").value,
      username: document.getElementById("registerUsername").value,
      password: document.getElementById("registerPassword").value,
    };
    let data = await fetch("/register", {
      method: "POST",
      body: JSON.stringify(dataRegistration),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => {
      res.json();
    });
    // console.log(data);

    localStorage.setItem("token", data.jwt);
    location.href = "/";
  }

  //   console.log(dataRegistration);
}

async function sendConnection(event) {
  // Username verification
  if (document.getElementById("loginName").value == "") {
    document.getElementById("loginName").classList.add("is-invalid");
  } else {
    document.getElementById("loginName").classList.remove("is-invalid");
  }
  // Password verification
  if (document.getElementById("loginPassword").value == "") {
    document.getElementById("loginPassword").classList.add("is-invalid");
  } else {
    document.getElementById("loginPassword").classList.remove("is-invalid");
  }

  if (formLogin.querySelectorAll(".is-invalid").length == 0) {
    let dataRegistration = {
      identifier: document.getElementById("loginName").value,
      password: document.getElementById("loginPassword").value,
    };
    let data = await fetch("/login", {
      method: "POST",
      body: JSON.stringify(dataRegistration),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => {
      res.json();
    });
    console.log(data);

    localStorage.setItem("token", data.jwt);
    location.href = "/";
  }
}
