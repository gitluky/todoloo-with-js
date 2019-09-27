$('.groups.show').ready(function() {
 getGroupData();
});

function getGroupData() {
  $('#admins').empty();
  $('#members').empty();
  $('#announcements').empty();
  const groupId = $('#group_show').attr('data-groupid');
  const getData = $.get('/groups/' + groupId + '/group_data');
   getData.done((resp) => {
    createMemberList(resp);
    displayGrowShowAnnouncements(resp);
    createTaskLists(resp);
  });
}

function isAdmin(resp) {
  return resp['data']['attributes']['current-member']['admin'] === true ? true : false
}

function isEditor(resp, editor_id) {
  return resp['data']['attributes']['current-member']['user-id'] === editor_id ? true : false
}

function createMemberList(resp) {
  const User = createUser();
  const members = resp['data']['attributes']['members'].map(member => {
    return new User(member);
  });
  members.forEach((member) => {
    member.displayUserInfo();
  });
  if (isAdmin(resp)) {
    displayAdminLinksForAdminList();
    displayAdminLinksForMemberList();
  }
}

function displayGrowShowAnnouncements(resp) {
  const Announcement = createAnnouncement();
  const announcements = resp['data']['attributes']['announcements-in-order'].map(announcement => {
    return new Announcement(announcement);
  });
  announcements.forEach((announcement) => {
    announcement.displayGroupAnnouncement();
  });

}

function displayAdminLinksForAdminList() {
  const admins = $('.members[data-admin="true"]');
  for( i = 0; i < admins.length; i++) {
    const groupId = $(admins[i]).attr('data-groupId');
    const userId = $(admins[i]).attr('data-userId')
    let adminLinksHtml = `
    <small><a class="mr-2 kick-member" data-groupId="${groupId}" data-userId="${userId}" href="#">Kick Member</a>
    <a class="remove-admin" data-groupId="${groupId}" data-userId="${userId}" href="#">Remove Admin</a></small>`;
    $(admins[i]).append(adminLinksHtml);
    kickMemberLink(groupId, userId);
    removeAdminLink(groupId, userId);
  }
}

function displayAdminLinksForMemberList() {
  const members = $('.members[data-admin="false"]');
  for( i = 0; i < members.length; i++) {
    const groupId = $(members[i]).attr('data-groupId');
    const userId = $(members[i]).attr('data-userId')
    let memberLinksHtml = `
    <small><a class="mr-2 kick-member" data-groupId="${groupId}" data-userId="${userId}" href="#">Kick Member</a>
    <a class="make-admin" data-groupId="${groupId}" data-userId="${userId}" href="#">Make Admin</a></small>`;
    $(members[i]).append(memberLinksHtml);
    kickMemberLink(groupId, userId);
    makeAdminLink(groupId, userId);
  }
}

function kickMemberLink(groupId, userId) {
  $('.kick-member[data-userId="' + userId + '"]').click(e => {
    e.preventDefault();
    const kicking = $.get('/groups/' + groupId + '/users/' + userId + '/kick');
    kicking.done(function(){
      getGroupData();
    });
  });
}

function makeAdminLink(groupId, userId) {
  $('.make-admin[data-userId="' + userId + '"]').click(e => {
    e.preventDefault();
    const makeAdmin = $.get('/groups/' + groupId + '/users/' + userId + '/create_admin');
    makeAdmin.done(() => {
      getGroupData();
    });
  });
}

function removeAdminLink(groupId, userId) {
  $('.remove-admin[data-userId="' + userId + '"]').click(e => {
    e.preventDefault();
    const removeAdmin = $.get('/groups/' + groupId + '/users/' + userId + '/delete_admin');
    removeAdmin.done(function(){
      getGroupData();
    });
  });
}

function createTaskLists(resp) {
  const Task = createTask();
  const availableTasks = resp['data']['attributes']['formatted-available-tasks'].map((x) => new Task(x));
  const assignedTasks = resp['data']['attributes']['formatted-assigned-tasks'].map((x) => new Task(x));
  const completedTasks = resp['data']['attributes']['formatted-recent-completed-tasks'].map((x) => new Task(x));
  $('#available-tasks').text('Available (' + availableTasks.length + ')')
  $('#assigned-tasks').text('Assigned (' + assignedTasks.length + ')')
  $('#completed-tasks').text('Completed (' + completedTasks.length + ')')
  availableTasks.forEach((task) => {
    let availableTaskCard
    let editLinks
    availableTaskCard = task.createGroupTaskCards();
    $('#available-tasks').append(availableTaskCard);
    editLinks = task.taskCardAdminLinks();
    $('.task-links[data-taskId="' + task.id + '"]').append(editLinks);
    task.attachTaskEditListeners(function() {
      task.attachTaskEditFormListeners(getGroupData);
    });
  });
  assignedTasks.forEach((task) => {
    let assignedTaskCard
    let editLinks
    assignedTaskCard = task.createGroupTaskCards();
    $('#assigned-tasks').append(assignedTaskCard);
    editLinks = task.taskCardAdminLinks();
    $('.task-links[data-taskId="' + task.id + '"]').append(editLinks);
    task.attachTaskEditListeners(function() {
      task.attachTaskEditFormListeners(getGroupData);
    });
  });
  completedTasks.forEach((task) => {
    let completedTaskCard
    let editLinks
    completedTaskCard = task.createGroupTaskCards();
    $('#completed-tasks').append(completedTaskCard);
    editLinks = task.taskCardAdminLinks();
    $('.task-links[data-taskId="' + task.id + '"]').append(editLinks);
    task.attachTaskEditListeners(function() {
      task.attachTaskEditFormListeners(getGroupData);
    });
  });

}
