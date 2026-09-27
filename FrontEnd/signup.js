const btnRegister = document.getElementById("btn-register");

btnRegister.addEventListener("click", function (e) {
  e.preventDefault(); // Ngăn form submit lại trang

  // Lấy dữ liệu từ form
  const name = document.getElementById("txt-name").value.trim();
  const email = document.getElementById("txt-email").value.trim();
  const password = document.getElementById("txt-password").value.trim();
  const confirmPassword = document.getElementById("txt-confirm-password").value.trim();

  // Kiểm tra dữ liệu
  if (name === "" || email === "" || password === "") {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (password.length < 6) {
    alert("Mật khẩu phải có ít nhất 6 ký tự!");
    return;
  }

  if (password !== confirmPassword) {
    alert("Mật khẩu nhập lại không khớp!");
    return;
  }

  // Tạo tài khoản trên Firebase
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      // Lưu tên hiển thị để dùng làm tên tác giả khi đăng bài
      return userCredential.user.updateProfile({ displayName: name });
    })
    .then(function () {
      alert("Đăng ký thành công! Chào mừng " + name);
      window.location.href = "./index.html";
    })
    .catch(function (error) {
      console.error("Lỗi đăng ký:", error);

      if (error.code === "auth/email-already-in-use") {
        alert("Email này đã được sử dụng. Vui lòng dùng email khác.");
      } else if (error.code === "auth/invalid-email") {
        alert("Email không hợp lệ.");
      } else {
        alert("Đăng ký thất bại. Vui lòng thử lại.");
      }
    });
});
