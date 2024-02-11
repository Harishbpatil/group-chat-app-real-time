const form = document.querySelector(".signup-form");

form.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    const passwordInput = document.querySelector("#password");
    const confirmPasswordInput = document.querySelector("#confirm_password");

    if (!passwordInput || !confirmPasswordInput) {
      throw new Error("Password inputs not found");
    }

    if (
      passwordInput.value &&
      confirmPasswordInput.value &&
      passwordInput.value === confirmPasswordInput.value
    ) {
      const data = {
        name: form.querySelector("#name").value,
        email: form.querySelector("#email").value,
        phone: form.querySelector("#phone").value,
        password: passwordInput.value,
      };

      const res = await axios.post("http://localhost:4000/user/create", data);

      if (res.status === 200 && res.data.success) {
        alert("User signed up successfully");
        form.reset();
      }
    } else {
      alert("Passwords do not match or are empty");
    }
  } catch (e) {
    console.log(e);
    alert("An error occurred. Please try again.");
  }
});
