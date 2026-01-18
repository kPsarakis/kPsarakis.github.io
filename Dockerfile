FROM ruby:3.4.8-slim

ENV DEBIAN_FRONTEND=noninteractive

LABEL authors="Amir Pourmand,George Araújo" \
      description="Docker image for al-folio academic template" \
      maintainer="Amir Pourmand"

# install system dependencies
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
        build-essential \
        curl \
        git \
        imagemagick \
        inotify-tools \
        locales \
        nodejs \
        procps \
        python3-pip \
        zlib1g-dev && \
    pip --no-cache-dir install --upgrade --break-system-packages nbconvert && \
    apt-get clean && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/* /tmp/*

# set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && \
    locale-gen

ENV EXECJS_RUNTIME=Node \
    JEKYLL_ENV=production \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8

WORKDIR /srv/jekyll

COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock

RUN gem install --no-document jekyll bundler && \
    bundle config set --local path vendor/bundle && \
    bundle install

EXPOSE 8080

COPY bin/entry_point.sh /tmp/entry_point.sh
CMD ["/tmp/entry_point.sh"]
