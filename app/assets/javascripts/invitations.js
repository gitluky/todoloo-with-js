function createInvitation() {
  return class {
    constructor(args) {
      for (let i = 0; i < Object.keys(args).length; i++) {
        this[Object.keys(args)[i]] = Object.values(args)[i];
      }
    }

    displayUserFeedInvitation() {
      let invitationHtml = `
        <div class="card mx-1 text-center">
          <div class="card-body">
            <small class="my-0 text-muted">You have been invited to: </small>
            <h4 class="card-title text-center mb-0">${this["attributes"]["group-name"]}<br></h4>
            <small class="text-muted ">Sent By: ${this["attributes"]["sender-name"]}</small>
            <div class="row justify-content-center mt-2">
              <a class="btn btn-primary" href="/groups/${this["attributes"]["group-id"]}/invitations/${this.id}/accept">Accept</a>
              <a class="btn btn-danger ml-2" rel="nofollow" data-method="delete" href="/groups/${this["attributes"]["group-id"]}/invitations/${this.id}">Decline</a>
            </div>
          </div>
        </div>
      `
      $('.invitations').append(invitationHtml);
    }

    displayGroupInvitation() {
      const invitationHtml = `
      <li class="mt-2">
        ${this['recipient-name']} <img src="${this.avatar}" class="avatar-xs"><br>
        <small class="text-muted">
          Sent by: ${this['sender-name']}<br>
          <a rel="nofollow" data-method="delete" href="/groups/${this['group-id']}/invitations/${this.id}">Cancel Invitation</a>
        </small>
      </li>`
      $('#invitations').append(invitationHtml);
    }

  }
}
