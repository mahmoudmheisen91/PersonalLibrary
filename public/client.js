$(document).ready(function () {
  $("#testForm1a").submit(function () {
    var id = $(".id").val();
    $(this).attr("action", "/api/books/" + id);
  });

  $("#testForm2a").submit(function () {
    var id2 = $(".id2aa").val();
    $(this).attr("action", "/api/books/" + id2);
  });

  $("#testForm3a").submit(function (e) {
    let url = "/api/books/" + $(".book_id").val();
    console.log(url);
    $.ajax({
      url: url,
      type: "delete",
      data: $("#testForm3a").serialize(),
      success: function (data) {
        $(".del_l_2").text(JSON.stringify("delete successful"));
      },
    });
    e.preventDefault();
  });

  $(".del").click(function () {
    $.ajax({
      url: "/api/books",
      type: "delete",
      dataType: "json",
      data: $("#newBookForm").serialize(),
      success: function (data) {
        //update list
      },
    });
  });
});
