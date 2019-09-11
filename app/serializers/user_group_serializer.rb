class UserGroupSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :name, :description, :group_image

  def group_image
    rails_blob_path(object.image) if object.image.attachment
  end
end
