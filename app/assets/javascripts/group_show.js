$('.groups.show').ready(function() {
 getGroupData();
 attachSendInvitationListener();
 attachCreateTaskListener();
 attachPostAnnouncementListener();
});

function getGroupData() {
  $('#admins').empty();
  $('#members').empty();
  $('#announcements').empty();
  $('#available-tasks').empty();
  $('#assigned-tasks').empty();
  $('#completed-tasks').empty();
  $('#invitations').empty();
  const groupId = $('#group_show').attr('data-groupid');
  const getData = $.get('/groups/' + groupId + '/group_data');
   getData.done((resp) => {
    createMemberList(resp);
    displayInvitationsList(resp);
    displayAnnouncementList(resp);
    createTaskLists(resp);
  });
}

function isAdmin(resp) {
  return resp['data']['attributes']['current-member']['admin'] === true ? true : false
}

function hasEditPrivilege(resp, editor_id) {
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

function displayAnnouncementList(resp) {
  const Announcement = createAnnouncement();
  const announcements = resp['data']['attributes']['announcements-in-order'].map(announcement => {
    return new Announcement(announcement);
  });
  announcements.forEach((announcement) => {
    announcement.displayGroupAnnouncement();
  });
}


function displayInvitationsList(resp) {
  const Invitation = createInvitation();
  const invitations = resp['data']['attributes']['formatted-invitations'].map(invitation => {
    return new Invitation(invitation)
  });
  invitations.forEach((invitation) => {
    invitation.displayGroupInvitation();
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
  $('#available-tasks-title').text('Available (' + availableTasks.length + ')')
  $('#assigned-tasks-title').text('Assigned (' + assignedTasks.length + ')')
  $('#completed-tasks-title').text('Completed')
  $('#completed-tasks-title').append('<small><a href="#" class="ml-3" id="view-all-completed-tasks">View All</a></small>')
  attachViewAllCompletedTasksListener(resp);
  availableTasks.forEach((task) => {
    task.createGroupShowTaskCards('#available-tasks');
    if (isAdmin(resp) || hasEditPrivilege(resp, task['created-by-id'])) {
      let editLink = task.taskCardEditLink();
      $('.task-links[data-taskId="' + task.id + '"]').append(editLink);
      task.attachTaskEditListeners(() => {
        task.attachTaskEditFormListeners(getGroupData);
      });
    }
  });
  assignedTasks.forEach((task) => {
    task.createGroupShowTaskCards('#assigned-tasks');
    if (isAdmin(resp) || hasEditPrivilege(resp, task['created-by-id'])) {
      let editLink = task.taskCardEditLink();
      $('.task-links[data-taskId="' + task.id + '"]').append(editLink);
      task.attachTaskEditListeners(() => {
        task.attachTaskEditFormListeners(getGroupData);
      });
    }
    if (hasEditPrivilege(resp, task['assigned-to-id'])) {
      let dropLink = task.taskCardDropLink();
      $('.task-links[data-taskId="' + task.id + '"]').append(dropLink);
    }

  });
  completedTasks.forEach((task) => {
    task.createGroupShowTaskCards('#completed-tasks');
    if (isAdmin(resp) || hasEditPrivilege(resp, task['created-by-id'])) {
      let editLink = task.taskCardEditLink();
      $('.task-links[data-taskId="' + task.id + '"]').append(editLink);
      let incompleteLink = task.taskCardIncompleteLink();
      $('.task-links[data-taskId="' + task.id + '"]').append(incompleteLink);
      task.attachTaskEditListeners(() => {
        task.attachTaskEditFormListeners(getGroupData);
      });
    }
  });
}

function attachSendInvitationListener() {
  const groupId = $('#group_show').attr('data-groupid');
  $('#send-invitation-button').click((e) => {
    e.preventDefault();
    const getInvitationForm = $.get('/groups/' + groupId + '/invitations/new');
    getInvitationForm.done((resp) => {
      $('.group-form-frame').empty();
      $('.group-form-frame').append(resp);
      attachInvitationFormListeners();
    });
  });
}

function attachInvitationFormListeners() {
  const groupId = $('#group_show').attr('data-groupId');
  $('#cancel_invitation').click(function(e){
    e.preventDefault();
    $('.group-form-frame').empty();
  });
  $('#new_invitation').submit((e) => {
    e.preventDefault();
    const values = $('#new_invitation').serialize();
    const sendInvitation = $.post('/groups/' + groupId + '/invitations', values );
    sendInvitation.done((resp) => {
      console.log(resp)
      displayErrorMessages(resp);
    })
  })
}

function attachCreateTaskListener() {
  const groupId = $('#group_show').attr('data-groupid');
  $('#create-task-button').click((e) => {
    e.preventDefault();
    const getTaskForm = $.get('/groups/' + groupId + '/tasks/new');
    getTaskForm.done((resp) => {
      $('.group-form-frame').empty();
      $('.group-form-frame').append('<h3>Create Task</h3>');
      $('.group-form-frame').append(resp);
      attachCreateTaskFormListeners();
    });
  });
}

function attachCreateTaskFormListeners() {
  const groupId = $('#group_show').attr('data-groupid');
  $('#cancel_task_form').click(function(e){
    e.preventDefault();
    $('.group-form-frame').empty();
  });
  $('#task-form').submit((e) => {
    e.preventDefault();
    const values = $('#task-form').serialize();
    const createTask = $.post('/groups/' + groupId + '/tasks/', values)
    createTask.done((resp) => {
      $('.group-form-frame').empty();
      getGroupData();
    });
  })
}



function attachPostAnnouncementListener() {
  const groupId = $('#group_show').attr('data-groupid');
  $('#post-announcement-button').click((e) => {
    e.preventDefault();
    const getAnnouncementForm = $.get('/groups/' + groupId + '/announcements/new');
    getAnnouncementForm.done((resp) => {
      $('.group-form-frame').empty();
      $('.group-form-frame').append(resp);
      attachPostAnnouncementFormListener(getGroupData)
      $('#cancel_announcement').click(function(e){
        e.preventDefault();
        $('.group-form-frame').empty();
      });
    });
  });
}

function attachPostAnnouncementFormListener(callback) {
  const groupId = $('#group_show').attr('data-groupid');
  $('#new_announcement').submit((e) => {
    e.preventDefault();
    const values = $('#new_announcement').serialize();
    const postAnnouncement = $.post('/groups/' + groupId + '/announcements/', values);
    postAnnouncement.done((resp) => {
      $('.group-form-frame').empty();
      callback();
    });
  })
}

function attachViewAllCompletedTasksListener(data) {

  const groupId = $('#group_show').attr('data-groupid');
  $('#view-all-completed-tasks').click((e) => {
    e.preventDefault();
    const getCompletedTasks = $.get('/groups/' + groupId + '/tasks/completed_tasks');
    getCompletedTasks.done((resp) => {
      $('#completed-tasks').empty();
      const Task = createTask();
      const completedTasks = resp['data'].map((x) => new Task(x.attributes));
      $('#completed-tasks-title').text('Completed (' + completedTasks.length + ')')
      completedTasks.forEach((task) => {
        task.createGroupShowTaskCards('#completed-tasks');
        if (isAdmin(data) || hasEditPrivilege(data, task['created-by-id'])) {
          let editLink = task.taskCardEditLink();
          $('.task-links[data-taskId="' + task.id + '"]').append(editLink);
          let incompleteLink = task.taskCardIncompleteLink();
          $('.task-links[data-taskId="' + task.id + '"]').append(incompleteLink);
          task.attachTaskEditListeners(() => {
            task.attachTaskEditFormListeners(getGroupData);
          });
        }
      });
    });
  });
}

function displayErrorMessages(resp) {
  $('.form-error-messages').empty();
  if (resp['data']['attributes']['full-error-messages'].length > 0) {
    resp['data']['attributes']['full-error-messages'].forEach((message) => {
      $('.form-error-messages').append(`<p class="py-0 my-0">${message}</p>`)
    })
  } else {
    getGroupData();
  }
}
