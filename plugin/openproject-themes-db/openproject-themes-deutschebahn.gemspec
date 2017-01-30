$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "open_project/themes/db/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "openproject-themes-db"
  s.version     = OpenProject::Themes::DB::VERSION
  s.authors     = ["OpenProject Gmbh", "Christian Ratz"]
  s.email       = "info@openproject.com"
  s.homepage    = "http://www.openproject.com/"
  s.summary     = "Custom OpenProject theme"
  s.description = "Custom OpenProject theme for OpenProject for Deutsche Bahn"

  s.files = Dir["{app,lib}/**/*", "Rakefile", "README.rdoc"]

  s.add_dependency 'rails', '~> 5.0.0'
end
