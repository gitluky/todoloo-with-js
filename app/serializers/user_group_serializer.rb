class UserGroupSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :name, :description, :group_image, :recent_announcements, :tasks_assigned_to_current_user

  def group_image
    rails_blob_path(object.image) if object.image.attachment
  end

  def tasks_assigned_to_current_user
    object.tasks_assigned_to_user(current_user)
  end

end
