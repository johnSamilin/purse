#!/bin/bash
  wget https://cli-assets.heroku.com/branches/stable/heroku-linux-amd64.tar.gz
  sudo mkdir -p /usr/local/lib /usr/local/bin
  sudo tar -xvzf heroku-linux-amd64.tar.gz -C /usr/local/lib
  sudo ln -s /usr/local/lib/heroku/bin/heroku /usr/local/bin/heroku
     
  cat > ~/.netrc << EOF
  machine api.heroku.com
    login $HEROKU_LOGIN
    password $HEROKU_API_KEY
  machine git.heroku.com
    login $HEROKU_LOGIN
    password $HEROKU_API_KEY
EOF

  cat >> ~/.ssh/config << EOF
  VerifyHostKeyDNS yes
  StrictHostKeyChecking no
EOF

  cat >> dist/composer.json << EOF
  {}
EOF

  cat >> dist/index.php << EOF
  <?php include_once('index.html'); ?>
EOF

  cat >> dist/.htaccess << EOF
  <IfModule mod_rewrite.c>
    #Options -MultiViews

    RewriteEngine On
    #RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.html [QSA,L]
  </IfModule>
EOF