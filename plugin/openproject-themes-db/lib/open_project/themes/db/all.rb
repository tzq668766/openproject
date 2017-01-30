require 'open_project/themes/theme'

module OpenProject::Themes::DB
  class DBTheme < OpenProject::Themes::Theme
    def name
      'DB'
    end

    def assets_path
      OpenProject::Themes::DB.assets_path
    end
  end
end
