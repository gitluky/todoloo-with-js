class InvitationSerializer < ActiveModel::Serializer
  attributes :id, :group_id, :group_name, :sender_name, :full_error_messages

  def full_error_messages
    object.errors.full_messages
  end

end
