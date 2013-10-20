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

module TextFilter
  def asset_url(input)
    "/assets/#{input}"
  end

  def stylesheet_tag(input)
    %Q{<link href="#{input}" rel="stylesheet" media="screen">}
  end

  def script_tag(input)
    %Q{<script src="#{input}"></script>}
  end
end

Liquid::Template.register_filter(TextFilter)

def style_css
  style = less(:'../style.css')
  style.gsub(/url\(([^)]+)\)/, %q{url('{{\1 | asset_url}}')}).tap do |content|
    File.open('assets/css_style.css.liquid', 'w') { |file| file.write(content) }
  end
end

get '/assets/css_style.css' do
  content_type :css
  Liquid::Template.parse(style_css).render()
end
