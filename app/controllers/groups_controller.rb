class GroupsController < ApplicationController

  before_action :redirect_if_not_logged_in
  before_action :set_group, only: [:show, :edit, :update, :destroy]
  before_action :validate_user_group_membership, only: [:show]
  before_action :validate_admin_user_actions, only: [:edit, :update, :destroy]

  def index
    @groups = current_user.groups
  end

  def new
    @group = current_user.groups.build
    render partial: 'group_form', locals: { group: @group, submit_button: 'Create Group' }
  end

  def create
    @group = current_user.groups.create(group_params)
    if @group.valid?
      @group.last_edited_by = current_user
      @group.announcements.create(title: 'Welcome!', content: 'Welcome to your new group! You can now start inviting members and creating tasks.')
      current_user.grant_admin_membership(@group)
      if !@group.image.attached?
        @group.image.attach(io: File.open(Rails.root.join('app', 'assets', 'images', 'placeholder-banner.png')), filename: 'placeholder-banner.png', content_type: 'image/png')
      end
      @group.save
      redirect_to group_path(@group), flash: { message: 'Your group has been created.' }
    else
      render :new
    end
  end

  def show
    @invitations = @group.invitations
    @announcements = @group.announcements.order({ created_at: :desc })
    @available_tasks = @group.available_tasks
    @assigned_tasks = @group.assigned_tasks
    @completed_tasks = @group.recent_completed_tasks
    @task = @group.tasks.build
    @members = @group.users
    @admins = @group.admins
    @non_admins = @group.non_admins

  end

  def edit

  end

  def update
    @group.last_edited_by = current_user
    @group.update(group_params)
    redirect_to group_path(@group), flash: { message: "Group has been successfully updated."}
  end

  def destroy
    @group.destroy
    redirect_to groups_path, flash: { message: 'Group has been successfully deleted.'}
  end

  private

  def set_group
    @group = Group.find_by(id: params[:id])
  end

  def group_params
    params.require(:group).permit(:name, :description, :image )
  end

  def validate_admin_user_actions
    if !current_user.is_admin?(@group)
      redirect_to group_path(@group), flash: { message: 'You do not have the rights to perform action.'}
    end
  end


end
