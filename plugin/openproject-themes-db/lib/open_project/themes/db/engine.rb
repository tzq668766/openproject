module OpenProject::Themes::DB
  class Engine < ::Rails::Engine
    engine_name :openproject_themes_db

    initializer 'themes.db.register_themes' do
      ActiveSupport.on_load(:themes) do
        require 'open_project/themes/db/all'
      end
    end

    initializer 'themes.db.precompile_assets' do |app|
      app.config.assets.precompile += %w(db/favicon.ico db/logo.png)
    end

    config.to_prepare do
      require 'redmine/plugin'
      require 'open_project/themes/db/version'

      Redmine::Plugin.register 'DB-Theme' do
        name 'DB Theme'
        author 'OpenProject GmbH'
        description 'Custom theme for OpenProject'
        version OpenProject::Themes::DB::VERSION
        url 'https://github.com/finnlabs/finnlabs-themes'
        author_url 'http://www.finn.de'
      end
    end
  end
end
