pipeline {
    agent any
    tools {
        maven 'maven'
        jdk 'jdk-21'
    }

    environment {
        PATH = "C:\\Program Files\\Docker\\Docker\\resources\\bin;${env.PATH}"
        DOCKERHUB_CREDENTIALS_ID = 'docker-hub'
        DOCKERHUB_REPO = 'mustah21'
        DOCKER_IMAGE_TAG = 'p1'
    }



    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'Github', url: 'https://github.com/MarcusHoanggg/Personalized-Study-Planner', branch: 'musti'
            }
        }
        stage('Build') {
            steps {
                    bat 'mvn clean install'
            }
        }
        stage('Test') {
            steps {
                    bat 'mvn test'
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
                    docker.build("${DOCKERHUB_REPO}:${DOCKER_IMAGE_TAG}", "./Backend")
                    docker.build("${DOCKERHUB_REPO}:${DOCKER_IMAGE_TAG}", "./Frontend")
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS_ID) {
                        docker.image("${DOCKERHUB_REPO}/Backend:${DOCKER_IMAGE_TAG}").push()
                        docker.image(${DOCKERHUB_REPO}:/frontend:${DOCKER_IMAGE_TAG}").push()
                    }
                }
            }
        }




    }
}