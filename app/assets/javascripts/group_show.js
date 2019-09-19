$('.groups.show').ready(function() {
 getGroupData();
});

function getGroupData() {
  const groupId = $('#group_show').attr('data-groupid');
  $.get('/groups/' + groupId + '/group_data', function(resp) {
    console.log(resp)
  });
}
