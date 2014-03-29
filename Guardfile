# A sample Guardfile
# More info at https://github.com/guard/guard#readme

require 'open-uri'

PORT = 4444

guard :shell do
  def render
    open("http://localhost:#{PORT}/assets/css_style.css")
  rescue => e
    puts e.message
  end

  watch(%r{styles\/.+\.less})

  callback(:run_on_modifications_end) { render }
  callback(:run_all_end) { render }

  callback(:start_begin) do
    puts "starting up"
    @pid1 = spawn "ruby server.rb -p #{PORT}"
    @pid2 = spawn "theme watch"
  end

  callback(:stop_end) do
    puts "closing down"
    `kill -9 #{@pid1}`
    `kill -9 #{@pid2}`
  end
end
