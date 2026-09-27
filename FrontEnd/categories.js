window.onload = function () {
  showUserNav(); // Hiện nút đăng nhập / tên người dùng

  // Lấy danh mục từ địa chỉ trang, ví dụ: categories.html?category=technology
  var urlParam = new URLSearchParams(window.location.search);
  var category = urlParam.get("category");

  // Không có danh mục thì quay về trang chủ
  if (category == null) {
    window.location.href = "./index.html";
    return;
  }

  document.getElementById("category-header").innerText = getCategoryName(category).toUpperCase();

  loadPostsByCategory(category);
};

// ====== LẤY BÀI VIẾT THEO DANH MỤC ======
function loadPostsByCategory(category) {
  db.collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then(function (querySnapshot) {
      var newsHtml = "";

      querySnapshot.forEach(function (doc) {
        var post = doc.data();
        post.id = doc.id;

        // Chỉ lấy bài đã đăng và đúng danh mục
        if (post.status === "published" && post.category === category) {
          newsHtml += createPostCard(post);
        }
      });

      if (newsHtml === "") {
        newsHtml = "<p>Danh mục này chưa có bài viết nào.</p>";
      }

      document.getElementById("top-news").innerHTML = newsHtml;
    })
    .catch(function (error) {
      console.error("Lỗi tải bài viết:", error);
      document.getElementById("top-news").innerHTML = "<p>Không tải được bài viết.</p>";
    });
}
