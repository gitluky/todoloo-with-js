class UserGroupSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :name, :description, :group_image, :recent_announcements, :tasks_assigned_to_current_user

  def group_image
    rails_blob_path(object.image) if object.image.attachment
  end

  def tasks_assigned_to_current_user
    object.tasks_assigned_to_user(current_user).map do |task|
      {id: task.id , name: task.name , description: task.description, group_id: task.group_id, assigned_user_name: task.assigned_user_name , creator_user_name: task.creator_user_name , status: task.status }
    end
  end

end
