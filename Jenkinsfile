pipeline {
    agent any
    tools {
        maven 'Maven3'
        jdk 'jdk-17'
    }

    environment {
        PATH = "C:\\Program Files\\Docker\\Docker\\resources\\bin;${env.PATH}"
        DOCKERHUB_CREDENTIALS_ID = 'darksolu'
        DOCKERHUB_REPO = 'darksolu'
        DOCKER_IMAGE_TAG = 'p1'
        
        DB_URL = 'jdbc:postgresql://postgres:5432/study_planner'
        DB_USERNAME = 'java'
        DB_PASSWORD = 'java'
    }

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'Github', 
                url: 'https://github.com/MarcusHoanggg/Personalized-Study-Planner', 
                branch: 'docker'
            }
        }
        stage('Build') {
            steps {
                dir('Backend') {
                   bat 'mvn clean package -DskipTests'
                }
            }
        }
        stage('Test') {
            steps {
                dir('Backend') {
                    bat 'mvn test'
                }
            }
        }

        stage('Publish Test Results') {
            steps {
                junit 'Backend/**/target/surefire-reports/*.xml'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKERHUB_REPO}/backend:${DOCKER_IMAGE_TAG}", "./Backend")
                    docker.build("${DOCKERHUB_REPO}/frontend:${DOCKER_IMAGE_TAG}", "./Frontend")
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS_ID) {
                        docker.image("${DOCKERHUB_REPO}/backend:${DOCKER_IMAGE_TAG}").push()
                        docker.image("${DOCKERHUB_REPO}/frontend:${DOCKER_IMAGE_TAG}").push()
                    }
                }
            }
        }
    }
}