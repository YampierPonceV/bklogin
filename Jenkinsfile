pipeline {
    agent any

    environment {
        // ID del bot de Telegram y Chat ID
        TELEGRAM_BOT_TOKEN = '8954173902:AAHNJJkro3zPbK1F4nSaAufZG6gwSMZls4I'
        TELEGRAM_CHAT_ID   = '6237311128'
    }

    stages {
        stage('Checkout') {
            steps {
                // Jenkins descarga el código del repositorio automáticamente
                checkout scm
            }
        }

        stage('Deploy with Ansible') {
            steps {
                script {
                    // Ejecuta el playbook de Ansible
                    sh 'ansible-playbook -i ansible/inventory.ini ansible/playbook.yml'
                }
            }
        }
    }

    post {
        success {
            script {
                def message = "✅ *Despliegue Exitoso*\n\n" +
                              "📦 *Proyecto:* ${env.JOB_NAME}\n" +
                              "🔢 *Build:* #${env.BUILD_NUMBER}\n" +
                              "🌐 *Servidor:* http://192.168.1.30:3000\n" +
                              "👤 *Commit por:* ${env.CHANGE_AUTHOR ?: 'DevOps'}"

                sh """
                    curl -s -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage \
                    -d chat_id=${TELEGRAM_CHAT_ID} \
                    -d parse_mode="Markdown" \
                    -d text="${message}"
                """
            }
        }
        failure {
            script {
                def message = "❌ *Despliegue Fallido*\n\n" +
                              "📦 *Proyecto:* ${env.JOB_NAME}\n" +
                              "🔢 *Build:* #${env.BUILD_NUMBER}\n" +
                              "⚠️ Por favor revisar la consola de Jenkins."

                sh """
                    curl -s -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage \
                    -d chat_id=${TELEGRAM_CHAT_ID} \
                    -d parse_mode="Markdown" \
                    -d text="${message}"
                """
            }
        }
    }
}