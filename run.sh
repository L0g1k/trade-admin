if [ $1="cp" ]; then
mvn -Dmdep.outputFile=classpath.txt dependency:build-classpath
fi

while :
    do
      jjs -fx -cp target/classes:$(cat classpath.txt) src/main/javascript/admin.js
      sleep 1
    done
