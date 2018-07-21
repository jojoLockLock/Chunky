pipeline {
  agent any
  stages {
    stage('') {
      steps {
        sh 'echo \'hello world\''
        git(url: 'https://github.com/jojoLockLock/Chunky.git', branch: 'master', changelog: true, poll: true)
      }
    }
  }
}