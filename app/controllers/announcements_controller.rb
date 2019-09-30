class AnnouncementsController < ApplicationController

  before_action :set_parent_group, only: [:index, :new, :create, :edit, :update, :destroy, :validate_user_group_membership]
  before_action :set_nested_announcement, only: [:edit, :update, :destroy]
  before_action :validate_user_group_membership
  before_action :check_edit_privileges, only: [:edit, :update, :destroy]

  def index
    @announcements = @group.announcements.order( created_at: :desc )
  end

  def new
    @announcement = @group.announcements.build
    render partial: 'announcement_form', locals: { group: @group, announcement: @announcement}
  end

  def create
    @announcement = @group.announcements.build(announcement_params)
    @announcement.user = current_user
    @announcement.save
    render json: @announcement
  end

  def edit

  end

  def update
    @announcement.update(announcement_params)
    redirect_to group_path(@group)
  end

  def destroy
    @announcement.destroy
    redirect_to group_path(@group)
  end

  private

  def announcement_params
    params.require(:announcement).permit(:title, :content)
  end

  def set_parent_group
    @group = Group.find_by(id: params[:group_id])
  end

  def set_nested_announcement
    @announcement = @group.announcements.find_by(id: params[:id])
  end

  def check_edit_privileges
    @group = @announcement.group
    if !current_user.is_admin?(@group) && current_user != @announcement.created_by
      redirect_to group_path(@group)
    end
  end



end
