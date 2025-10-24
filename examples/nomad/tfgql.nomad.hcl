job "tfgql" {
  datacenters = ["*"]
  type        = "service"

  ui {
    description = "GraphQL facade for HCP Terraform and Terraform Enterprise"
    link {
      label = "TFGQL Documentation"
      url   = "https://jeremymefford.github.io/tfgql/"
    }
  }
  group "tfgql" {
    count = 1
    network {
      port "tfgql" {
        to = 4000
      }
    }
    service {
      name     = "tfgql"
      port     = "tfgql"
      provider = "nomad"
      check {
        name     = "alive"
        type     = "http"
        path     = "/health"
        interval = "10s"
        timeout  = "10s"
      }
    }
    restart {
      # The number of attempts to run within the specified interval.
      attempts = 2
      interval = "30m"
      delay    = "15s"
      mode     = "fail"
    }

    task "tfgql" {
      driver = "docker"
      config {
        image = "ghcr.io/jeremymefford/tfgql:latest"
        ports = ["tfgql"]
      }

      template {
        change_mode = "restart"
        env         = true
        destination = "${NOMAD_SECRETS_DIR}/secrets.env"
        data        = <<EOH
{{ with nomadVar "nomad/jobs/tfgql" }}
TFGQL_JWT_ENCRYPTION_KEY={{ .TFGQL_JWT_ENCRYPTION_KEY }}
{{ end }}
EOH
      }


      resources {
        cpu    = 500 # 500 MHz
        memory = 256 # 256MB
      }
    }
  }
}