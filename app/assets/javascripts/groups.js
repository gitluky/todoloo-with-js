function createGroup() {
  let groupId = 0;
  return class {
    constructor(args) {
      for (let i = 0; i < keys(args).length; i++) {
        this[keys(args)[i]] = values(args)[i];
      }
    }

    displayGroupFeed() {
      let groupHtml = `<div class="row text-center mt-3 justify-content-center mx-0 px-0">
      <div class="col-lg-8 text-center">
        <div class="card bg-light text-center">
          <img class="card-img-top-short rounded-top" src="${group.image}">

          <h2 class="mt-2 text-primary">${group.name}</h2>

          <small class="mt-n2">
            <a class="ml-2" href="/groups/${group.id}">View Group</a>
          </small>


        </div>
      </div>
    </div>`
    }


  }
}
