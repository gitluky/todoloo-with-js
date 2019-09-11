class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :name
  has_many :groups_for_user_feed, serializer: UserGroupSerializer
  has_many :received_invitations, serializer: InvitationSerializer
end
