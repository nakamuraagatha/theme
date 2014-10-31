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
    content.gsub!(' \9', '')
    File.open("assets/#{target}", 'w') { |file| file.write(content) }
  end
end

def combine_js
  content = [
    # 'vendor/jquery-1.11.0.min.js',
    'vendor/bootstrap.min.js',
    'vendor/api.min.js',
    'vendor/jquery.fancybox.pack.js',
    'vendor/jquery.fancybox-thumbs.pack.js',
    'lib/option_selector.js',
    # 'lib/option_selector-old.js',
    'main.js',
  ].map do |file_name|
    File.read("javascripts/#{file_name}")
  end.join("\n")

  File.open("assets/js_script.js", 'w') { |file| file.write(content) }
  content
end

get '/assets/script.js' do
  combine_js
end

get '/assets/css_style.css' do
  combine_js
  content_type :css
  css = style_css('main', 'css_style.css.liquid')
  Liquid::Template.parse(css).render()
end
