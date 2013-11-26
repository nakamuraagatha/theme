require 'bundler/setup'

require 'sinatra'
require 'sinatra/reloader' if development?

require 'less'
require 'liquid'

set :public_folder, File.dirname(__FILE__)
set :views, settings.root + '/templates'

get '/' do
  content = liquid :index, :locals => {}

  liquid :'../layout/theme', :locals => {
    :template           => "index",
    :page_description   => "desc",
    :content_for_header => "",
    :content_for_layout => content,
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

Liquid::Template.file_system = Liquid::LocalFileSystem.new("../snippets")
Liquid::Template.register_filter(TextFilter)

def style_css(source, target)
  style = less "../styles/#{source}".to_sym, :compress => true
  style.gsub(/url\('([^)]+)'\)/, %q{url('{{'\1' | asset_url}}')}).tap do |content|
    File.open("assets/#{target}", 'w') { |file| file.write(content) }
  end
end


get '/assets/css_style.css' do
  content_type :css
  style_css('checkout', 'checkout.css.liquid')
  css = style_css('main', 'css_style.css.liquid')
  Liquid::Template.parse(css).render()
end
