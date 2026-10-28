class Theme
  attr_reader :name
  def initialize(name = 'Obsidian')
    @name = name
  end
  def describe
    "Theme: #{@name}"
  end
end
puts Theme.new.describe
