class TaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :assigned_to_id, :assigned_user_name, :created_by_id, :creator_user_name, :status, :created_at, :updated_at

end
