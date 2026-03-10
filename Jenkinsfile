pipeline {
    agent any
    tools {
        maven 'Maven3'
        jdk 'jdk-17'
    }
    environment {
        DOCKERHUB_CREDENTIALS_ID = 'darksolu'
        DOCKERHUB_REPO = 'darksolu'
        DOCKER_IMAGE_TAG = 'p1'
    }
    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'Github',
                    url: 'https://github.com/MarcusHoanggg/Personalized-Study-Planner',
                    branch: 'docker'
            }
        }
        stage('Build Backend') {
            steps {
                dir('Backend') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }
        stage('Test Backend') {
            steps {
                dir('Backend') {
                    bat 'mvn test -Dmaven.test.failure.ignore=true'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'Backend/**/target/surefire-reports/*.xml'
                }
            }
        }
        stage('Build Docker Images') {
            steps {
                script {
                    docker.build("${DOCKERHUB_REPO}/backend:${DOCKER_IMAGE_TAG}", "./Backend")
                    docker.build("${DOCKERHUB_REPO}/frontend:${DOCKER_IMAGE_TAG}", "./Frontend")
                }
            }
        }
        stage('Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS_ID) {
                        docker.image("${DOCKERHUB_REPO}/backend:${DOCKER_IMAGE_TAG}").push()
                        docker.image("${DOCKERHUB_REPO}/frontend:${DOCKER_IMAGE_TAG}").push()
                    }
                }
            }
        }
        stage('Deploy with Docker Compose') {
            steps {
                withCredentials([file(credentialsId: 'env-file', variable: 'ENV_FILE')]) {
                    bat 'copy "%ENV_FILE%" .env'
                    bat 'docker rm -f study_planner_db study_planner_backend study_planner_frontend || exit 0'
                    bat 'docker compose down --remove-orphans'
                    bat 'docker compose up -d'
                }
            }
        }
    }
    post {
        failure {
            echo 'Pipeline failed. Check the logs above.'
        }
        success {
            echo 'Pipeline succeeded!'
            echo 'Frontend: http://localhost:3000'
            echo 'Backend:  http://localhost:8081'
        }
    }
}