function createTask() {
  let taskCount = 0;
  return class {
    constructor(args) {
      for (let i = 0; i < Object.keys(args).length; i++) {
        this[Object.keys(args)[i]] = Object.values(args)[i];
      }
      taskCount ++;
      debugger;
    }

    displayUserFeedTasks() {
      let taskHtml = `
      <div class="card mb-2 col-lg-4 float-right">
        <div class="card-body">
          <h5 class="card-title">${this.name}</h5>
          <div class="card-text" id="task_section">
            ${this.description}<br>
            Assigned to: ${this["assigned-user-name"]}<br>
            Status: ${this.status}<br>
            Created by: ${this["creator-user-name"]}
          <ul class="nav justify-content-center">
            <a class="nav-item nav-link px-2" rel="nofollow" data-method="post" href="/drop_task/1">Drop</a>
            <a class="nav-item nav-link px-1" href="/tasks/1">View</a>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle px-2" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Edit</a>
                <div class="dropdown-menu">
                  <form class="form-group" id="edit_task_1" action="/groups/${this["group-id"]}/tasks/${this.id}" accept-charset="UTF-8" method="post"><input name="utf8" type="hidden" value="✓"><input type="hidden" name="_method" value="patch"><input type="hidden" name="authenticity_token" value="EB7LdZJ5VAza7B1dPUBKtjSpNtTEHpYAkIdTlqK8Dbd/aAKkKyu5o5iEEcAK1ELy7wm1ZT9lo+F8RPIZiywLjA==">
                    <div class="form-group">
                      Name: <input class="form-control" type="text" value="${this.name}" name="task[name]" id="task_name">
                    </div>
                    <div class="form-group">
                      Description: <textarea class="form-control" name="task[description]" id="task_description">${this.description}</textarea>
                    </div>
                    <div class="form-group">
                      Assign to (optional): <select name="task[assigned_to_id]" id="task_assigned_to_id">
                      <option value=""></option>
                    </div>
                    <input type="submit" name="commit" value="Update" data-disable-with="Update">
                  </form>
                </div>
              </li>
              <a class="nav-item nav-link px-1" href="/tasks/${this.id}/complete">Complete</a>
            </ul>
          </div>
        </div>
      </div>`;

      $('.tasks[data-groupid="' + this["group-id"] + '"]').append(taskHtml);

    }
  }
}
