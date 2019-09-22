$('.groups.show').ready(function() {
 getGroupData();
});

let admin = false
let groupId

function getGroupData() {
  groupId = $('#group_show').attr('data-groupid');
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
  const User = createUser();
  const members = resp['data']['attributes']['members'].map(function(member) {
    return new User(member);
  });
  members.forEach(function(member) {
    member.displayUserInfo();
  });
  if (admin === true) {
    displayAdminMemberListLinks();
  }
}

function displayAdminMemberListLinks() {
  const admins = $('.members[data-admin="true"]');
  for( i = 0; i < admins.length; i++) {
    const userId = $(admins[i]).attr('data-userId')
    let adminLinksHtml = `
    <small><a class="mr-2" rel="nofollow" data-method="post" href="/groups/${groupId}/users/${userId}/kick">Kick Member</a>
    <a rel="nofollow" data-method="post" href="/groups/${groupId}/users/${userId}/delete_admin">Remove Admin</a></small>`;
    $(admins[i]).append(adminLinksHtml);
  }
  const members = $('.members[data-admin="false"]');
  for( i = 0; i < members.length; i++) {
    const userId = $(members[i]).attr('data-userId')
    let memberLinksHtml = `
    <small><a class="mr-2" rel="nofollow" data-method="post" href="/groups/${groupId}/users/${userId}/kick">Kick Member</a>
    <a rel="nofollow" data-method="post" href="/groups/${groupId}/users/${userId}/create_admin">Make Admin</a></small>`;
    $(members[i]).append(memberLinksHtml);
  }

}
