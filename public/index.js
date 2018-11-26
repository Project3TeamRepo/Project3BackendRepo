function getNewScrapes(){
  $("#newScrapes").html("<div style=\'border-bottom: 1px solid #666;\'>" + 
  "<center><br><br>" + 
  "<h3>Hang on, this will take a few seconds...</h3>" + 
  "</div>");

  $.ajax({
    method: "GET",
    url: "/scrape"
  })
  
  .then(function(scrapeResult){
    populateNewScrapes();
  });
}

function populateNewScrapes() {

    $.getJSON("/articles", function(data){ console.log("data object:"); console.log(data);
      if(data){
        for (var i = 0; i < data.length; i++) { console.log("i=" + i); console.log(data);
          var appendThis =
          "<div class=articleHdr>" +
            data[i].title +
            "<button class='saveArticle' data-key=" + data[i]._id + "> Save Article </button>" +
          "</div>" +
          "<div class=articleBody>" +
            "<div class=articleSummary>" + data[i].summary  +
            "<a href=https://www.nytimes.com" + data[i].link + ">See full article</a>" +
            "</div>" +
          "</div>";

          $("#newScrapes").append(appendThis);
        }//end for loop
      }//end if data
      else {$("#newScrapes").html("");}
    });//end getJSON articles

}//end function populateNewScrapes

$(document).ready(function(){
  populateNewScrapes();
  
  $(document).on("click", '#btnScrape', function () {
      event.preventDefault();
      getNewScrapes();
  });//end document.onclick.btnScrape

  $(document).on("click", ".saveArticle", function () {
    event.preventDefault(); 
    var thisId = event.target.attributes[1].value;
  
    $.ajax({
      method: "PUT",
      url: "/articles/" + thisId,
      data: {
        saved: true
      }
    })
    .then(function (result) {
      location.reload();
    });
  });//end document.onclick.saveArticle

});//end document.ready