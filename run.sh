while :
    do
      jjs -fx -cp target/classes:target/dependency/* src/main/javascript/admin.js
      sleep 1
    done
