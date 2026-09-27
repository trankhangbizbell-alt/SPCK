var currentUser = null; // Người dùng đang đăng nhập
var editingId = null; // Id bài viết đang sửa (null = đang đăng bài mới)
var allPosts = []; // Danh sách bài viết lấy từ Firestore

// ====== KIỂM TRA ĐĂNG NHẬP VÀ QUYỀN ADMIN ======
auth.onAuthStateChanged(function (user) {
  // Chưa đăng nhập thì quay về trang đăng nhập
  if (!user) {
    alert("Bạn phải đăng nhập để vào trang quản trị!");
    window.location.href = "./signin.html";
    return;
  }

  // Đã đăng nhập nhưng không phải admin thì quay về trang chủ
  if (!isAdmin(user)) {
    alert("Chỉ tài khoản quản trị (" + ADMIN_EMAIL + ") mới được vào trang này!");
    window.location.href = "./index.html";
    return;
  }

  currentUser = user;
  document.getElementById("current-user").innerText =
    "Xin chào " + (user.displayName || user.email);

  loadPosts();
});

// ====== LẤY DANH SÁCH BÀI VIẾT ======
function loadPosts() {
  db.collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then(function (querySnapshot) {
      allPosts = [];

      querySnapshot.forEach(function (doc) {
        var post = doc.data();
        post.id = doc.id;
        allPosts.push(post);
      });

      showPosts();
      showStatistic();
    })
    .catch(function (error) {
      console.error("Lỗi tải bài viết:", error);
      document.getElementById("articles").innerHTML =
        "<tr><td colspan='6'>Không tải được dữ liệu.</td></tr>";
    });
}

// ====== HIỂN THỊ BÀI VIẾT RA BẢNG ======
function showPosts() {
  var html = "";

  for (var i = 0; i < allPosts.length; i++) {
    var post = allPosts[i];
    var statusClass = post.status === "published" ? "published" : "draft";
    var statusText = post.status === "published" ? "Đã đăng" : "Bản nháp";

    html += `
      <tr>
        <td>${post.title}</td>
        <td>${getCategoryName(post.category)}</td>
        <td>${post.author}</td>
        <td>${formatDate(post.createdAt)}</td>
        <td class="${statusClass}">${statusText}</td>
        <td>
          <button class="btn-small" onclick="editPost('${post.id}')">Sửa</button>
          <button class="btn-small btn-red" onclick="deletePost('${post.id}')">Xóa</button>
        </td>
      </tr>
    `;
  }

  if (html === "") {
    html = "<tr><td colspan='6'>Chưa có bài viết nào.</td></tr>";
  }

  document.getElementById("articles").innerHTML = html;
}

// ====== THỐNG KÊ ======
function showStatistic() {
  var viewCount = 0;
  var publishedCount = 0;
  var draftCount = 0;

  for (var i = 0; i < allPosts.length; i++) {
    viewCount += allPosts[i].views || 0;
    if (allPosts[i].status === "published") publishedCount++;
    else draftCount++;
  }

  document.getElementById("total-posts").innerText = allPosts.length;
  document.getElementById("total-views").innerText = viewCount;
  document.getElementById("published-posts").innerText = publishedCount;
  document.getElementById("draft-posts").innerText = draftCount;
}

// ====== XEM TRƯỚC ẢNH KHI CHỌN FILE ======
document.getElementById("file-image").addEventListener("change", function () {
  var file = this.files[0];
  var preview = document.getElementById("img-preview");

  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  }
});

// ====== UPLOAD ẢNH LÊN SERVER (BackEnd -> Cloudinary) ======
async function uploadImage(file) {
  var formData = new FormData();
  formData.append("image", file);

  var res = await fetch(API_URL + "/upload", {
    method: "POST",
    body: formData,
  });

  var data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Upload ảnh thất bại");
  }

  return data.url; // Đường dẫn ảnh trên Cloudinary
}

