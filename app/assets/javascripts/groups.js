function createGroup() {
  let groupId = 0;
  return class {
    constructor(args) {
      for (let i = 0; i < Object.keys(args).length; i++) {
        this[Object.keys(args)[i]] = Object.values(args)[i];
      }
    }

    displayGroupFeed() {
      let groupHtml = `<div class="row text-center mt-3 justify-content-center mx-0 px-0 w-100">
      <div class="col-lg-10 text-center">
        <div class="card bg-light text-center">
          <img class="card-img-top-short rounded-top" src="${this["attributes"]["group-image"] ? this["attributes"]["group-image"] : ""}">

          <h2 class="mt-2 text-primary">${this["attributes"]["name"]}</h2>

          <small class="mt-n2">
            <a class="ml-2" href="/groups/${this["id"]}">View Group</a>
          </small>

          <div class="announcements" data-groupid="${this["id"]}">
          </div>

          <div class="tasks">
          </div>

          </div>
        </div>
      </div>`;
      $('.feed-frame').append(groupHtml);
    }


  }
}
