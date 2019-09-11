class InvitationSerializer < ActiveModel::Serializer
  attributes :id, :group_id, :recipient_id, :sender_id
end
