window.onload = function () {
  showUserNav(); // Hiện nút đăng nhập / tên người dùng

  // Lấy id bài viết từ địa chỉ trang, ví dụ: detail.html?id=abc123
  var urlParam = new URLSearchParams(window.location.search);
  var id = urlParam.get("id");

  if (id == null) {
    window.location.href = "./index.html";
    return;
  }

  loadPost(id);
  loadOtherPosts(id);
};

// ====== LẤY 1 BÀI VIẾT THEO ID ======
function loadPost(id) {
  db.collection("posts")
    .doc(id)
    .get()
    .then(function (doc) {
      if (!doc.exists) {
        document.getElementById("post-detail").innerHTML = "<p>Không tìm thấy bài viết này.</p>";
        return;
      }

      var post = doc.data();

      document.title = post.title + " - Báo Mới";

      document.getElementById("post-detail").innerHTML = `
        <h1>${post.title}</h1>
        <p class="text-muted">
          <span class="badge bg-primary">${getCategoryName(post.category)}</span>
          Tác giả: ${post.author} - Ngày đăng: ${formatDate(post.createdAt)}
        </p>
        <img src="${post.imageUrl}" class="detail-img mb-3" alt="${post.title}" />
        <p class="fw-bold">${post.description || ""}</p>
        <div class="detail-content">${post.content}</div>
      `;

      // Tăng lượt xem cho bài viết
      db.collection("posts")
        .doc(id)
        .update({ views: firebase.firestore.FieldValue.increment(1) })
        .catch(function (error) {
          console.error("Không cập nhật được lượt xem:", error);
        });
    })
    .catch(function (error) {
      console.error("Lỗi tải bài viết:", error);
      document.getElementById("post-detail").innerHTML = "<p>Không tải được bài viết.</p>";
    });
}

// ====== LẤY 3 BÀI VIẾT KHÁC ======
function loadOtherPosts(currentId) {
  db.collection("posts")
    .orderBy("createdAt", "desc")
    .limit(6)
    .get()
    .then(function (querySnapshot) {
      var html = "";
      var count = 0;

      querySnapshot.forEach(function (doc) {
        var post = doc.data();
        post.id = doc.id;

        // Bỏ qua bài đang xem và bản nháp, chỉ lấy tối đa 3 bài
        if (post.id !== currentId && post.status === "published" && count < 3) {
          html += createPostCard(post);
          count++;
        }
      });

      document.getElementById("other-posts").innerHTML = html;
    });
}
