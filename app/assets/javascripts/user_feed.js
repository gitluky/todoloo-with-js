$(document).ready(function() {
  display_group_form();

})


function display_group_form() {
  $('#create_group_btn').click(function(event) {
    event.preventDefault();
    let form = $.get('/groups/new')
    form.done(function(data) {
      $('#create_group_form').append(data)
    })
  });
}

function submit_group_form() {
  $('#create_group_form').submit(function(event) {
    const values = $(this).serialize();
    console.log(values)
    const creating_group = $.post('/groups', values);
    creating_group.done(function(data) {
      console.log(data)
    })
  });

}
