function createAnnouncement() {
  return class {
    constructor(args) {
      for (let i = 0; i < Object.keys(args).length; i++) {
        this[Object.keys(args)[i]] = Object.values(args)[i];
      }
    }

    displayUserFeedAnnouncement() {
      let announcementHtml =`<div class="card mb-2" data-announcementid="${this.id}">
          <div class="card-body">
            <h5>${this.title}</h5>
            ${this.content}
          </div>
          <div class="card-footer">
            <small class="text-muted">
               @${new Date(this['updated_at']).toLocaleString()}
            </small>
          </div>
        </div>`;
      $('.announcements[data-groupid="' + this["group_id"] + '"]').append(announcementHtml);
    }

    displayGroupAnnouncement() {
      return `
        <div class="card mb-2">
          <div class="card-body pb-1">
            <h5>${this.title}</h5>
            ${this.content}

          </div>
          <div class="card-footer">
            <small class="text-muted">
              <div class="row justify-content-start ml-2">
                ${this["user-name"]} @
                ${new Date(this['updated-at']).toLocaleString()}
                <div class="ml-auto mr-2 announcement-admin-links" data-announcementId="${this.id}">
                </div>
              </div>
            </small>
          </div>
        </div>`
    }

    displayEditAnnouncementsLinks() {
      return `
      <a class="mr-2 py-0 edit-announcement" data-announcementid="${this.id}" href="#">Edit</a>
      <a class="delete-announcement" data-announcementid="${this.id}" href="#">Delete</a>
      `;
    }

    attachEditAnnouncementListener(callback) {
      $('.edit-announcement[data-announcementid="' + this.id + '"]').click((event) => {
        event.preventDefault();
        $('.group-form-frame').empty();
        const getAnnouncementForm = $.get('/groups/' + this['group-id'] + '/announcements/' + this.id + '/edit');
        getAnnouncementForm.done((form) => {
          $('.group-form-frame').append(form);
          $('#announcement-form-title').text('Edit Announcement');
          $('#post-announcement-submit').text('Update Announcement');
          callback();
        })
      });
    }

    attachDeleteAnnouncementListener(callback) {
      $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
      });
      const url = '/groups/' + this['group-id'] + '/announcements/' + this.id
      $('.delete-announcement[data-announcementid="' + this.id + '"]').click((e) => {
        e.preventDefault();
        const deleteAnnouncement = $.ajax({
          method: 'DELETE',
          url: url,
          success: function(resp) {
            callback();
          }
        });
      });
    }

    attachEditAnnouncementFormListener(callback, callback2) {
      $('.cancel').click(function(e){
        e.preventDefault();
        $('.group-form-frame').empty();
      });
      $('#edit_announcement_' + this.id).submit((e) => {
        e.preventDefault();
        const values = $('#edit_announcement_' + this.id).serialize();
        const editAnnouncement = $.ajax({
          type: 'PATCH',
          url: '/groups/' + this['group-id'] + '/announcements/' + this.id,
          data: values,
          dataType: 'json',
          success: function(resp) {
            callback(resp);
            callback2();
          }
        })
      })
    }


  }
}
