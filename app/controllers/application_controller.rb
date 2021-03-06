class ApplicationController < ActionController::Base
  include SessionsHelper
  include GroupsHelper
  include TasksHelper
  include AnnouncementsHelper

  before_action :redirect_if_not_logged_in
  skip_before_action :redirect_if_not_logged_in, only: [:index]

  def index

  end

  def user_feed
    @user = current_user
    render json: @user, include: [:groups_for_user_feed, :received_invitations]
  end

private

  def redirect_if_not_logged_in
    if !logged_in?
      redirect_to login_path
    end
  end

  def validate_user_group_membership
    if @group.users.exclude?(current_user)
      redirect_to root_path, flash: { message: 'You are not a member of the group you are trying to access.'}
    end
  end

end