// ====== ĐĂNG BÀI / CẬP NHẬT BÀI ======
document.getElementById("btn-save").addEventListener("click", async function () {
  var title = document.getElementById("txt-title").value.trim();
  var category = document.getElementById("sl-category").value;
  var description = document.getElementById("txt-description").value.trim();
  var content = document.getElementById("txt-content").value.trim();
  var status = document.getElementById("sl-status").value;
  var file = document.getElementById("file-image").files[0];

  if (title === "" || content === "") {
    alert("Vui lòng nhập tiêu đề và nội dung bài viết!");
    return;
  }

  if (editingId === null && !file) {
    alert("Vui lòng chọn ảnh cho bài viết!");
    return;
  }

  var btnSave = this;
  btnSave.disabled = true;
  btnSave.innerText = "Đang xử lý...";

  try {
    // Nếu có chọn ảnh mới thì upload lên server, không thì giữ ảnh cũ
    var imageUrl = "";
    if (file) {
      imageUrl = await uploadImage(file);
    }

    if (editingId === null) {
      // Thêm bài viết mới
      await db.collection("posts").add({
        title: title,
        category: category,
        description: description,
        content: content,
        imageUrl: imageUrl,
        status: status,
        author: currentUser.displayName || currentUser.email,
        authorId: currentUser.uid,
        views: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      alert("Đăng bài thành công!");
    } else {
      // Cập nhật bài viết đang sửa
      var newData = {
        title: title,
        category: category,
        description: description,
        content: content,
        status: status,
      };

      if (imageUrl !== "") {
        newData.imageUrl = imageUrl;
      }

      await db.collection("posts").doc(editingId).update(newData);
      alert("Cập nhật bài viết thành công!");
    }

    resetForm();
    loadPosts();
  } catch (error) {
    console.error("Lỗi lưu bài viết:", error);
    alert("Lưu bài viết thất bại: " + error.message);
  }

  btnSave.disabled = false;
  btnSave.innerText = editingId === null ? "Đăng bài" : "Cập nhật";
});

// ====== SỬA BÀI VIẾT ======
function editPost(id) {
  var post = findPost(id);
  if (!post) return;

  editingId = id;

  document.getElementById("txt-title").value = post.title;
  document.getElementById("sl-category").value = post.category;
  document.getElementById("txt-description").value = post.description;
  document.getElementById("txt-content").value = post.content;
  document.getElementById("sl-status").value = post.status;
  document.getElementById("file-image").value = "";

  var preview = document.getElementById("img-preview");
  preview.src = post.imageUrl;
  preview.style.display = "block";

  document.getElementById("form-title").innerText = "Sửa bài viết";
  document.getElementById("btn-save").innerText = "Cập nhật";
  document.getElementById("btn-cancel").style.display = "inline-block";

  window.scrollTo(0, 0);
}

// ====== XÓA BÀI VIẾT ======
function deletePost(id) {
  var post = findPost(id);
  if (!post) return;

  if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;

  db.collection("posts")
    .doc(id)
    .delete()
    .then(function () {
      alert("Đã xóa bài viết.");
      loadPosts();
    })
    .catch(function (error) {
      console.error("Lỗi xóa bài viết:", error);
      alert("Xóa bài viết thất bại.");
    });
}

// Tìm 1 bài viết trong danh sách theo id
function findPost(id) {
  for (var i = 0; i < allPosts.length; i++) {
    if (allPosts[i].id === id) return allPosts[i];
  }
  return null;
}

// ====== HỦY SỬA / XÓA TRẮNG FORM ======
document.getElementById("btn-cancel").addEventListener("click", function () {
  resetForm();
});

function resetForm() {
  editingId = null;

  document.getElementById("txt-title").value = "";
  document.getElementById("sl-category").value = "business";
  document.getElementById("txt-description").value = "";
  document.getElementById("txt-content").value = "";
  document.getElementById("sl-status").value = "published";
  document.getElementById("file-image").value = "";

  var preview = document.getElementById("img-preview");
  preview.src = "";
  preview.style.display = "none";

  document.getElementById("form-title").innerText = "Đăng bài viết mới";
  document.getElementById("btn-save").innerText = "Đăng bài";
  document.getElementById("btn-cancel").style.display = "none";
}

// ====== TÌM KIẾM BÀI VIẾT TRONG BẢNG ======
document.getElementById("search").addEventListener("keyup", function () {
  var keyword = this.value.toLowerCase();
  var rows = document.getElementById("articles").querySelectorAll("tr");

  rows.forEach(function (row) {
    var text = row.innerText.toLowerCase();
    row.style.display = text.includes(keyword) ? "" : "none";
  });
});
