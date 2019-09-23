function createTask() {
  return class {
    constructor(args) {
      for (let i = 0; i < Object.keys(args).length; i++) {
        this[Object.keys(args)[i]] = Object.values(args)[i];
      }
    }

    displayUserFeedTasks(callback) {
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
            <a class="nav-item nav-link px-2" rel="nofollow" data-method="post" href="/drop_task/${this.id}">Drop</a>
            <a class="nav-item nav-link px-1" href="/tasks/${this.id}">View</a>
            <a class="nav-item nav-link px-1 edit-task-form" href="#" data-groupId="${this["group-id"]}" data-taskId="${this.id}">Edit</a>
            <a class="nav-item nav-link px-1" href="/tasks/${this.id}/complete">Complete</a>
            </ul>
          </div>
        </div>
      </div>`

      $('.tasks[data-groupid="' + this["group-id"] + '"]').append(taskHtml);
      callback();
    }

    attachTaskEditListeners(callback) {
      const taskId = this.id;
      const groupId = this["group-id"];
      $('.edit-task-form[data-taskId="' + taskId + '"]').click(function (event) {
        event.preventDefault();
        $('.task-form-frame').empty();
        let taskEditForm = $.get('/groups/' + groupId + '/tasks/' + taskId + '/edit');
        taskEditForm.done(function(data) {
          let taskFormHtml = `
          <div class="card mb-2">
            <div class="card-body">
            ${data}
            </div>
          </div>`
          $('.task-form-frame').html(taskFormHtml);
          $('#task-edit-form').attr('data-groupId', groupId);
          $('#task-edit-form').attr('data-taskId', taskId);
          callback();
          $('#cancel_task_form').click(function(e){
            e.preventDefault();
            $('.task-form-frame').empty();
          });
        });

      });
    }

    attachSubmitTaskEditListener() {
      $('#task-edit-form').submit(function(event) {
        event.preventDefault();
        const groupId = $('#task-edit-form').attr('data-groupId')
        const taskId = $('#task-edit-form').attr('data-taskId')
        const values = $(this).serialize();

        const editTask = $.ajax({
          type: "PATCH",
          url: '/groups/' + groupId + '/tasks/' + taskId,
          data: values,
          success : function() {
            $('.task-form-frame').empty();
            getUserFeed();
          }
        });
      });
    }

  }
}
