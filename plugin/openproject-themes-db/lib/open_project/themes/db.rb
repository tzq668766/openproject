module OpenProject
  module Themes
    module DB
      require 'open_project/themes/db/engine'

      def self.assets_path
        @assets_path ||= Engine.root.join('app/assets').to_s
      end
    end
  end
end
