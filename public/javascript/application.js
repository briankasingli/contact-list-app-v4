$(document).ready(function() {

  $('.add-new').on('click', function(){
    if ($('.contact-info-details').is(':visible')){
      $('.contact-info-details').hide();
      $('.contact-add-container').show();
    }else{
      $('.contact-info-details').show();
      $('.contact-add-container').hide();
    };
  });

  function updateContactList(contact) {
    $('.list-of-contacts').append(
    "<li><a data-contact_id="+ '"' + contact.id + '">' +"<strong>" + contact.first_name + "</strong> " + contact.last_name + "</a></li>"
    )
  };

  function generateContactList(contact){
    $.ajax({
      url: "http://localhost:3000/contacts",
      method: "GET",
      beforeSend: function(){
      // Handle the beforeSend event
      $('.list-of-contacts, .contact-info-details').text("").append('<div style="margin-top:100px;" align="center"><img height="50" src="/images/default.gif" alt="ajax-preloader" /></div>');
      },
      success: function(data){
        $('.list-of-contacts').text("");
        contacts = data;
        data.forEach(updateContactList);
        if (typeof(contact) === "object"){
          setSelected(contact);
        }else{
        setSelected(data[0]);
        };
      }
    });
  };

  var setSelected = function(data){
    $(".contact-info-details").text("");
    $(".contact-info-details").append("<img style='margin-top:100px;' src='https://www.icloud.com/applications/contacts/15D96/en-us/source/resources/images/Empty_profile.png'><h1>" + data.first_name + " " + data.last_name +"</h1><span class=" + '"phone_number"' + ">"+data.phone_number+"</span><br/><span class=" + '"email"' + ">"+data.email+"</span><br/><a data-contact_id="+ '"' + data.id + '"' + "class=" + '"delete-user"' + "href=" + '"#"' + ">Delete User</a>");

    $('.delete-user').on("click", function(){
      $.ajax({
        url: "http://localhost:3000/contacts/" + $(this).data("contact_id"),
        method: "DELETE",
        beforeSend: function(){
        // Handle the beforeSend event
        $('.list-of-contacts, .contact-info-details').text("").append('<div style="margin-top:30px;" align="center"><img height="50" src="/images/default.gif" alt="ajax-preloader" /></div>');
        },
        success: function(){
          generateContactList();
        }
      });
    });
  }

  $('form .search').on("keyup", function(e){
    e.preventDefault();
    $('.list-of-contacts').text("");


    for (var key in contacts){
      if(contacts.hasOwnProperty(key)){
        var query = "";
        for (property in contacts[key]){
          query += contacts[key][property] + " ";
        };
        if (query.indexOf($(".search").val()) >= 0){
          //console.log(property + ": " + contacts[key][property]);
          updateContactList(contacts[key])
        }; 
      };
    };


    if($('.list-of-contacts > li').length == 0){
      $('.list-of-contacts').append('<li><a href="#">No Results Were Found</a></li>')
    }



  });

  $('form#add-contact').on("submit", function(e){
    e.preventDefault();   
    $.ajax({
      url: "http://localhost:3000/contacts",
      method: "POST",
      data: { 
        first_name: $(".firstname").val(),
        last_name: $(".lastname").val(),
        phone_number: $(".phonenumber").val(),
        email: $(".emailaddress").val()
      },
      beforeSend: function(){
        // Handle the beforeSend event
        $('.contact-add-container').hide();
        $('.contact-info-details').text("").show().append('<div style="margin-top:30px;" align="center"><img height="50" src="/images/default.gif" alt="ajax-preloader" /></div>');
      },
      success: function(data){
        generateContactList(data);
        // $(".contact-info-details").append("<img style='margin-top:30px;' src='https://www.icloud.com/applications/contacts/15D96/en-us/source/resources/images/Empty_profile.png'><h1>" + data.first_name + " " + data.last_name +"</h1><span class=" + '"phone_number"' + ">"+data.phone_number+"</span><br/><span class=" + '"email"' + ">"+data.email+"</span><br/><a data-contact_id="+ '"' + data.id + '"' + "class=" + '"delete-user"' + "href=" + '"#"' + ">Delete User</a>");
          },
      error: function(){
        $('.contact-add-container').show();
      }
    });
  });

  $('.list-of-contacts').on("click", "li", function(e){
    $(this).closest(".list-of-contacts").find("li").removeClass("active");
    $(this).addClass("active");
    $('.contact-add-container').hide();
    $('.contact-info-details').show();
  });


  $('.list-of-contacts').on("click", "a", function(e){
  e.preventDefault();  
    for (var key in contacts){
      if(contacts[key].id === $(this).data("contact_id")){
        setSelected(contacts[key])
      };
    };
  });

generateContactList();

});