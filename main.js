var SpacebookApp = function () {
  var storage = {
    posts: [
      //   {
      //     text: "Hello world",
      //     id: 0,
      //     comments: [
      //        { text: "Man1, this is a comment!"},
      //        { text: "Man2, this is a comment!"},
      //        { text: "Man3, this is a comment!"}
      //     ]
      //  }
    ],
    setter: function () {
      localStorage.setItem('posts', JSON.stringify(this.posts));
    },
    getter: function () {
      return this.posts = JSON.parse(localStorage.getItem('posts')) || [];
    }

  };

  var $posts = $('.posts');

  var createPost = function (text) {
    storage.posts = storage.getter();
    var post = {
      text: text,
      id: storage.posts.length,
      comments: []
    };

    storage.posts.push(post);
    storage.setter();
  };

  var renderPosts = function () {
    $posts.empty();
    var posts = storage.getter();

    for (var i = 0; i < posts.length; i += 1) {
      var post = posts[i];

      var commentsContainer = '<div class="comments-container">' + '<div class="comments-list"></div>' +
          '<input type="text" class="comment-name">' +
          '<span class="btn btn-default add-comment"><i class="fa fa-plus"></i></button> </div>';

      $posts.append('<div class="post">'
          + '<a href="#" class="remove"><i class="fa fa-times"></i></a> ' + '<a href="#" class="show-comments"><i class="fa fa-comments"></i></a> ' + post.text +
          commentsContainer + '</div>');
    }

    renderComments();
  };

  var removePost = function (currentPost) {
    var $clickedPost = $(currentPost).closest('.post');
    var index = $clickedPost.index();
    var posts = storage.getter();
    posts.splice(index, 1);
    storage.setter();
    $clickedPost.remove();
  };

  var createComment = function (text, idx) {
    var comment = {
      text: text
    };

    storage.posts = storage.getter();
    storage.posts[idx].comments.push(comment);
    storage.setter();
  };


  var renderComments = function () {
    // removing elements and start rendering anew each element again
    $('.comments-list').empty();
    var posts = storage.getter();
    $(posts).map(function (idx) {
      $(this.comments).map(function () {
        $('.comments-list').eq(idx).append('<p>' + this.text + '<button class="btn btn-danger remove-comment"><i class="fa fa-times"></i></a></button></p>');
      });
    });
  };

  var removeComment  = function (currentPost) {
    var index = $(currentPost).closest('.post').index();
    var comment_idx = $(currentPost).parent().index();
    var posts = storage.getter();
    posts[index].comments.splice(comment_idx, 1);
    storage.setter();
    $(currentPost).parent().remove();
  };

  var toggleComments = function (currentPost) {
    var $clickedPost = $(currentPost).closest('.post');
    $clickedPost.find('.comments-container').toggleClass('show');
  };

  return {
    createPost: createPost,
    renderPosts: renderPosts,
    removePost: removePost,
    createComment: createComment,
    renderComments: renderComments,
    removeComment: removeComment,
    toggleComments: toggleComments
  }
};

var app = SpacebookApp();

// immediately invoke the render method
app.renderPosts();
// app.renderComments();

// Events
$('.add-post').on('click', function (e) {
  e.preventDefault();

  var text = $('#post-name').val();
  app.createPost(text);
  app.renderPosts();
  $('#post-name').val('').focus();
});

$('.posts').on('click', '.remove', function (e) {
  e.preventDefault();
  app.removePost(this);
});

$('.posts').on('click', '.add-comment', function (e) {
  e.preventDefault();
  var idx = $(this).closest('.post').index();
  var text = $('.comment-name').eq(idx).val();

  app.createComment(text, idx);
  app.renderComments();
});

$('.posts').on('click', '.remove', function (e) {
  e.preventDefault();
  app.removePost(this);
});

$('.posts').on( 'click', '.remove-comment', function (e) {
  e.preventDefault();
  app.removeComment(this);
});

$('.posts').on('click', '.show-comments', function (e) {
  e.preventDefault();
  app.toggleComments(this);

});