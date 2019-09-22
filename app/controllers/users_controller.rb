class UsersController < ApplicationController

  before_action :set_user, only: [:edit, :show, :update, :destroy, :create_admin, :delete_admin, :kick]
  before_action :set_nested_group, only: [:create_admin, :delete_admin, :kick]
  before_action :redirect_if_not_logged_in
  skip_before_action :redirect_if_not_logged_in, only: [:new, :create]

  def new
    @user = User.new
  end

  def create
    @user = User.make_new_user(user_params)
    if @user.errors.empty?
      session[:user_id] = @user.id
      redirect_to root_path, flash: { message: 'Welcome!'}
    else
      render :new
    end
  end

  def edit

  end

  def update
    [:password, :password_confirmation, :avatar].each {|x| params.delete(x) if x.blank?}
    if @user.update(user_params)
      redirect_to root_path, flash: { message: 'Updated Successfully.'}
    else
      render :edit, flash: { message: 'Update failed.'}
    end
  end

  def destroy
    session.delete :user_id
    @user.delete
    redirect_to login_path
  end

  def create_admin
    @user.grant_admin_membership(@group)
    render json: @group
  end

  def delete_admin
    @user.remove_admin_membership(@group)
    render json: @group
  end

  def kick
    membership = Membership.find_by(group: @group, user: @user)
    membership.destroy
    redirect_to group_path(@group)
  end

  private

  def set_user
    @user = User.find_by(id: params[:id])
  end

  def set_nested_group
    @group = Group.find_by(id: params[:group_id])
  end

  def user_params
    params.require(:user).permit(:email, :name, :password, :password_confirmation, :avatar)
  end

end
