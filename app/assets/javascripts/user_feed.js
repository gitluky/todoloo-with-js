$(document).ready(function() {
  display_group_form();

})


function display_group_form() {
  $('#create_group_btn').click(function(event) {
    event.preventDefault();
    let form = $.get('/groups/new')
    form.done(function(data) {
      $('#create_group_form').html(data)
      attachFormListeners();
    });
  });
}

function attachFormListeners() {
  cancelGroupFormListener();
  submitGroupFormListener();
}

function cancelGroupFormListener() {
  $('#cancel_group_form').click(function(event) {
    event.preventDefault();
    $('#create_group_form').empty();
    window.scrollTo(0,0)
  });
}

function submitGroupFormListener() {
  $('form').submit(function(event) {
    event.preventDefault();
    const values = $(this).serialize();
    debugger;
    console.log(values)
    const creating_group = $.post('/groups', values);
    creating_group.done(function(data) {
      console.log(data)
    })
  });

}
