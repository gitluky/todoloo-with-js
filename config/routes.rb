Rails.application.routes.draw do
  root 'application#index'

  resources :users, only: [:index, :new, :create, :edit, :update, :destroy]

  resources :groups do
    resources :invitations, only: [:new, :create, :accept, :destroy]
    get '/tasks/completed_tasks', to: 'tasks#completed_tasks', as: 'completed_tasks'
    resources :tasks, only: [:new, :create, :show, :edit, :update, :destroy]
    resources :announcements, only: [:index, :new, :create, :edit, :update, :destroy]
    get '/users/:id/create_admin', to: 'users#create_admin', as: 'create_admin'
    get '/users/:id/delete_admin', to: 'users#delete_admin', as: 'delete_admin'
    get '/users/:id/kick', to: 'users#kick', as: 'kick_member'
    get '/invitations/:id/accept', to: 'invitations#accept', as: 'accept_invitation'
  end
    get 'groups/:id/group_data', to: 'groups#group_data'

  resources :tasks do
    resources :notes, only: [:new, :create, :edit, :update, :destroy]
  end


  get '/user_feed', to: 'application#user_feed'
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  get '/logout', to: 'sessions#destroy'
  get '/volunteer/:id', to: 'tasks#volunteer', as: 'volunteer'
  get '/drop_task/:id', to: 'tasks#drop_task', as: 'drop_task'
  get '/tasks/:id/complete', to: 'tasks#complete', as: 'complete'
  get '/tasks/:id/incomplete', to: 'tasks#incomplete', as: 'incomplete'

  get '/auth/facebook/callback', to: 'sessions#create'

end
