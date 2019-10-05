class TaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :assigned_to_id, :assigned_to_name, :created_by_id, :created_by_name, :status, :created_at, :updated_at, :full_error_messages

  def full_error_messages
    object.errors.full_messages
  end

  def assigned_to_name
    object.assigned_user_name
  end

  def created_by_name
    object.creator_user_name
  end

end
