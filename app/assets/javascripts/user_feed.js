$(function () {
  display_group_form();

})


function display_group_form() {
  $('#create_group_btn').click(function(event) {
    console.log(event);
    debugger;
  //   $('#create_group_form').innerHTML("<%= render partial: 'group_form', locals: { group: @group, submit_button: 'Create Group' } %>")
});
}
