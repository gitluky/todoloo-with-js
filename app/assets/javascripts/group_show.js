$('.groups.show').ready(function() {
 getGroupData();
});

let admin = false

function getGroupData() {
  const groupId = $('#group_show').attr('data-groupid');
  $.get('/groups/' + groupId + '/group_data', function(resp) {
    if (resp['data']['attributes']['current-member']['admin'] === true) {
      admin = true;
    } else {
      admin = false;
    }
    displayGroupMembers(resp);
  });
}


function displayGroupMembers(resp) {


}
