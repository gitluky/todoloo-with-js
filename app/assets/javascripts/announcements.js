function createAnnouncement() {
  return class {
    constructor(args) {
      for (let i = 0; i < Object.keys(args).length; i++) {
        this[Object.keys(args)[i]] = Object.values(args)[i];
      }
    }

    displayRecentGroupAnnouncements() {
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
  }
}
