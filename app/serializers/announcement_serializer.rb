class AnnouncementSerializer < ActiveModel::Serializer
  attributes :id, :full_error_messages

  def full_error_messages
    object.errors.full_messages
  end

end
