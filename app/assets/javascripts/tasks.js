function createTask() {
  return class {
    constructor(args) {
      for (let i = 0; i < Object.keys(args).length; i++) {
        this[Object.keys(args)[i]] = Object.values(args)[i];
      }
    }

    createUserFeedTaskCards() {
      return `
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

    }

    createGroupTaskCards() {
      let editLinks;
      let taskCardHtml = `
      <div class="card mb-2">
        <div class="card-body">
          <h5 class="card-title">${this.name}</h5>
          <div class="card-text" id="task_section">
            ${this.description}<br>`;
      if (!!this["assigned-to-name"]) {
        taskCardHtml += `Assigned to: ${this["assigned-to-name"]}<br>`
      }

      taskCardHtml += `Status: ${this.status}<br>
                  Created by: ${this["created-by-name"]}
                <ul class="nav justify-content-center task-links" data-taskId="${this.id}">
                  <a class="nav-item nav-link px-1" href="/tasks/${this.id}">View</a>`

      if (this.status === "Available") {
        editLinks = `<a class="nav-item nav-link px-2" rel="nofollow" data-method="post" href="/volunteer/${this.id}">Volunteer</a>`
        taskCardHtml += editLinks;
      }

      taskCardHtml += `</ul>
                </div>
              </div>
            </div>`

      return taskCardHtml;
    }

    taskCardEditLink() {
      return `<a class="nav-item nav-link px-1 edit-task-link" href="#" data-groupId="${this["group-id"]}" data-taskId="${this.id}">Edit</a>`
    }

    taskCardDropLink() {
      return `<a class="nav-item nav-link px-2" rel="nofollow" data-method="post" href="/drop_task/${this.id}">Drop</a>`

    }

    taskCardCompleteLink() {
      return `<a class="nav-item nav-link px-1" href="/tasks/${this.id}/complete">Complete</a>`
    }

    taskCardIncompleteLink() {
      return `<a class="nav-item nav-link px-1" href="/tasks/${this.id}/incomplete">Incomplete</a>`
    }

    attachTaskEditListeners(callback) {
      const taskId = this.id;
      const groupId = this["group-id"];
      $('.edit-task-link[data-taskId="' + taskId + '"]').click(function (event) {
        event.preventDefault();
        $('.group-form-frame').empty();
        let taskEditForm = $.get('/groups/' + groupId + '/tasks/' + taskId + '/edit');
        taskEditForm.done(function(data) {
          let taskFormHtml = `
          <div class="card mb-2">
            <div class="card-body">
            ${data}
            </div>
          </div>`
          $('.group-form-frame').html(taskFormHtml);
          $('#task-form').attr('data-groupId', groupId);
          $('#task-form').attr('data-taskId', taskId);
          $("body,html").animate(
            {
              scrollTop: $('.group-form-frame').offset().top
            }, 800);
          callback();
        });

      });
    }

    attachTaskEditFormListeners(callback) {
      $('#cancel_task_form').click(function(e){
        e.preventDefault();
        $('.group-form-frame').empty();
      });
      $('#task-form').submit(function(event) {
        event.preventDefault();
        const groupId = $('#task-form').attr('data-groupId');
        const taskId = $('#task-form').attr('data-taskId');
        const token = $('input[name="authenticity_token"]').val();
        const taskName = $('#task_name').val();
        const taskDescription = $('#task_description').val();
        const taskAssignToId = $('#task_assigned_to_id').val();
        const values = $(this).serialize();

        const editTask = $.ajax({
          url: '/groups/' + groupId + '/tasks/' + taskId,
          type: "PATCH",
          data: values,
          dataType: 'json',
          success : function(resp) {
            console.log(resp)
            $('.group-form-frame').empty();
            callback();
          }
        });
      });
    }

    createGroupShowTaskCards(selector) {
      let taskCard
      let editLinks
      taskCard = this.createGroupTaskCards();
      $(selector).append(taskCard);
    }

  }
}
