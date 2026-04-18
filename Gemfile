source 'https://rubygems.org'
group :jekyll_plugins do
    gem 'classifier-reborn'
    gem 'jekyll'
    gem 'jekyll-archives'
    gem 'jekyll-email-protect'
    gem 'jekyll-feed'
    gem 'jekyll-get-json'
    gem 'jekyll-imagemagick'
    gem 'jekyll-jupyter-notebook'
    gem 'jekyll-link-attributes'
    gem 'jekyll-minifier'
    gem 'jekyll-paginate-v2'
    gem 'jekyll-regex-replace'
    gem 'jekyll-scholar'
    gem 'jekyll-sitemap'
    gem 'jekyll-tabs'
    gem 'jekyll-toc'
    gem 'jekyll-twitter-plugin'
    gem 'jemoji'
    gem 'unicode_utils'
    gem 'webrick'
end
group :other_plugins do
    gem 'css_parser'
    gem 'feedjira'
    gem 'httparty'
end

# Gems being evicted from Ruby's default set in 4.0; pin explicitly so
# the build keeps working without the "X is found in Y, will no longer
# be a default gem in Ruby 4.0" warnings on every run. These are
# transitive dependencies (fiddle via win32/registry on Windows, ostruct
# via jekyll-twitter-plugin) that we don't use directly.
gem 'fiddle'
gem 'ostruct'
