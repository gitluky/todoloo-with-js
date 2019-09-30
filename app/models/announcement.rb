class Announcement < ApplicationRecord
  belongs_to :group
  belongs_to :user, optional: true
  scope :posted_for_group_since, ->(group, time) { where("announcements.group_id = ? AND announcements.created_at > ? ", group, time) }
  validates :title, :content, presence: true
end
