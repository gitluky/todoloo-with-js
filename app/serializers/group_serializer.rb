class GroupSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :name, :description, :group_image, :invitations, :assigned_tasks, :available_tasks, :recent_completed_tasks, :current_member, :errors, :members

  def group_image
    rails_blob_path(object.image) if object.image.attachment
  end

  def announcements_in_order
    object.announcements.order({ created_at: :desc })
  end

  def current_member
    member = Membership.find_by(user_id: current_user.id)
    { id: member.id, group_id: member.group_id, user_id: member.user_id, admin: member.admin }
  end

  def members
    object.memberships.map do |member|
      user = User.find_by(id: member.user_id)
      { id: member.id, group_id: member.group_id, user_id: user.id, name: user.name, admin: member.admin, avatar: rails_blob_path(user.avatar) }
    end
  end

end
