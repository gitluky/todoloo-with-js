class TaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :assigned_user_name, :creator_user_name, :status
end
