pipeline {
    agent any

    environment {
        PNPM_HOME    = '/root/.local/share/pnpm'
        PATH         = "${env.PNPM_HOME}:${env.PATH}"
        CI           = 'true'
        BASE_URL     = 'http://minimalist_web:3000'
        NOTIFY_EMAIL = "${env.NOTIFY_EMAIL}"
        SMTP_USER    = "${env.SMTP_USER}"
        SMTP_PASS    = "${env.SMTP_PASS}"
        EMAIL_FROM   = "${env.SMTP_USER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Back-End') {
            stages {
                stage('Back: Test') {
                    steps {
                        dir('back-app') {
                            sh 'chmod +x mvnw'
                            sh './mvnw test'
                        }
                    }
                    post {
                        always {
                            junit 'back-app/target/surefire-reports/*.xml'
                        }
                    }
                }

                stage('Back: Build') {
                    steps {
                        dir('back-app') {
                            sh 'chmod +x mvnw'
                            sh './mvnw package -DskipTests -q'
                        }
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'back-app/target/*.jar', fingerprint: true
                        }
                    }
                }
            }
        }

        stage('Front-End') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.52.0-noble'
                    // --network: join the same bridge network as web-app and back-app
                    args '--ipc=host -u root --network minimalist_net'
                    reuseNode true
                }
            }

            stages{
                stage('Install pnpm') {
                    steps {
                        sh 'npm install -g pnpm@11.4.0'
                        sh 'pnpm --version'
                    }
                }

                stage('Install Dependencies') {
                    steps {
                        dir('web-app') {
                            sh 'pnpm install --frozen-lockfile'
                        }
                    }
                }

                stage('Install Playwright Browsers') {
                    steps {
                        dir('web-app') {
                            sh 'pnpm exec playwright install --with-deps chromium'
                        }
                    }
                }

                stage('Build') {
                    steps {
                        dir('web-app') {
                            sh 'pnpm build'
                        }
                    }
                }

                stage('Run Playwright Tests') {
                    steps {
                        dir('web-app') {
                            sh 'pnpm exec playwright test'
                        }
                    }
                    post {
                        always {
                            dir('web-app') {
                                publishHTML(target: [
                                    allowMissing         : true,
                                    alwaysLinkToLastBuild: true,
                                    keepAll              : true,
                                    reportDir            : 'playwright-report',
                                    reportFiles          : 'index.html',
                                    reportName           : 'Playwright Report'
                                ])
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            dir('web-app') {
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                archiveArtifacts artifacts: 'test-results/**',      allowEmptyArchive: true
            }
        }
        success {
            sh "python3 notify/scripts/notify_pipeline.py --status SUCCESS --email ${NOTIFY_EMAIL}"
        }
        failure {
            sh "python3 notify/scripts/notify_pipeline.py --status FAILURE --email ${NOTIFY_EMAIL}"
        }
    }
}
