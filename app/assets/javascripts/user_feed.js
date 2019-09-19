$('.application.index').ready(function() {
  display_group_form();
  getUserFeed();
})

function getUserFeed() {
  const Group = createGroup();
  const Announcement = createAnnouncement();
  const Task = createTask();
  const Invitation = createInvitation();
  $('.feed-frame').empty();
  $('.invitations').empty();
  $.get('/user_feed', function(resp) {
    if (!resp['included']) {

      displayNoActivity();
    } else {
      const invitations = resp['included'].filter((x) => x.type === "invitations");
      const new_invitations = invitations.map(function(invitation) {
        return new Invitation(invitation);
      });
      new_invitations.forEach(function(invitation) {
        invitation.displayUserFeedInvitations();
      })

      const groups = resp['included'].filter((x) => x.type === "groups");
      const new_groups = groups.map(function(group) {
        return new Group(group);
      });
      new_groups.forEach(function(group) {
        group.displayGroupFeed();
        const new_announcements = group["attributes"]["recent-announcements"].map(function(recent_announcement){
          return new Announcement(recent_announcement);
        });
        new_announcements.forEach(function(announcement) {
          announcement.displayRecentGroupAnnouncements();
        });
        const assigned_tasks = group["attributes"]["tasks-assigned-to-current-user"].map(function(assigned_task){
          return new Task(assigned_task);
        });
        assigned_tasks.forEach(function(task) {
          task.displayUserFeedTasks();
        });
      });
    }
  });
}

function displayNoActivity() {
  let noActivityHtml = `<div class="row text-center mt-3 justify-content-center">
    <div class="col-lg-8 text-center">
      <h3>No recent activity.</h3>
    </div>
  </div>`
  $('.feed-frame').append(noActivityHtml);
}

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

function closeForm() {
  $('#create_group_form').empty();
  window.scrollTo(0,0)
}

function cancelGroupFormListener() {
  $('#cancel_group_form').click(function(event) {
    event.preventDefault();
    closeForm();
  });
}

function submitGroupFormListener() {
  $('form').submit(function(event) {
    event.preventDefault();
    const values = $(this).serialize();
    const creating_group = $.post('/groups', values);
    creating_group.done(function(data) {
      closeForm();
      getUserFeed();
    })
  });
}

function displayTaskEditForm(taskId, groupId) {
  $('.edit-task-form[data-taskId="' + taskId + '"]').click(function(event) {
    event.preventDefault();
    closeTaskEditForm(taskId);
    let taskEditForm = $.get('/groups/' + groupId + '/tasks/' + taskId + '/edit');
    taskEditForm.done(function(data) {
      let taskFormHtml = `
      <div class="card mb-2">
        <div class="card-body">
        ${data}
        </div>
      </div>`
      $('.task-form-frame').html(taskFormHtml);
      $('#task-edit-form').attr('data-groupId', groupId);
      $('#task-edit-form').attr('data-taskId', taskId);
      submitTaskEditForm();
      $('#cancel_task_form').click(function(e){
        e.preventDefault();
        closeTaskEditForm();
      });
    });

  });
}

function submitTaskEditForm() {
  $('#task-edit-form').submit(function(event) {
    event.preventDefault();
    const groupId = $('#task-edit-form').attr('data-groupId')
    const taskId = $('#task-edit-form').attr('data-taskId')
    const values = $(this).serialize();

    const editTask = $.ajax({
      type: "PATCH",
      url: '/groups/' + groupId + '/tasks/' + taskId,
      data: values,
      success : function() {
        closeTaskEditForm();
        getUserFeed();
      }
    });
  });
}

function closeTaskEditForm(taskId) {
  $('.task-form-frame').empty();
}
