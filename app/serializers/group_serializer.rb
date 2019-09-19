class GroupSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :name, :description, :group_image, :invitations, :assigned_tasks, :available_tasks, :recent_completed_tasks, :users, :errors, :members

  def group_image
    rails_blob_path(object.image) if object.image.attachment
  end

  def announcements_in_order
    object.announcements.order({ created_at: :desc })
  end

  def members
    object.memberships.map do |member|
      user = User.find_by(id: member.user_id)
      { id: member.id, group_id: member.group_id, name: user.name, admin: member.admin, avatar: rails_blob_path(user.avatar) }
    end
  end

end
