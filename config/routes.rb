Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :races
  root to: "races#index"
  get '/getdata', to: 'races#getdata'
  get '/nearby', to: 'races#nearby'
  get '/myrep', to: 'races#myrep'

end
