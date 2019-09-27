class Group < ApplicationRecord
  has_many :tasks
  has_many :announcements
  has_many :invitations
  has_many :memberships
  has_many :users, through: :memberships
  belongs_to :last_edited_by, class_name: 'User', optional: true

  has_one_attached :image

  validates :name, presence: true
  validates :description, presence: true

  scope :group_with_most_tasks_assigned_to_user, -> (user) { joins(:tasks).where( tasks: { assigned_to: user.id }).group('tasks.group_id').order('count(tasks.assigned_to_id) desc').first }

  def self.create_group_by_user(user, group_params)
    group = self.new(group_params)
    if !group.image.attached?
      group.image.attach(io: File.open(Rails.root.join('app', 'assets', 'images', 'placeholder-banner.png')), filename: 'placeholder-banner.png', content_type: 'image/png')
    end
    group.last_edited_by = user
    group.save
    membership = Membership.create(user_id: user.id, group_id: group.id, admin: true)
    group
  end

  def recent_announcements
    Announcement.posted_for_group_since(self.id, 1.week.ago).order( created_at: :desc ).limit(1)
  end

  def tasks_assigned_to_user(user)
    self.tasks.where(assigned_to_id: user.id, status: 'Assigned')
  end

  def admins
    User.group_admins(self)
  end

  def non_admins
    User.non_group_admins(self)
  end

  def available_tasks
    tasks.where(assigned_to_id: nil).where.not(status: 'Completed')
  end

  def assigned_tasks
    tasks.where.not(assigned_to_id: nil).where.not(status: 'Completed')
  end

  def completed_tasks
    tasks.where(status: 'Completed')
  end

  def recent_completed_tasks
    tasks.where(status: 'Completed').where('updated_at > ?', 1.day.ago).order(updated_at: :desc)
  end


end
