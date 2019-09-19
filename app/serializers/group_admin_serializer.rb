class GroupAdminSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  type 'admin'
  attributes :id, :name, :member_avatar

  def member_avatar
    rails_blob_path(object.avatar) if object.avatar.attachment
  end

end
