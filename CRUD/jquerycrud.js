const BASE_URL = "https://jsonplaceholder.typicode.com/posts";
let state = [];

function render() {
  const todoList = $("#ToDoList");
  todoList.empty();
  state.forEach((post) => {
    todoList.append(
      `<div class="item mb-3" data-id="${post.id}">
        <h3 class="h5">${post.title}</h3>
        <div>${post.body ?? ""}</div>
        <div class="mt-2">
          <button class="btn btn-info btn-sm mr-2 btn-edit" data-id="${post.id}">Edit</button>
          <button class="btn btn-danger btn-sm mr-2 btn-del" data-id="${post.id}">Delete</button>
        </div>
      </div>
      <hr />`
    );
  });
}

function displayStories() {
  $.ajax({
    url: BASE_URL,
    method: "GET",
    dataType: "json",
    success: function (data) {
      state = data;
      render();
    },
    error: function (error) {
      console.error("Error fetching posts:", error);
    },
  });
}

function deleteTodo(e) {
  e.preventDefault();
  const id = $(this).attr("data-id");
  $.ajax({
    url: `${BASE_URL}/${id}`,
    method: "DELETE",
    success: function () {
      state = state.filter((p) => String(p.id) !== String(id));
      render();
    },
    error: function (error) {
      console.error("Error deleting post:", error);
    },
  });
}

function handleFormSubmission(event) {
  event.preventDefault();
  const id = $("#createBtn").attr("data-id");
  const title = $("#createTitle").val().trim();
  const body = $("#createContent").val().trim();
  if (!title) {
    alert("Please enter a title.");
    return;
  }
  const payload = { title, body };

  if (id) {
    $.ajax({
      url: `${BASE_URL}/${id}`,
      method: "PUT",
      data: payload,
      success: function (res) {
        const idx = state.findIndex((p) => String(p.id) === String(id));
        if (idx !== -1) state[idx] = { ...state[idx], ...payload };
        resetForm();
        render();
      },
      error: function (error) {
        console.error("Error updating post:", error);
      },
    });
  } else {
    $.ajax({
      url: BASE_URL,
      method: "POST",
      data: payload,
      success: function (res) {
        const newPost = { id: res.id || Date.now(), ...payload };
        state.unshift(newPost);
        resetForm();
        render();
      },
      error: function (error) {
        console.error("Error creating post:", error);
      },
    });
  }
}

function editBtnClicked(event) {
  event.preventDefault();
  const id = $(this).attr("data-id");
  const item = state.find((p) => String(p.id) === String(id));
  if (item) {
    $("#clearBtn").show();
    $("#createTitle").val(item.title || "");
    $("#createContent").val(item.body || "");
    $("#createBtn").text("Update").attr("data-id", item.id);
  } else {
    $.ajax({
      url: `${BASE_URL}/${id}`,
      method: "GET",
      success: function (data) {
        $("#clearBtn").show();
        $("#createTitle").val(data.title || "");
        $("#createContent").val(data.body || "");
        $("#createBtn").text("Update").attr("data-id", data.id);
      },
      error: function (error) {
        console.error("Error loading post:", error);
      },
    });
  }
}

function resetForm() {
  $("#clearBtn").hide();
  $("#createBtn").removeAttr("data-id").text("Create");
  $("#createTitle").val("");
  $("#createContent").val("");
}

$(document).ready(function () {
  displayStories();
  $(document).on("click", ".btn-del", deleteTodo);
  $(document).on("click", ".btn-edit", editBtnClicked);
  $("#createForm").on("submit", handleFormSubmission);
  $("#clearBtn").on("click", function (e) {
    e.preventDefault();
    resetForm();
  });
});
