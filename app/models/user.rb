require 'open-uri'
class User < ApplicationRecord
  has_many :created_tasks, class_name: "Task", foreign_key: 'created_by_id'
  has_many :assigned_tasks, class_name: "Task", foreign_key: 'assigned_to_id'
  has_many :announcements
  has_many :received_invitations, class_name: "Invitation", foreign_key: 'recipient_id'
  has_many :sent_invitations, class_name: "Invitation", foreign_key: 'sender_id'
  has_many :memberships
  has_many :groups, through: :memberships
  has_many :groups_edited, class_name: "Group", foreign_key: 'last_edited_by_id'
  has_one_attached :avatar
  validates :name, :email, presence: true
  validates :email, uniqueness: true
  has_secure_password

  scope :group_admins, -> (group) { joins(:memberships).where(memberships: { group: group, admin: true })}
  scope :non_group_admins, -> (group) { joins(:memberships).where(memberships: { group: group, admin: false })}
  scope :created_most_tasks, -> (group) { joins("INNER JOIN 'tasks' ON 'users'.'id' = 'tasks'.'created_by_id'").where( tasks: { group_id: group }).group('tasks.created_by_id').order('count(tasks.created_by_id) desc').first }
  scope :created_most_recent_task, -> (group) { joins("INNER JOIN 'tasks' ON 'users'.'id' = 'tasks'.'created_by_id'").where( tasks: { group_id: group }).order('tasks.created_at desc').first }

  def self.make_new_user(user_params)
    user = self.new(user_params)
    if !user.avatar.attached?
      user.avatar.attach(io: File.open(Rails.root.join('app', 'assets', 'images', 'default_avatar.png')), filename: 'default_avatar.png', content_type: 'image/png')
    end
    user.save
    user
  end


  def self.find_or_create_by_oauth(oauth_hash)
    user = User.find_or_create_by(email: oauth_hash['info']['email']) do |u|
      u.uid = oauth_hash['uid']
      u.name = oauth_hash['info']['name']
      u.provider = oauth_hash['provider']
      u.password = SecureRandom.hex
    end

    avatar_image = open(oauth_hash['info']['image']+'?type=large')
    user.avatar.attach(io: avatar_image, filename: "avatar_#{user.id}.jpg", content_type: avatar_image.content_type)
    user.save
    user
  end

  def is_admin?(group)
    group.admins.include?(self)
  end

  def grant_admin_membership(group)
    membership = memberships.where(group_id: group.id).first
    membership.admin = true
    membership.save
  end

  def remove_admin_membership(group)
    membership = memberships.where(group: group).first
    membership.admin = false
    membership.save
  end

  def groups_for_user_feed
    self.groups.select {|group| Announcement.posted_for_group_since(group, 1.week.ago).any? || !group.tasks_assigned_to_user(self).empty? }
  end

end
