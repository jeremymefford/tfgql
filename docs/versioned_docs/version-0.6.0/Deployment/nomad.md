---
title: Nomad
description: Deployment of TFGQL with HashiCorp Nomad
---

# Deploying TFGQL on Nomad

This example shows how to run the TFGQL on HashiCorp Nomad using the provided job file `tfgql.nomad.hcl`.

The job runs a single service task using the Docker driver, exposes port 4000 from the container, performs health checks against `/health`, and injects secrets via Nomad Variables.

## Files

- `tfgql.nomad.hcl` — Nomad job spec configured to run `ghcr.io/jeremymefford/tfgql:vx.x.x`, expose port 4000, and wire in a JWT encryption key from Nomad Variables.

## Prerequisites

- Nomad clients with Docker driver enabled
- Access to Nomad UI or CLI to run jobs. 
- Ability to write to Nomad Variables (for secrets)

## Running Nomad in Dev Mode

If you don't have a Nomad cluster available, you can run a local development instance of Nomad using the following command. 

Install Nomad from https://developer.hashicorp.com/nomad/install.

Then start a local dev agent: 

```bash
nomad agent -dev
```

You should see output similar to this:

```bash
==> No configuration files loaded
==> Starting Nomad agent...
==> Nomad agent configuration:
       Advertise Addrs: HTTP: 127.0.0.1:4646; RPC: 127.0.0.1:4647; Serf: 127.0.0.1:4648
            Bind Addrs: HTTP: [127.0.0.1:4646]; RPC: 127.0.0.1:4647; Serf: 127.0.0.1:4648
                Client: true
             Log Level: DEBUG
               Node Id: f2e7cf99-9f69-7582-2548-8a01242659fd
                Region: global (DC: dc1)
                Server: true
               Version: 1.10.4
==> Nomad agent started! Log data will stream in below:
```

To open the UI, run: 

```bash
nomad ui
```

You should see output similar to this - and be automatically redirected to the Nomad UI in your browser:

```bash
Opening URL "http://127.0.0.1:4646"
```

