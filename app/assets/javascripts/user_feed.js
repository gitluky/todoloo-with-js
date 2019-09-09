$(document).ready(function() {
  display_group_form();

})


function display_group_form() {
  $('#create_group_btn').click(function(event) {
    let form = $.get('/groups/new')
    form.done(function(data) {
      $('#create_group_form').append(data)
    })
  });
}
