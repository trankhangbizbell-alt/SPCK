// ====== CẤU HÌNH FIREBASE ======
// const firebaseConfig = {
//   apiKey: "AIzaSyBuzf07XzJeDPNQ3J3ujd6aDISsl8Ewp9o",
//   authDomain: "news-fbabd.firebaseapp.com",
//   projectId: "news-fbabd",
//   storageBucket: "news-fbabd.firebasestorage.app",
//   messagingSenderId: "629916229666",
//   appId: "1:629916229666:web:168bb21e4e5ec752c32a7b",
//   measurementId: "G-NW8N33K49Z",
// };

const firebaseConfig = {
  apiKey: "AIzaSyB07tYy7QK_iPX0U1yha_4cINi0HNq8wt0",
  authDomain: "jsi-cp2-365cf.firebaseapp.com",
  projectId: "jsi-cp2-365cf",
  storageBucket: "jsi-cp2-365cf.firebasestorage.app",
  messagingSenderId: "243430112289",
  appId: "1:243430112289:web:f9d12ac5b054f39afcb760",
  measurementId: "G-9D5TN7SZVZ"
};

// Khởi tạo Firebase (chỉ khởi tạo 1 lần)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

var db = firebase.firestore();
var auth = firebase.auth();

// Địa chỉ server upload ảnh (thư mục BackEnd)
var API_URL = "http://localhost:3000";

// Chỉ tài khoản này mới được vào trang quản trị
var ADMIN_EMAIL = "admin@news.com";

// Kiểm tra người dùng có phải admin không
function isAdmin(user) {
  return user != null && user.email === ADMIN_EMAIL;
}

// Danh sách danh mục dùng chung cho cả trang
var CATEGORIES = {
  business: "Kinh doanh",
  education: "Giáo dục",
  technology: "Công nghệ",
  entertainment: "Giải trí",
  other: "Khác",
};

// Đổi mã danh mục thành tên tiếng Việt
function getCategoryName(category) {
  return CATEGORIES[category] || "Khác";
}

// Đổi timestamp của Firestore thành chuỗi ngày giờ
function formatDate(timestamp) {
  if (!timestamp) return "";
  return timestamp.toDate().toLocaleString("vi-VN");
}

// Hiển thị nút đăng nhập / tên người dùng trên thanh menu
function showUserNav() {
  auth.onAuthStateChanged(function (user) {
    var box = document.getElementById("user-infor");
    if (!box) return;

    if (user) {
      // Chỉ admin mới thấy nút vào trang quản trị
      var adminButton = isAdmin(user)
        ? `<a class="btn btn-light me-2" href="./admin.html">Quản trị</a>`
        : "";

      box.innerHTML = `
        <span class="navbar-text text-white me-2">${user.displayName || user.email}</span>
        ${adminButton}
        <button class="btn btn-danger" id="btn-logout">Đăng xuất</button>
      `;
    } else {
      box.innerHTML = `
        <a class="btn btn-success me-2" href="./signin.html">Đăng nhập</a>
        <a class="btn btn-light" href="./signup.html">Đăng ký</a>
      `;
    }
  });
}

// Bắt sự kiện bấm nút đăng xuất ở mọi trang
document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "btn-logout") {
    auth.signOut().then(function () {
      alert("Bạn đã đăng xuất.");
      window.location.href = "./index.html";
    });
  }
});

// Tạo HTML cho 1 thẻ bài viết ở trang chủ / trang danh mục
function createPostCard(post) {
  return `
    <div class="col-lg-4 col-md-6 mb-4">
      <div class="card h-100">
        <img src="${post.imageUrl}" class="card-img-top post-img" alt="${post.title}" />
        <div class="card-body d-flex flex-column">
          <span class="badge bg-primary mb-2 align-self-start">${getCategoryName(post.category)}</span>
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text text-muted">${post.description || ""}</p>
          <p class="card-text">
            <small class="text-muted">${post.author} - ${formatDate(post.createdAt)}</small>
          </p>
          <a class="btn btn-primary mt-auto" href="./detail.html?id=${post.id}">Chi tiết</a>
        </div>
      </div>
    </div>
  `;
}
