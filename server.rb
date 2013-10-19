require 'bundler/setup'

require 'sinatra'
require 'sinatra/reloader' if development?

require 'less'
# require 'liquid'

set :public_folder, File.dirname(__FILE__)
set :views, settings.root + '/templates'

get '/' do
  content = liquid :index, :locals => {}

  liquid :'../layout/theme', :locals => {
    :template           => "index",
    :page_description   => "desc",
    :content_for_header => "",
    :content_for_layout => content,
    # :cart => OpenStruct.new({
    #   :item_count => 8,
    # }),
    # :cart2 => {
    #   :item_count => 9,
    # },
    # :'cart.item_count' => 10,
    # :cart_item_count => 11,
  }
end

get '/assets/css/style.css' do
  less :'../assets/css/style.css'
end
