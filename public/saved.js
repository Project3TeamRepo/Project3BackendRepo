function populateSavedArticles(){
  $.getJSON("/savedarticles", function (data) {
    if (data) {
      // For each one
      for (var i = 0; i < data.length; i++) {
        if(data[i].note){
          var appendNote = "<a class=seenote href=# data-id=" + data[i].note + ">See Note</a>";
          var newLabel = "Change Note";
        }
        else {
          var appendNote = "<font style='color: blue;'>No existing notes</font>";
          var newLabel = "Add Note";
        }

        var appendThis =
        "<div class=articleHdr>" + 
            data[i].title + 
            "<button data-key=" + data[i]._id + " class='deleteBtn'>  Delete Article  </button>" + 
        "</div>" +
        "<div class=articleBody>" +
          
          "<div class=articleSummary>" + data[i].summary +
            "<a href=https://www.nytimes.com" + data[i].link + ">See full article</a>" + 
            "<div class=noteDisplay id=noteBox" + data[i]._id + ">" +
               appendNote + 
            "</div>" +
            "<div class=noteFormAddNew>" +
              "<div style='padding-left: 15px; width: 15%; float: left; font-size: 10px;'>" + 
                "<b>" + newLabel + "</b>" +
              "</div>" + 
              "<input id=titleinput" + data[i]._id + " name=title placeholder=Title></input>" +
              "<textarea id=bodyinput" + data[i]._id + " name=body placeholder=\'Your Note\'></textarea>" +
              "<button data-key=" + data[i]._id + " class='savenote'>Save Note</button>" +
            "</div>" + 
          "</div>" +

        "</div>";

        $("#savedArticles").append(appendThis);

      }//end for loop

    }//end if data
    
    else if (!data) {
      $("#savedArticles").append("No saved articles. There's nothing to show.");
    }

  });//end getJSON articles
}//end function populateArticles

$(document).ready(function(){

  populateSavedArticles();

  $(document).on("click", "#btnClear", function () { //delete all saved articles, return to saved.html
    event.preventDefault();

    $.ajax({
      method: "DELETE",
      url: "/articles"
    })
    .then(function (res) {
      location.reload();
    })
    .catch(function(err) {
      console.log("err"); console.log(err);
    });
  });//end document.onclick.btnClear

  $(document).on("click", ".seenote", function () { //find the note belonging to an article, show it on saved.html
    event.preventDefault();
    var thisId = $(this).attr("data-id");
    var url = "/notes/"+thisId;
    
    $.ajax({
      method: "GET",
      url: url
    })
    .then(function (data) {
      var caughtId = data.boxId;
      var caughtTitle = data.title;
      var caughtBody = data.body;

      var elementToPopulate = $("#noteBox" + caughtId);
      var showNote = "<div><b><u>" + caughtTitle + "</u></b>  " + caughtBody + "</div>";

      $(elementToPopulate).empty(); 
      $(elementToPopulate).html(showNote);
    })
    .catch(function (err) {
      console.log("returned with ERROR"); console.log(err);
    });
  });//end document.onclick.seenote

  $(document).on("click", ".savenote", function () { //save or change note for an article, return to save.html
    event.preventDefault();
    var articleKey = $(this).attr("data-key");
    var titleTitle = "#titleinput" + articleKey;
    var bodyBody = "#bodyinput" + articleKey;
    var thisTitle = $(titleTitle).val();
    var thisBody = $(bodyBody).val();

    $.ajax({
      method: "POST",
      url: "/notes/" + articleKey,
      data: {
        title: thisTitle,
        body: thisBody
      }
    })
    .then(function () {
      $(titleTitle).val("");
      $(bodyBody).val("");
      location.reload();
    });
  });//end document.onclick.savenote

  $(document).on("click", '.deleteBtn', function () { //delete one article, return to saved.html
    event.preventDefault();
    var thisId = event.target.attributes[0].value;

    $.ajax({
      method: "DELETE",
      url: "/articles/" + thisId
    })
    .then(function (data) {
        location.reload();
    })
    .catch(function (err) {
        console.log("ERROR"); console.log(err);
    });
  });//end document.onclick.deleteBtn

});//end document.ready