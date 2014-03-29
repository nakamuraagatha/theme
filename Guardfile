# A sample Guardfile
# More info at https://github.com/guard/guard#readme

require 'open-uri'

guard :shell do
  def render
    puts 're-render styles'
    open('http://localhost:4567/assets/css_style.css')
  rescue => e
    puts e.message
  end

  watch(%r{styles\/.+\.less})

  callback(:run_on_modifications_end) { render }
  callback(:run_all_end) { render }

  callback(:start_begin) do
    puts "start up"
    @pid1 = spawn 'ruby server.rb'
    @pid2 = spawn 'theme watch'
  end

  callback(:stop_end) do
    `kill -9 #{@pid1}`
    `kill -9 #{@pid2}`
    puts "closing down"
  end
end
