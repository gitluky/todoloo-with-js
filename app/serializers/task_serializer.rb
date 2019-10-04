class TaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :assigned_to_id, :assigned_user_name, :created_by_id, :creator_user_name, :status, :created_at, :updated_at, :full_error_messages

  def full_error_messages
    object.errors.full_messages
  end

end
