$('.application.index').ready(function() {
  display_group_form();
  getUserFeed()
})

function getUserFeed() {
  const Group = createGroup();
  const Announcement = createAnnouncement();
  $.get('/user_feed', function(resp) {
    const groups = resp['included'].filter((x) => x.type === "groups");
    const new_groups = groups.map(function(group) {
      return new Group(group)
    })
    new_groups.forEach(function(group) {
      group.displayGroupFeed();
      const new_announcements = group["attributes"]["recent-announcements"].map(function(recent_announcement){
        return new Announcement(recent_announcement)
      });
      new_announcements.forEach(function(announcement) {
        announcement.displayRecentGroupAnnouncements();
      });
    })
  })
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
    creating_group.done(function() {
      closeForm();
      getUserFeed()
    })
  });
}
