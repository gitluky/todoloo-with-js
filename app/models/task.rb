class Task < ApplicationRecord
  belongs_to :group
  belongs_to :created_by, class_name: 'User'
  belongs_to :assigned_to, class_name: 'User', optional: true
  has_many :notes

  validates :name, presence: true
  validates :description, presence: true

  def assigned?
    !!self.assigned_to_id
  end

  def assigned_user_name
    User.find_by(id: self.assigned_to).try('name')
  end

  def creator_user_name
    User.find_by(id: self.created_by).try('name')
  end

  def update_assignment(status)
    self.status = status
    self.save
  end
end
