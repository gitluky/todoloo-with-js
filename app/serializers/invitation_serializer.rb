class InvitationSerializer < ActiveModel::Serializer
  attributes :id, :group_id, :group_name, :sender_name
end
