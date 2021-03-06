class UserFeedGroupSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :name, :description, :group_image, :recent_announcements, :tasks_assigned_to_current_user, :current_user_membership

  def group_image
    rails_blob_path(object.image) if object.image.attachment
  end

  def tasks_assigned_to_current_user
    object.tasks_assigned_to_user(current_user).map do |task|
      {id: task.id , name: task.name , description: task.description, group_id: task.group_id, assigned_to_id: task.assigned_to_id, assigned_user_name: task.assigned_user_name , creator_id: task.created_by_id, creator_user_name: task.creator_user_name , status: task.status }
    end
  end

  def current_user_membership
    object.memberships.where(user_id: current_user.id)
  end


end
