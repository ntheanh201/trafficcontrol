pipeline {
    agent any

    environment {
        // Nexus credentials should be configured in Jenkins credentials
        NEXUS_CREDENTIAL_ID = 'nexus-credentials'
        NEXUS_URL = 'http://nexus:8081'
        // Nexus repository should be configured in Nexus yum(hosted) repository
        NEXUS_REPOSITORY = 'atc-rpms'
        NEXUS_GROUP_ID = 'org.apache.trafficcontrol'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build ATS') {
            steps {
                sh '''
                    # Build the ATS package
                    ./pkg -o -b -v ats

                    # Store RPM filenames for later use
                    find dist -name "*.rpm" -type f > rpm_files.txt
                '''

                // Archive the RPMs as Jenkins artifacts
                archiveArtifacts artifacts: 'dist/*.rpm', fingerprint: true
            }
        }

        stage('Upload to Nexus') {
            steps {
                script {
                    try {
                        echo "Starting Upload to Nexus stage"

                        withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDENTIAL_ID}",
                                                    usernameVariable: 'NEXUS_USER',
                                                    passwordVariable: 'NEXUS_PASS')]) {
                            echo "Credentials loaded successfully"

                            // Read the list of RPM files
                            def rpmFiles = readFile('rpm_files.txt').trim().split('\n')

                            rpmFiles.each { rpmFile ->
                                if (!fileExists(rpmFile)) {
                                    error "RPM file does not exist at ${rpmFile}"
                                }

                                def rpmName = rpmFile.tokenize('/')[-1]
                                echo "Processing RPM: ${rpmName}"

                                // Extract version from RPM filename using pattern matching
                                // Assuming filename format: name-version-release.arch.rpm
                                def version = sh(
                                    script: """
                                        filename=\$(basename ${rpmFile})
                                        echo \$filename | sed -E 's/.*-([0-9]+\\.[0-9]+\\.[0-9]+)-.*\\.rpm/\\1/'
                                    """,
                                    returnStdout: true
                                ).trim()

                                if (version.isEmpty() || version == rpmName) {
                                    error "Could not extract version from RPM filename: ${rpmName}"
                                }
                                echo "RPM version: ${version}"

                                // Upload to Nexus using curl
                                echo "Uploading to Nexus: ${NEXUS_URL}/repository/${NEXUS_REPOSITORY}/${NEXUS_GROUP_ID}/${version}/${rpmName}"
                                def curlResponse = sh(
                                    script: """
                                        curl -v -k -u ${NEXUS_USER}:${NEXUS_PASS} \
                                            --upload-file '${rpmFile}' \
                                            '${NEXUS_URL}/repository/${NEXUS_REPOSITORY}/${NEXUS_GROUP_ID}/${version}/${rpmName}'
                                    """,
                                    returnStatus: true
                                )

                                if (curlResponse != 0) {
                                    error "Curl upload failed with status ${curlResponse} for ${rpmName}"
                                }
                                echo "Upload completed for ${rpmName}"
                            }
                        }

                    } catch (Exception e) {
                        echo "Error in Upload to Nexus stage: ${e.getMessage()}"
                        error "Failed to upload to Nexus: ${e.getMessage()}"
                    }
                }
            }
        }
    }

    post {
        always {
            // Clean workspace after build
            cleanWs()
        }
        success {
            echo 'Successfully built and published RPM to Nexus'
        }
        failure {
            echo 'Failed to build or publish RPM'
        }
    }
}