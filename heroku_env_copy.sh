# The script below allows you to easily transfer all Heroku Config Vars (i.e. 
# ENV vars) from an existing Heroku project to a new Heroku project from the
# command line. If you need to ignore one or more keys from the existing Heroku
# project, you may. Please see instructions below.

# Instructions
# 1. Have Heroku CLI installed on machine
#    (https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
# 2. Run "heroku login" to login from command line
# 3. Run "heroku apps" to quickly see the names of your apps
# 4. Add this script file to the Desktop, "cd" into Desktop,
#    run "bash ./config_vars.sh matts-source-app matts-target-app"
# 5. Enjoy new Config Vars!
# (Note: if same key exists in new Heroku project, it will be overwritten)

# After this is done, you can add more NEW config vars to new Heroku project
# with the following command:
# "heroku config:set LOGGER_LEVEL=debug ENV=production CRYPTO_SECRET=guesswhat"


set -e

sourceApp="$1"
targetApp="$2"
# ignoredKeys=(MONGOBD_URI)
config=""

while read key value; do
  key=${key%%:}

  if [[ ${ignoredKeys[*]} =~ $key ]];
    then
      echo "Ignoring $key=$value"
    else
      config="$config $key=$value"
  fi
done < <(heroku config --app "$sourceApp" | sed -e '1d')

eval "heroku config:set $config --app $targetApp"