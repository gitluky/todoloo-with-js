class GroupSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :name, :description, :group_image, :formatted_invitations, :announcements_in_order, :formatted_assigned_tasks, :formatted_available_tasks, :formatted_recent_completed_tasks, :current_member, :errors, :members

  def group_image
    rails_blob_path(object.image) if object.image.attachment
  end

  def formatted_available_tasks
    object.available_tasks.map do |task|
      group = Group.find_by(id: task.group_id)
      created_by_user = User.find_by(id: task.created_by_id)
      {id: task.id, name: task.name, description: task.description, group_id: group.id, created_by_id: created_by_user.id, created_by_name: created_by_user.name, status: task.status}
    end
  end

  def formatted_assigned_tasks
    object.assigned_tasks.map do |task|
      group = Group.find_by(id: task.group_id)
      created_by_user = User.find_by(id: task.created_by_id)
      assigned_to_user = User.find_by(id: task.assigned_to_id)
      {id: task.id, name: task.name, description: task.description, group_id: group.id, created_by_id: created_by_user.id, created_by_name: created_by_user.name, assigned_to_id: assigned_to_user.id, assigned_to_name: assigned_to_user.name, status: task.status}
    end

  end

  def formatted_recent_completed_tasks
    object.recent_completed_tasks.map do |task|
      group = Group.find_by(id: task.group_id)
      created_by_user = User.find_by(id: task.created_by_id)
      assigned_to_user = User.find_by(id: task.assigned_to_id)
      {id: task.id, name: task.name, description: task.description, group_id: group.id, created_by_id: created_by_user.id, created_by_name: created_by_user.name, assigned_to_id: assigned_to_user.id, assigned_to_name: assigned_to_user.name, status: task.status}
    end

  end

  def announcements_in_order
    object.announcements.order({ created_at: :desc }).map do |announcement|
      user = User.find_by(id: announcement.user_id) if announcement.user_id
      announcement_hash = { id: announcement.id, title: announcement.title, content: announcement.content, group_id: announcement.group_id, updated_at: announcement.updated_at }
      if user
         announcement_hash.merge(user_name: user.name, user_id: user.id )
       else
        announcement_hash.merge(user_name: 'System', user_id: '')
      end
    end
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

  def formatted_invitations
    object.invitations.map do |invitation|
      { id: invitation.id, group_id: invitation.group.id, sender_name: invitation.sender.name, recipient_name: invitation.recipient.name, avatar: rails_blob_path(invitation.recipient.avatar) }
    end
  end

end
