function createUser() {
  return class {
    constructor(args) {
      for (let i = 0; i < Object.keys(args).length; i++) {
        this[Object.keys(args)[i]] = Object.values(args)[i];
      }
    }

    displayUserInfo() {
      const userHtml = `
      <li class="mt-2 font-weight-normal members" data-userId="${this['user-id']}" data-admin="${this.admin}">
        ${this.name} <img class="avatar-xs" src="${this.avatar}"><br>
      </li>`
      if (this.admin === true) {
        $('#admins').append(userHtml)
      } else {
        $('#members').append(userHtml)
      }
    }

  }
}
