class Invitation < ApplicationRecord
  belongs_to :group
  belongs_to :sender, class_name: 'User'
  belongs_to :recipient, class_name: 'User'

  validates :recipient_id, presence: {message: 'not found.'}
  validates :recipient_id, uniqueness: { scope: :group_id }

  def group_name
    Group.find_by(id: group_id).name
  end

  def recipient_name
    User.find_by(id: recipient_id).name
  end

  def sender_name
    User.find_by(id: sender_id).name
  end

  def recipient_email=(email)
    self.recipient = User.find_by(email: email)
  end

  def recipient_email
    self.recipient ? self.recipient.name : nil
  end

end
