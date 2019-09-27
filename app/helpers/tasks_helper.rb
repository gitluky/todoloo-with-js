module TasksHelper

  # def tasks_category_title(title_string, tasks_array)
  #   tasks_array.count > 0? title_string + " (#{tasks_array.count.to_s})" + ':' : nil
  # end

  def display_assignment_links(task)
    if !task.assigned?
      link_to('Volunteer', volunteer_path(task), method: 'post', class: 'nav-item nav-link px-2')
    elsif task.assigned_to == current_user && task.status != 'Completed'
      link_to('Drop', drop_task_path(task), method: 'post', class: 'nav-item nav-link px-2')
    end
  end

  def display_completion_links(group, task)
    if (current_user.is_admin?(group) || task.assigned_to == current_user) && task.assigned?
      if task.status == 'Assigned'
        link_to 'Complete', complete_path(task), class: 'nav-item nav-link px-1'
      else
        link_to 'Incomplete', incomplete_path(task), class: 'nav-item nav-link px-1'
      end
    end
  end

end
