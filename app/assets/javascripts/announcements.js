function createAnnouncement() {
  return class {
    constructor(args) {
      for (let i = 0; i < Object.keys(args).length; i++) {
        this[Object.keys(args)[i]] = Object.values(args)[i];
      }
    }



    displayUserFeedAnnouncements() {
      let announcementHtml =`<div class="card mb-2" data-announcementid="${this.id}">
          <div class="card-body">
            <h5>${this.title}</h5>
            ${this.content}
          </div>
          <div class="card-footer">
            <small class="text-muted">
               @${new Date(this.updated_at).toLocaleString()}
            </small>
          </div>
        </div>`;
      $('.announcements[data-groupid="' + this["group_id"] + '"]').append(announcementHtml);
    }

    displayGroupShowAnnouncements() {
      let announcementHtml = `
        <div class="card mb-2">
          <div class="card-body">
            <h5>${this.title}</h5>
            ${this.content}
            <div class="row justify-content-center mt-2 announcement-admin-links">
            </div>
          </div>
          <div class="card-footer">
            <small class="text-muted">
              ${this["user-name"]} @
              ${new Date(this.updated_at).toLocaleString()}
            </small>
          </div>
        </div>`
        $('#announcements').append(announcementHtml);
    }

    displayEditAnnouncementsLinks() {
      let adminLinksHtml = `
      <a class="mr-5" href="/groups/1/announcements/3/edit">Edit</a>
      <a rel="nofollow" data-method="delete" href="/groups/1/announcements/3">Delete</a>
        `;
      $('.announcement-admin-links').append(adminLinksHtml);
    }


  }
}
