function createTask() {
  return class {
    constructor(args) {
      for (let i = 0; i < Object.keys(args).length; i++) {
        this[Object.keys(args)[i]] = Object.values(args)[i];
      }
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
            <a class="nav-item nav-link px-1 edit-task-form" href="#" data-taskId="${this.id}">Edit</a>
            <a class="nav-item nav-link px-1" href="/tasks/${this.id}/complete">Complete</a>
            </ul>
          </div>
        </div>
      </div>
      <div class="edit-task" data-taskId="${this.id}">
      </div>`;

      $('.tasks[data-groupid="' + this["group-id"] + '"]').append(taskHtml);

      this.displayTaskEditForm(this.id, this["group-id"]);

    }

    displayTaskEditForm(taskId, groupId) {

      $('.edit-task-form[data-taskId="' + taskId + '"]').click(function(event) {
        event.preventDefault();
        closeTaskEditForm(taskId);
        $.get('/groups/' + groupId + '/tasks/' + taskId + '/edit', function(data){
          let taskFormHtml = `
          <div class="card mb-2">
            <div class="card-body">
            ${data}
            </div>
          </div>`
          $('.edit-task[data-taskId="' + taskId + '"]').html(taskFormHtml);
        });
      });
    }

    closeTaskEditForm(taskId) {
      debugger;
      $('.edit-task[data-taskId="' + taskId + '"]').empty();
    }

  }
}
