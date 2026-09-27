const btnLogin = document.getElementById("btn-login");

btnLogin.addEventListener("click", function (e) {
  e.preventDefault(); // Ngăn form submit lại trang

  const email = document.getElementById("txt-email").value.trim();
  const password = document.getElementById("txt-password").value.trim();
  const remember = document.getElementById("chk-remember").checked;

  if (email === "" || password === "") {
    alert("Vui lòng nhập đầy đủ email và mật khẩu!");
    return;
  }

  // Ghi nhớ đăng nhập: LOCAL giữ lại sau khi đóng trình duyệt, SESSION thì không
  const persistence = remember
    ? firebase.auth.Auth.Persistence.LOCAL
    : firebase.auth.Auth.Persistence.SESSION;

  auth
    .setPersistence(persistence)
    .then(function () {
      return auth.signInWithEmailAndPassword(email, password);
    })
    .then(function () {
      alert("Đăng nhập thành công!");
      window.location.href = "./index.html";
    })
    .catch(function (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Đăng nhập thất bại: sai email hoặc mật khẩu.");
    });
});