:::info
There could be caveats to running Nomad on your local machine which I could not go into detail. Such as [How to connect to my host network when using Docker Desktop (Windows and MacOS)?](https://developer.hashicorp.com/nomad/docs/faq#q-how-to-connect-to-my-host-network-when-using-docker-desktop-windows-and-macos). 
:::


## Set required secret in Nomad Variables

The job reads a secret from the Nomad variable path `nomad/jobs/tfgql` and writes it to an environment file inside the allocation (`${NOMAD_SECRETS_DIR}/secrets.env`). At minimum, set the following Nomad variable:

- `TFGQL_JWT_ENCRYPTION_KEY` — secret used to derive the AES key for encrypting issued JWTs

```bash
nomad var put nomad/jobs/tfgql TFGQL_JWT_ENCRYPTION_KEY="$(openssl rand -base64 32)"
```

Sample output:

```bash
Created variable "nomad/jobs/tfgql" with modify index 194
==> View variable details in the Web UI: http://127.0.0.1:4646/ui/variables/var/nomad/jobs/tfgql@default
```

Notes
- The job template block uses `nomadVar "nomad/jobs/tfgql"` and `env = true`, so all keys at that path become environment variables.
- You can add additional TFGQL configuration the same way (e.g., `TFE_BASE_URL`, `TFGQL_PAGE_SIZE`, etc.). See project docs and `src/common/conf.ts` for supported variables.

## Run the job

From this directory or referencing the path from repo root, submit the job:

```bash
nomad job run tfgql.nomad.hcl
```

Example output:

```bash
==> 2025-10-24T13:00:54-04:00: Monitoring evaluation "1a7f6157"
    2025-10-24T13:00:54-04:00: Evaluation triggered by job "tfgql"
    2025-10-24T13:00:54-04:00: Evaluation within deployment: "a4be9c7b"
    2025-10-24T13:00:54-04:00: Allocation "bfbb6e96" created: node "9bad4462", group "tfgql"
    2025-10-24T13:00:54-04:00: Evaluation status changed: "pending" -> "complete"
==> 2025-10-24T13:00:54-04:00: Evaluation "1a7f6157" finished with status "complete"
==> 2025-10-24T13:00:54-04:00: Monitoring deployment "a4be9c7b"
  ⠧ Deployment "a4be9c7b" in progress...
    
    2025-10-24T13:00:54-04:00
    ID          = a4be9c7b
    Job ID      = tfgql
    Job Version = 0
    Status      = running
    Description = Deployment is running
    
    Deployed
    Task Group  Desired  Placed  Healthy  Unhealthy  Progress Deadline
    tfgql       1        1       0        0          2025-10-24T13:10:54-04:00
```

When the deployment completes successfully, you should see it updated like this:

```bash
==> 2025-10-24T13:02:14-04:00: Monitoring evaluation "1a7f6157"
    2025-10-24T13:02:14-04:00: Evaluation triggered by job "tfgql"
    2025-10-24T13:02:14-04:00: Evaluation within deployment: "a4be9c7b"
    2025-10-24T13:02:14-04:00: Allocation "bfbb6e96" created: node "9bad4462", group "tfgql"
    2025-10-24T13:02:14-04:00: Evaluation status changed: "pending" -> "complete"
==> 2025-10-24T13:02:14-04:00: Evaluation "1a7f6157" finished with status "complete"
==> 2025-10-24T13:02:14-04:00: Monitoring deployment "a4be9c7b"
  ✓ Deployment "a4be9c7b" successful
    
    2025-10-24T13:02:32-04:00
    ID          = a4be9c7b
    Job ID      = tfgql
    Job Version = 1
    Status      = successful
    Description = Deployment completed successfully
    
    Deployed
    Task Group  Desired  Placed  Healthy  Unhealthy  Progress Deadline
    tfgql       1        1       1        0          2025-10-24T13:12:30-04:00
```


## Verify health and connectivity

The service exposes container port `4000` as a mapped dynamic host port. To discover the mapped port on a given allocation, first get the allocation ID :

```bash
nomad job allocs tfgql
```

Example Output:

```bash
ID        Node ID   Task Group  Version  Desired  Status    Created    Modified
10662c9b  9bad4462  tfgql       1        run      running   4m8s ago   3m52s ago
```

Run the following command using the allocation ID from above to get the allocation status:

```bash
nomad alloc status <alloc-id>
```

Example Output:

```bash
ID                  = 10662c9b-e813-8089-a9eb-65a3051af9b5
Eval ID             = 47309be4
Name                = tfgql.tfgql[0]
Node ID             = 9bad4462
Node Name           = benjamin.lykins-KT2YYXQG9Y
Job ID              = tfgql
Job Version         = 1
Client Status       = running
Client Description  = Tasks are running
Desired Status      = run
Desired Description = <none>
Created             = 7m31s ago
Modified            = 7m15s ago
Deployment ID       = c71efdaa
Deployment Health   = healthy
Allocation Addresses:
Label   Dynamic  Address
*tfgql  yes      127.0.0.1:27675 -> 4000
Nomad Service Checks:
Service  Task     Name   Mode         Status
tfgql    (group)  alive  healthiness  success
Task "tfgql" is "running"
Task Resources:
CPU        Memory          Disk     Addresses
0/500 MHz  44 MiB/256 MiB  300 MiB  
Task Events:
Started At     = 2025-10-24T17:02:15Z
Finished At    = N/A
Total Restarts = 0
Last Restart   = N/A
Recent Events:
Time                       Type        Description
2025-10-24T13:02:15-04:00  Started     Task started by client
2025-10-24T13:02:15-04:00  Driver      Downloading image
2025-10-24T13:02:15-04:00  Task Setup  Building Task Directory
2025-10-24T13:02:14-04:00  Received    Task received by client
```


Look under the Allocation Addresses section for `tfgql` and use the host/port to connect - my output from above shows the mapped port is `27675` on `127.0.0.1`. 

You can also curl to confirm connectivity:

```bash
curl http://<alloc-id>:<mapped-port>/health
```

With a `{status: "ok"}` response, you can go ahead and connect with your browser: 

![TFGQL](../assets/nomadBrowser.png)

## Uninstall / Cleanup

You can stop stop your Nomad agent from running by terminating the process in the terminal where it's running.

Or if you just want to remove the TFGQL job, you can do the following:

Stop and purge the job:

```bash
nomad job stop -purge tfgql
```

Optionally remove the Nomad variable:

```bash
nomad var delete -path=nomad/jobs/tfgql
```

---

## Example tfgql.nomad.hcl
```hcl
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
```