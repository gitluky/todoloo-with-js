class GroupSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :name, :description, :group_image, :invitations, :assigned_tasks, :available_tasks, :recent_completed_tasks, :users, :errors

  has_many :admins, serializer: GroupAdminSerializer
  has_many :non_admins, serializer: GroupNonAdminSerializer

  def group_image
    rails_blob_path(object.image) if object.image.attachment
  end

  def announcements_in_order
    object.announcements.order({ created_at: :desc })
  end

end
