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
      <a class="mr-2 py-0" href="/groups/1/announcements/3/edit">Edit</a>
      <a rel="nofollow" data-method="delete" href="/groups/1/announcements/3">Delete</a>
      `;
    }


  }
}
